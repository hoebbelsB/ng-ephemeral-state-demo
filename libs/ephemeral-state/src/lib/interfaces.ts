import { Observable, OperatorFunction } from 'rxjs';

export type EphemeralStateAccumulatorFn<T> = (acc: T, slices: Partial<T>) => T;
export type EphemeralSideEffectFn<T> = (args: T) => void;

export interface ReadableEphemeralState<T> {
    readonly state$: Observable<T>;
    /**
     * select<R>(operator?: OperatorFunction<T, R>): Observable<T | R>
     *
     * @param operator?: OperatorFunction<T, R>
     *
     * @example
     * const ls = new LocalState<{test: string, bar: number}>();
     * ls.select();
     * // Error
     * // ls.select('foo');
     * ls.select('test');
     * // Error
     * // ls.select(of(7));
     * ls.select(mapTo(7));
     * // Error
     * // ls.select(map(s => s.foo));
     * ls.select(map(s => s.test));
     * // Error
     * // ls.select(pipe());
     * // ls.select(pipe(map(s => s.test), startWith(7)));
     * ls.select(pipe(map(s => s.test), startWith('unknown test value')));
     */
    select(): Observable<T>;

    // ========================
    select<A = T>(
        op: OperatorFunction<T, A>
    ): Observable<A>;

    select<A = T, B = A>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>
    ): Observable<B>;

    select<A = T, B = A, C = B>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>
    ): Observable<C>;

    select<A = T, B = A, C = B, D = C>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>
    ): Observable<D>;

    select<A = T, B = A, C = B, D = C, E = D>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>
    ): Observable<E>;

    // ================================
    select<K1 extends keyof T>(k1: K1): Observable<T[K1]>;

    select<K1 extends keyof T,
        K2 extends keyof T[K1]>(k1: K1, k2: K2): Observable<T[K1][K2]>;

    select<K1 extends keyof T,
        K2 extends keyof T[K1],
        K3 extends keyof T[K1][K2]>(k1: K1, k2: K2, k3: K3): Observable<T[K1][K2][K3]>;

    select<K1 extends keyof T,
        K2 extends keyof T[K1],
        K3 extends keyof T[K1][K2],
        K4 extends keyof T[K1][K2][K3]>(k1: K1, k2: K2, k3: K3, k4: K4): Observable<T[K1][K2][K3][K4]>;

    select<K1 extends keyof T,
        K2 extends keyof T[K1],
        K3 extends keyof T[K1][K2],
        K4 extends keyof T[K1][K2][K3],
        K5 extends keyof T[K1][K2][K3][K4]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): Observable<T[K1][K2][K3][K4][K5]>;

    select<K1 extends keyof T,
        K2 extends keyof T[K1],
        K3 extends keyof T[K1][K2],
        K4 extends keyof T[K1][K2][K3],
        K5 extends keyof T[K1][K2][K3][K4],
        K6 extends keyof T[K1][K2][K3][K4][K5]>(
        k1: K1,
        k2: K2,
        k3: K3,
        k4: K4,
        k5: K5,
        k6: K6
    ): Observable<T[K1][K2][K3][K4][K5][K6]>;

    // ===========================
    select(...opOrMapFn: OperatorFunction<T, any>[] | string[]): Observable<any>;
}

export interface WritableEphemeralState<T> extends ReadableEphemeralState<T> {
    setState(s: Partial<T>): void;
}

export interface ConnectableEphemeralState<T> extends WritableEphemeralState<T> {
    connectState<A extends keyof T>(strOrObs: A | Observable<Partial<T>>, obs?: Observable<T[A]>): void;

    connectEffect<X>(o: Observable<X>, sideEffectFn?: EphemeralSideEffectFn<X>): void;
}
