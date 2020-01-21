import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { Track } from '@ephemeral-angular/api';
import { ReadableEphemeralState } from '@ephemeral-angular/ephemeral-state';
import { APP_STATE, AppState } from '../../../global-state.service';
import { Demo02ViewModelService } from '../demo02parent/demo02-view-model.service';

@Component({
    selector: 'es-demo02child',
    templateUrl: './demo02child.component.html',
    styleUrls: ['./demo02child.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo02childComponent implements OnInit {

    @Input() entities: Map<string, Track>;

    @Input()
    set loading(val: boolean) {
        this._loading = val;
    }

    get loading(): boolean {
        return this._loading;
    }

    @Output() entityRemoved = new EventEmitter<string>();
    @Output() entitySwitched = new EventEmitter<string>();

    @HostBinding('class.component-loading') _loading = false;

    constructor(
        @Inject(APP_STATE) public appState: ReadableEphemeralState<AppState>,
        // @Inject(WRITABLE_EPHEMERAL_STATE) public parentState: WritableEphemeralState<DemoModule>
        public parentState: Demo02ViewModelService
    ) {
    }

    ngOnInit() {

    }

}
