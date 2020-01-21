import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GlobalStateService } from '../../../global-state.service';
import { Demo02ViewModelService } from './demo02-view-model.service';

@Component({
    selector: 'es-demo02parent',
    templateUrl: './demo02parent.component.html',
    styleUrls: ['./demo02parent.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        Demo02ViewModelService
    ]
})
export class Demo02parentComponent implements OnInit {

    constructor(
        public viewModel: Demo02ViewModelService,
        // @Inject(APP_STATE) public appState: ReadableEphemeralState<AppState>
        public appState: GlobalStateService
    ) {
    }

    ngOnInit() {
        // this.appState.connectEffect(interval(1000), console.log);
        /*this.appState.connectEffect(
            this.viewModel.state$.pipe(switchMapTo(interval(1000))),
            console.log
        );*/
    }

}
