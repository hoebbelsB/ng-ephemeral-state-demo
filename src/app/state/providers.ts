import { InjectionToken } from '@angular/core';
import { defaultStateAccumulation, EphemeralStateAccumulatorFn } from './lib';

export const STATE_ACCUMULATOR = new InjectionToken<EphemeralStateAccumulatorFn<any>>('defaultStateAccumulator', {
    providedIn: 'root',
    factory: () => defaultStateAccumulation
});

export const INITIAL_STATE = new InjectionToken<any>('initialState');
