import {
  ChangeDetectorRef,
  EmbeddedViewRef,
  NgZone,
  OnDestroy,
  Pipe,
  PipeTransform,
  Type,
} from '@angular/core';
import { isObservable, Observable, of, Subject, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  switchAll,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { getChangeDetectionHandler } from '../core/get-change-detection-handling';
import {
  getRequestAnimationFrameFromZoneFullEnv,
  observeOncePerAnimationFrame,
  STATE_DEFAULT,
  stateful,
} from '../core';

interface NgRxPushPipeConfig {
  optimized: boolean;
}

/**
 * @description
 *
 * An angular pipe similar to the async pipe but contains intelligent handling of change detection.
 * This is required to run zone-less as well as zone-full.
 *
 * The `push` pipe subscribes to an `Observable` and returns the latest value it has
 * emitted. When a new value is emitted, the `ngrx-push` pipe detects changes in the component.
 * When the component gets destroyed, the `push` pipe unsubscribes automatically to avoid
 * potential memory leaks.
 *
 * The pipe should work as template binding {{thing$ | push}}
 * as well as input binding [color]="thing$ | push" and trigger the changes of the host component.
 *
 * ```
 * <div *ngIf="thing$ | ngrx-push as thing">
 *   color: {{thing.color}}
 *   shape: {{thing.shape}}
 * <div>
 *
 * <app-color [color]="(thing$ | ngrx-push).color">
 * </app-color>
 * ```
 *
 * Included Features:
 * - subscription handling over view life cycle
 * - a unified/structured way of handling null and undefined
 * - triggers change-detection differently if `zone.js` is present or not (`detectChanges` or `markForCheck`)
 * - distinct same values in a row (distinctUntilChanged operator)
 */
// @TODO remove `pure: false` and experiment without zone
@Pipe({ name: 'ngrxPush', pure: false })
export class PushPipe implements PipeTransform, OnDestroy {
  // requestAnimationFrameId holds id of latest scheduled animationFrame of all child's (static) of PushPipe
  static requestAnimationFrameId = -1;
  // @TODO Fix any type should be T of transform function
  private value: any = STATE_DEFAULT;

  private handleChangeDetection: <T>(component?: T) => void;
  private work: () => void;

  subscription = new Subscription();

  // @TODO Fix any type should be T of transform function
  observablesToSubscribe$$ = new Subject<Observable<any>>();
  observablesToSubscribe$ = this.observablesToSubscribe$$.pipe(
    distinctUntilChanged(),
    // unsubscribe from previous observables
    // then flatten the latest internal observables into the output
    switchAll(),
    // filter out observables of the same instance
    stateful(),
    // @NOTICE Configure observable here with PushPipeConfig
    distinctUntilChanged()
  );
  config$$ = new Subject<NgRxPushPipeConfig>();
  config$ = this.config$$.pipe(
    // filter out objects of the same instance
    stateful()
  );

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
    this.handleChangeDetection = getChangeDetectionHandler(ngZone, cdRef);
    this.work = (): void => {
      this.handleChangeDetection(
        (this.cdRef as EmbeddedViewRef<Type<any>>).context
      );
    };
    const requestAnimationFrameRef = getRequestAnimationFrameFromZoneFullEnv();

    this.subscription = this.observablesToSubscribe$
      .pipe(
        withLatestFrom(this.config$),
        tap(
          ([value]) => {
            // assign value that will get returned from the transform
            // function on the next change detection
            // @NOTE this is placed here (outside of `work`) as work in requestAnimationFrame can get lost (not executed)
            this.value = value;
          },
          (e: Error) => {
            this.value = e.message;
          }
        ),
        switchMap(([value, config]) =>
          !requestAnimationFrameRef || !config.optimized
            ? of(value).pipe(tap(v => this.work()))
            : of(value).pipe(
                observeOncePerAnimationFrame(() => this.work(), {
                  host: PushPipe,
                  requestAnimationFrameRef,
                })
              )
        )
      )
      .subscribe();
  }

  transform<T>(obj: null | undefined, config?: NgRxPushPipeConfig): null;
  transform<T>(obj: Observable<T>, config?: NgRxPushPipeConfig): T;
  transform<T>(
    obs: Observable<T> | null | undefined,
    config: NgRxPushPipeConfig = { optimized: true }
  ): T | null {
    this.config$$.next(config);
    this.observablesToSubscribe$$.next(
      !isObservable(obs) ? of(STATE_DEFAULT) : obs
    );
    return this.value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
