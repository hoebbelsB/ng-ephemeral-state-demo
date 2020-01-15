import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GLOBAL_STATE, GlobalStateService } from './global-state.service';


@Component({
    selector: 'es-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        GlobalStateService,
        {
            provide: GLOBAL_STATE,
            useExisting: GlobalStateService
        }
    ]
})
export class AppComponent {
    title = 'ephemeral-angular';


    constructor(
        public globalState: GlobalStateService
    ) {
    }
}
