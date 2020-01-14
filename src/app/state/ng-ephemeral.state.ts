import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { defaultStateAccumulation, EphemeralState, EphemeralStateAccumulatorFn } from './lib';
import { INITIAL_STATE, STATE_ACCUMULATOR } from './providers';

@Injectable()
export class NgEphemeralState<T> extends EphemeralState<T> {

    readonly state$: Observable<T> = this.select();

    private _localState: T;

    constructor(
        @Optional() @Inject(INITIAL_STATE) initialState: Partial<T> = null,
        @Optional() @Inject(STATE_ACCUMULATOR) stateAccumulatorFn: EphemeralStateAccumulatorFn<T> = null
    ) {
        super(!!stateAccumulatorFn ? stateAccumulatorFn : defaultStateAccumulation);
        this.connectEffect(
            this.state$,
            s => this._localState = s
        );
        if (initialState) {
            this.setState(initialState);
        }
    }

    getState(): T {
        return this._localState;
    }
}
