import { Injectable } from '@angular/core';
import { NgEphemeralState } from '@ephemeral-angular/ng-state';
import { Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { DemoDataService } from '../../demo-data.service';
import { DemoEntity, DemoState, DemoView } from '../../interfaces';

@Injectable()
export class Demo02ViewModelService extends NgEphemeralState<DemoState> implements DemoView {

    readonly addEntity: Subject<DemoEntity> = new Subject<DemoEntity>();
    readonly removeEntity: Subject<string> = new Subject<string>();
    readonly entitySwitched: Subject<string> = new Subject<string>();
    readonly reload: Subject<void> = new Subject<void>();

    constructor(
        private demoData: DemoDataService
    ) {
        super(
            {
                title: 'demo02',
                entities: null,
                loading: true
            }
        );
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
