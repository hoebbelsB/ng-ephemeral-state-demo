import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { mergeAll, tap } from 'rxjs/operators';

@Injectable()
export class NgEphemeralEffects implements OnDestroy {
    private readonly subscription = new Subscription();
    private readonly effectSubject = new Subject<any>();

    constructor() {
        this.subscription.add(this.effectSubject.pipe(mergeAll())
            .subscribe());
    }

    /**
     * connectEffect(o: Observable<any>) => void
     *
     * @param o: Observable<any>
     *
     * @example
     * const ls = new LocalState<{test: string, bar: number}>();
     * // Error
     * // ls.connectEffect();
     * ls.connectEffect(of());
     * ls.connectEffect(of().pipe(tap(n => console.log('side effect', n))));
     * ls.connectEffect(of(), n => console.log('side effect', n));
     */
    connectEffect<T>(o: Observable<T>, sideEffectFn?: (argy: T) => void): void {
        let obs = o;
        if (sideEffectFn) {
            obs = o.pipe(tap(sideEffectFn));
        }
        this.effectSubject.next(obs);
    }

    /**
     * teardown(): void
     *
     * When called it teardown all internal logic
     * used to connect to the `OnDestroy` life-cycle hook of services, components, directives, pipes
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
