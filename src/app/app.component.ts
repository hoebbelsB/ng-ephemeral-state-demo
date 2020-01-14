import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GlobalStateService } from './global-state.service';


@Component({
    selector: 'es-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    title = 'ephemeral-angular';


    constructor(
        public globalState: GlobalStateService
    ) {
    }
}
