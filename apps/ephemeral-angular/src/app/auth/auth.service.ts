import { Injectable } from '@angular/core';
import { User } from '@ephemeral-angular/api';
import { NgEphemeralState } from '@ephemeral-angular/ng-state';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AuthState {
    user: User;
    loggedIn: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService extends NgEphemeralState<AuthState> {

    readonly login$ = new Subject<User>();

    constructor() {
        super();
        this.connectState('user', this.login$.asObservable());
        this.connectState('loggedIn', this.select('user').pipe(map(u => !!u)));
    }
}
