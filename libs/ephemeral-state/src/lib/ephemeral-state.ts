import { stateful } from '@ephemeral-angular/ephemeral-state';
import {
  ConnectableObservable,
  merge,
  Observable,
  OperatorFunction,
  queueScheduler,
  Subject,
  Subscription,
} from 'rxjs';
import {
  map,
  mergeAll,
  observeOn,
  pluck,
  publishReplay,
  scan,
  tap,
} from 'rxjs/operators';

import { defaultStateAccumulation } from './utils';
export class EphemeralState<T> {
  private readonly subscription = new Subscription();
  private readonly stateObservables = new Subject<Observable<Partial<T>>>();
  private readonly stateSlices = new Subject<Partial<T>>();
  private readonly effectSubject = new Subject<any>();
  private readonly stateAccumulator: (
    acc: T,
    slices: Partial<T>
  ) => T = defaultStateAccumulation;

  private readonly state$ = merge(
    this.stateObservables.pipe(
      mergeAll(),
      observeOn(queueScheduler)
    ),
    this.stateSlices.pipe(observeOn(queueScheduler))
  ).pipe(
    scan(this.stateAccumulator, {} as T),
    publishReplay(1)
  );

  constructor() {
    this.init();
  }

  private init() {
    this.subscription.add((this.state$ as ConnectableObservable<T>).connect());
    this.subscription.add(this.effectSubject.pipe(mergeAll()).subscribe());
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
    this.stateSlices.next(s);
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
  connectState<A extends keyof T>(
    strOrObs: A | Observable<Partial<T>>,
    obs?: Observable<T[A]>
  ): void {
    let inner;
    if (typeof strOrObs === 'string') {
      const str: A = strOrObs;
      const o = obs as Observable<T[A]>;
      inner = o.pipe(map(s => ({ [str]: s })));
    } else {
      const ob = strOrObs as Observable<Partial<T>>;
      inner = ob;
    }
    this.stateObservables.next(inner as
      | Observable<Partial<T>>
      | Observable<T[A]>);
  }

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
  select<A = T>(op: OperatorFunction<T, A>): Observable<A>;
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
  select<K1 extends keyof T, K2 extends keyof T[K1]>(
    k1: K1,
    k2: K2
  ): Observable<T[K1][K2]>;
  select<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(k1: K1, k2: K2, k3: K3): Observable<T[K1][K2][K3]>;
  select<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(k1: K1, k2: K2, k3: K3, k4: K4): Observable<T[K1][K2][K3][K4]>;
  select<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): Observable<T[K1][K2][K3][K4][K5]>;
  select<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5,
    k6: K6
  ): Observable<T[K1][K2][K3][K4][K5][K6]>;
  // ===========================
  select(...opOrMapFn: OperatorFunction<T, any>[] | string[]): Observable<any> {
    if (!opOrMapFn || opOrMapFn.length === 0) {
      return this.state$.pipe(stateful());
    } else if (!this.isOperateFnArray(opOrMapFn)) {
      const path = opOrMapFn as string[];
      return this.state$.pipe(
        pluck(...path),
        stateful()
      );
    }

    opOrMapFn.push(stateful());

    return this.state$.pipe(...(opOrMapFn as []));
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
  connectEffect<X>(o: Observable<X>, sideEffectFn?: (argy: X) => void): void {
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
  teardown(): void {
    this.subscription.unsubscribe();
  }

  private isOperateFnArray(
    op: OperatorFunction<T, any>[] | string[]
  ): op is OperatorFunction<T, any>[] {
    return op.every((i: any) => typeof i !== 'string');
  }
}
