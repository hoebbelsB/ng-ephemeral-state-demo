import { Injectable } from '@angular/core';
import { Track } from '@ephemeral-angular/api';
import { NgEphemeralState, SIGNAL_TYPE } from '@ephemeral-angular/ng-state';
import { Subject } from 'rxjs';
import { delay, exhaustMap, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { GlobalStateService } from '../../../global-state.service';
import { DemoDataService } from '../../demo-data.service';
import { DemoState, DemoView } from '../../interfaces';

@Injectable()
export class Demo02ViewModelService extends NgEphemeralState<DemoState> implements DemoView {

    readonly addEntity: Subject<Track> = new Subject<Track>();
    readonly removeEntity: Subject<string> = new Subject<string>();
    readonly reload: Subject<void> = new Subject<void>();

    constructor(
        private demoData: DemoDataService,
        private globalState: GlobalStateService
    ) {
        super(
            {
                title: 'demo02 - mvvm',
                entities: null,
                loading: true
            }
        );
        this.connectState('loggedIn', this.globalState.select('loggedIn'));
        this.connectState('entities', this.reload.pipe(
            startWith(null),
            tap(() => this.signal$.next({
                processId: 'DEMO02_LIST_FETCH',
                type: SIGNAL_TYPE.PENDING
            })),
            tap(() => console.log('before fetch')),
            switchMap(() => this.demoData.getDemoData()
                .pipe(delay(200))),
            tap(() => console.log('after fetch')),
            tap(() => {
                this.signal$.next({
                    processId: 'DEMO02_LIST_FETCH',
                    type: SIGNAL_TYPE.SUCCESS
                });
            })));
        this.connectState('loading', this.signal$.pipe(
            map(s => s.type === SIGNAL_TYPE.PENDING)
        ));
        this.connectEffect(this.removeEntity, _id => {
            // @TODO: copy map right here? otherwise state will be mutated...
            const update = new Map(this.getState().entities);
            update.delete(_id);
            console.log(update);
            this.setState({ entities: update });
        });
    }
}
