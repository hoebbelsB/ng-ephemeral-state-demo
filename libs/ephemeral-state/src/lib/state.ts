import {
    ConnectableObservable,
    merge,
    Observable,
    OperatorFunction,
    queueScheduler,
    Subject,
    Subscription
} from 'rxjs';
import { map, mergeAll, observeOn, pluck, publishReplay, scan, tap } from 'rxjs/operators';
import { ConnectableEphemeralState, EphemeralSideEffectFn, EphemeralStateAccumulatorFn } from './interfaces';

import { stateful } from './operators';
import { defaultStateAccumulation } from './utils';

export class EphemeralState<T> implements ConnectableEphemeralState<T> {
    private readonly _subscription = new Subscription();
    private readonly _stateObservables = new Subject<Observable<Partial<T>>>();
    private readonly _stateSlices = new Subject<Partial<T>>();
    private readonly _effectSubject = new Subject<any>();
    private readonly _stateAccumulator: EphemeralStateAccumulatorFn<T>;

    private readonly _state$: Observable<T>;

    constructor(stateAccumulator: EphemeralStateAccumulatorFn<T> = defaultStateAccumulation) {
        this._stateAccumulator = stateAccumulator;
        this._state$ = this.bootstrapState();
        this.init();
    }

    private init() {
        this._subscription.add((this._state$ as ConnectableObservable<T>).connect());
        this._subscription.add(this._effectSubject.pipe(mergeAll())
            .subscribe());
    }

    /**
     * setState(s: Partial<T>) => void
     *
     * @param s: Partial<T>
     *
     * @example
     * const ls = new LocalState<{test: string, bar: number}>();
     * // Error
     * // ls.setState({test: 7});
     * ls.setState({test: 'tau'});
     * // Error
     * // ls.setState({bar: 'tau'});
     * ls.setState({bar: 7});
     */
    setState(s: Partial<T>): void {
        this._stateSlices.next(s);
    }

    /**
     * connectState(o: Observable<Partial<T>>) => void
     *
     * @param o: Observable<Partial<T>>
     *
     * @example
     * const ls = new LocalState<{test: string, bar: number}>();
     * // Error
     * // ls.connectState(of(7));
     * // ls.connectState(of('tau'));
     * ls.connectState(of());
     * // Error
     * // ls.connectState(of({test: 7}));
     * ls.connectState(of({test: 'tau'}));
     * // Error
     * // ls.connectState(of({bar: 'tau'}));
     * ls.connectState(of({bar: 7}));
     */
    connectState<A extends keyof T>(strOrObs: A | Observable<Partial<T>>, obs?: Observable<T[A]>): void {
        let _obs;
        if (typeof strOrObs === 'string') {
            const str: A = strOrObs;
            const o = obs as Observable<T[A]>;
            _obs = o.pipe(
                map(s => ({ [str]: s }))
            );
        } else {
            const ob = strOrObs as Observable<Partial<T>>;
            _obs = ob;
        }
        this._stateObservables.next(_obs as Observable<Partial<T>> | Observable<T[A]>);
    }

    /**
     * connectEffect(o: Observable<any>) => void
     *
     * @param o: Observable<any>
     *
     * @param sideEffectFn: EphemeralSideEffectFn<any>
     * @example
     * const ls = new LocalState<{test: string, bar: number}>();
     * // Error
     * // ls.connectEffect();
     * ls.connectEffect(of());
     * ls.connectEffect(of().pipe(tap(n => console.log('side effect', n))));
     * ls.connectEffect(of(), n => console.log('side effect', n));
     */
    connectEffect<X>(o: Observable<X>, sideEffectFn?: EphemeralSideEffectFn<X>): void {
        let _o = o;
        if (sideEffectFn) {
            _o = o.pipe(tap(sideEffectFn));
        }
        this._effectSubject.next(_o);
    }

    // ===========================
    select(...opOrMapFn: OperatorFunction<T, any>[] | string[]): Observable<any> {
        if (!opOrMapFn || opOrMapFn.length === 0) {
            return this._state$
                .pipe(
                    stateful()
                );
        } else if (!this.isOperateFnArray(opOrMapFn)) {
            const path = opOrMapFn as string[];
            return this._state$.pipe(
                pluck(...path),
                stateful()
            );
        }

        opOrMapFn.push(stateful());

        return this._state$.pipe(
            ...opOrMapFn as []
        );
    }


    /**
     * teardown(): void
     *
     * When called it teardown all internal logic
     * used to connect to the `OnDestroy` life-cycle hook of services, components, directives, pipes
     */
    protected teardown(): void {
        this._subscription.unsubscribe();
    }

    private isOperateFnArray(op: OperatorFunction<T, any>[] | string[]): op is OperatorFunction<T, any>[] {
        return op.every((i: any) => typeof i !== 'string');
    }

    private bootstrapState() {
        return merge(
            this._stateObservables.pipe(
                mergeAll(),
                observeOn(queueScheduler)
            ),
            this._stateSlices.pipe(observeOn(queueScheduler))
        )
            .pipe(
                scan(
                    this._stateAccumulator,
                    {} as T
                ),
                publishReplay(1)
            );
    }

}
