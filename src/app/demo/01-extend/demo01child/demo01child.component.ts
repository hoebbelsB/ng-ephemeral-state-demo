import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { DemoEntity } from '../../interfaces';

@Component({
    selector: 'es-demo01child',
    templateUrl: './demo01child.component.html',
    styleUrls: ['./demo01child.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo01childComponent implements OnInit {

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

    constructor() {
    }

    ngOnInit() {
    }

}
