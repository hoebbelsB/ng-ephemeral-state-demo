import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { NgEphemeralState } from '../../../state/ng-ephemeral.state';
import { DemoDataService } from '../../demo-data.service';
import { DemoEntity, DemoState, DemoView } from '../../interfaces';

@Component({
    selector: 'es-demo01parent',
    templateUrl: './demo01parent.component.html',
    styleUrls: ['./demo01parent.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo01parentComponent extends NgEphemeralState<DemoState> implements DemoView, OnInit {

    readonly addEntity: Subject<DemoEntity> = new Subject<DemoEntity>();
    readonly removeEntity: Subject<string> = new Subject<string>();
    readonly entitySwitched: Subject<string> = new Subject<string>();
    readonly reload: Subject<void> = new Subject<void>();

    constructor(
        private demoData: DemoDataService
    ) {
        super(
            {
                title: 'demo01'
            }
        );
    }

    ngOnInit() {
        this.connectState('entities', this.reload.pipe(
            startWith(null),
            tap(() => this.setState({loading: true})),
            switchMap(() => this.demoData.getDemoData()),
            tap(() => this.setState({loading: false}))));
        this.connectEffect(this.removeEntity, _id => {
            // @TODO: copy map right here? otherwise state will be mutated...
            const update = new Map(this.getState().entities);
            update.delete(_id);
            this.setState({ entities: update });
        });
        this.connectEffect(this.entitySwitched, _id => {
            // @TODO: copy map right here? otherwise state will be mutated...
            const update = new Map(this.getState().entities);
            update.get(_id).switch = !update.get(_id).switch;
            this.setState({ entities: update });
        });
    }

}
