import { InjectionToken } from '@angular/core';
import {
    ConnectableEphemeralState,
    defaultStateAccumulation,
    EphemeralStateAccumulatorFn,
    ReadableEphemeralState, WritableEphemeralState
} from '@ephemeral-angular/ephemeral-state';

export const STATE_ACCUMULATOR = new InjectionToken<EphemeralStateAccumulatorFn<any>>(
    'defaultStateAccumulator',
    {
        providedIn: 'root',
        factory: () => defaultStateAccumulation
    }
);

export const INITIAL_STATE = new InjectionToken<any>('initialState');

export const READABLE_EPHEMERAL_STATE = new InjectionToken<ReadableEphemeralState<any>>('readableEphemeralState');
export const WRITABLE_EPHEMERAL_STATE = new InjectionToken<WritableEphemeralState<any>>('writableEphemeralState');
export const CONNECTABLE_EPHEMERAL_STATE = new InjectionToken<ConnectableEphemeralState<any>>('connectableEphemeralState');
