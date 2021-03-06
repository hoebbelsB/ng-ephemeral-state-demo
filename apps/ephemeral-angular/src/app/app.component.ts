import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { APP_STATE, GlobalStateService } from './global-state.service';


@Component({
    selector: 'es-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: APP_STATE,
            useExisting: GlobalStateService
        }
    ]
})
export class AppComponent {
    title = 'ephemeral-angular';


    constructor(
        public globalState: GlobalStateService,
        public authService: AuthService
    ) {
    }
}
