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
import { ReadableEphemeralState } from '@ephemeral-angular/ephemeral-state';
import { AppState, APP_STATE } from '../../../global-state.service';
import { DemoEntity } from '../../interfaces';

@Component({
    selector: 'es-demo03child',
    templateUrl: './demo03child.component.html',
    styleUrls: ['./demo03child.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo03childComponent implements OnInit {

    @Input() entities: Map<string, DemoEntity>;
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
        @Inject(APP_STATE) public appState: ReadableEphemeralState<AppState>
    ) {
    }

    ngOnInit() {
    }

}
