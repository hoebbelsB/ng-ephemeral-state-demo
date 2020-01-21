import { Injectable, InjectionToken } from '@angular/core';
import { User } from '@ephemeral-angular/api';
import { ReadableEphemeralState } from '@ephemeral-angular/ephemeral-state';
import { NgEphemeralState } from '@ephemeral-angular/ng-state';
import { Subject } from 'rxjs';
import { map, mapTo, withLatestFrom } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';


export interface AppState {
    state: string;
    user: User;
    loggedIn: boolean;
    showDemo2: boolean;
}

export const APP_STATE = new InjectionToken<ReadableEphemeralState<AppState>>('global-app-state');

const makeState = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 15; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

@Injectable({
    providedIn: 'root'
})
export class GlobalStateService extends NgEphemeralState<AppState> {

    toggleState = new Subject<void>();
    toggleDemo2 = new Subject<void>();

    constructor(
        private authService: AuthService
    ) {
        super(
            {
                state: 'global-initial-state',
                showDemo2: true
            }
        );
        this.connectState(
            'state',
            this.toggleState.pipe(
                map(() => makeState())
            )
        );
        this.connectState(
            'showDemo2',
            this.toggleDemo2.pipe(
                withLatestFrom(this.select('showDemo2')),
                map(([val1, val2]) => !val2)
            )
        );
        this.connectState('user', this.authService.select('user'));
        this.connectState('loggedIn', this.authService.select('loggedIn'));
    }
}
