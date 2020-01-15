import {
  ChangeDetectorRef,
  Directive,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import {
  combineLatest,
  isObservable,
  NextObserver,
  Observable,
  Observer,
  of,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  startWith,
  switchAll,
  tap,
} from 'rxjs/operators';
import { STATE_DEFAULT } from '../core/state-default';
import { getChangeDetectionHandler } from '../core/get-change-detection-handling';

interface NgRxLetConfig {
  optimized: boolean;
}

/**
 * @description
 * NgRxLet Structural Directive
 *
 * The `*let` directive serves a convenient way of binding observables to a view context (a dom element scope).
 * It also helps with several internal processing under the hood.
 * The current way of handling subscriptions in the view looks like that:
 * ```html
 * <ng-container *ngIf="observable1$ | async as c">
 *   <app-color [color]="c.color" [shape]="c.shape" [name]="c.name">
 *   </app-color>
 * </ng-container>
 *  ```
 *
 * The `*let` directive take over several things and makes it more convenient and save to work with streams in the template
 * `*let="{o: o$, t: t$} as s;"`
 *
 * ```html
 * <!-- observables = { color: observable1$, shape: observable2$, name:  observable3$ } -->
 *
 * <ng-container *let="observable as c">
 *   <app-color [color]="c.color" [shape]="c.shape" [name]="c.name">
 *   </app-color>
 * </ng-container>
 *
 * <ng-container *let="observable; let c">
 *   <app-color [color]="c.color" [shape]="c.shape" [name]="c.name">
 *   </app-color>
 * </ng-container>
 * ```
 *
 * Included Features:
 * - binding is always present. (`*ngIf="boolean$"`)
 * - it takes away the multiple usages of the `async` pipe
 * - a unified/structured way of handling null and undefined
 * - triggers change-detection differently if `zone.js` is present or not (`detectChanges` or `markForCheck`)
 * - distinct same values in a row (distinctUntilChanged operator)
 */

/**
 * @TODO consider:
 * <ng-container *let="observable; color as c; shape as s; name as n">
 *   <app-color [color]="c" [shape]="s" [name]="n">
 *     </app-color>
 * </ng-container>
 */
export class LetContext {
  constructor(
    // to enable let we have to use $implicit
    public $implicit?: any,
    // to enable as we have to assign this
    public ngrxLet?: any,
    // value of error of undefined
    public $error?: Error | undefined,
    // true or undefined
    public $complete?: true | undefined
  ) {}
}

@Directive({
  selector: '[ngrxLet]',
})
export class LetDirective implements OnInit, OnDestroy {
  // The method changes weather if `zone.js` is present or not
  private handleChangeDetection: () => void;
  // @NOTE We use Subscription here because its cheaper than the takeUntil approach
  private subscription = new Subscription();

  private ViewContext = new LetContext();
  private letConfig$ = new ReplaySubject<NgRxLetConfig>(1);
  private observables$ = new ReplaySubject<Observable<any>>(1);

  @Input()
  set ngrxLet(obs: Observable<any>) {
    // As we have nothing to display and we dont know the shape
    // We do nothing (NEVER constant)
    if (obs === null || obs === undefined) {
      this.observables$.next(of(STATE_DEFAULT));
    } else if (isObservable(obs)) {
      this.observables$.next(obs);
    }
    // @TODO implement proper error
    else {
      throw new Error('NgRxLet Error wrong type');
    }
  }

  @Input('ngrxLetConfig')
  set letConfig(config: NgRxLetConfig) {
    this.letConfig$.next(config);
  }

  // @NOTE the incoming value is just a trigger
  resetContextObserver: NextObserver<any> = {
    // for every value reset context
    next: _ => {
      // @TODO find out why we have to mutate the context object
      this.ViewContext.$implicit = undefined;
      this.ViewContext.ngrxLet = undefined;
      this.ViewContext.$error = undefined;
      this.ViewContext.$complete = undefined;
    },
  };

  updateContextObserver: Observer<any> = {
    next: v => {
      // @TODO find out why we have to mutate the context object
      // to enable `let` syntax we have to use $implicit (var; let v = var)
      this.ViewContext.$implicit = v;
      // to enable `as` syntax we have to assign the directives selector (var as v)
      this.ViewContext.ngrxLet = v;
    },
    error: e => {
      // set context var complete to true (var$; let v = $error)
      this.ViewContext.$error = e;
    },
    complete: () => {
      // set context var complete to true (var$; let v = $complete)
      this.ViewContext.$complete = true;
    },
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private readonly templateRef: TemplateRef<LetContext>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.handleChangeDetection = getChangeDetectionHandler(
      this.ngZone,
      this.cdRef
    );

    combineLatest(
      this.observables$.asObservable().pipe(
        tap(this.resetContextObserver),
        tap(_ => this.handleChangeDetection())
      ),
      this.letConfig$.pipe(startWith(false))
    )
      .pipe(
        map(([state$, config]) => {
          // @NOTICE Configure observable here with NgRxLetConfig
          return state$.pipe(
            // update context variables
            tap(this.updateContextObserver),
            tap(_ => this.handleChangeDetection())
          );
        }),
        switchAll(),
        distinctUntilChanged()
      )
      .subscribe();
  }

  ngOnInit() {
    // @TODO https://github.com/angular/angular/issues/15280#issuecomment-430479166
    // @TODO Also consider this.viewContainerRef.clear(); maybe in ngOnDestroy?
    this.viewContainerRef.createEmbeddedView(
      this.templateRef,
      this.ViewContext
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

function isObject<Inp>(x: Inp) {
  return x !== null && typeof x === 'object';
}
