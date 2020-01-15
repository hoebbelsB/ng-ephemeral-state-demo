import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import {
    defaultStateAccumulation,
    EphemeralState,
    EphemeralStateAccumulatorFn
} from '@ephemeral-angular/ephemeral-state';

import { Observable } from 'rxjs';
import { INITIAL_STATE, STATE_ACCUMULATOR } from '../interface';

@Injectable()
export class NgEphemeralState<T> extends EphemeralState<T> implements OnDestroy {

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

    ngOnDestroy(): void {
        this.teardown();
    }

    getState(): T {
        return this._localState;
    }
}
