import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DemoDataService } from '../../demo-data.service';
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
        public viewModel: Demo02ViewModelService
    ) {
    }

    ngOnInit() {

    }

}
