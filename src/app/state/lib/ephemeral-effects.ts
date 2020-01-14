import { Observable, Subject, Subscription } from 'rxjs';
import { mergeAll, tap } from 'rxjs/operators';

export class EphemeralEffects {
    private readonly _subscription = new Subscription();
    private readonly _effectSubject = new Subject<any>();

    constructor() {

    }

    init() {
        this._subscription.add(
            this._effectSubject.pipe(mergeAll())
                .subscribe()
        );
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
        let _o = o;
        if (sideEffectFn) {
            _o = o.pipe(tap(sideEffectFn));
        }
        this._effectSubject.next(_o);
    }

    /**
     * teardown(): void
     *
     * When called it teardown all internal logic
     * used to connect to the `OnDestroy` life-cycle hook of services, components, directives, pipes
     */
    teardown(): void {
        this._subscription.unsubscribe();
    }

}
