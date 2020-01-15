import { Injectable, InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgEphemeralState } from './state/ng-ephemeral.state';
import { ReadableEphemeralState } from './state/state';


export interface GlobalState {
    state: string;
}

export const GLOBAL_STATE = new InjectionToken<ReadableEphemeralState<GlobalState>>('global-app-state');

const makeState = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 15; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

@Injectable()
export class GlobalStateService extends NgEphemeralState<GlobalState> {

    toggleState = new Subject<void>();

    constructor() {
        super(
            {
                state: 'global-initial-state'
            }
        );
        this.connectState(
            'state',
            this.toggleState.pipe(
                map(() => makeState())
            )
        );
    }
}
