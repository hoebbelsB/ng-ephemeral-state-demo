import { Subject } from 'rxjs';

export interface DemoEntity {
    _id: string;
    name: string;
    switch: boolean;
}

export interface DemoView {
    readonly addEntity: Subject<DemoEntity>;
    readonly removeEntity: Subject<string>;
    readonly entitySwitched: Subject<string>;
    readonly reload: Subject<void>;
}

export interface DemoState {
    title: string;
    entities: Map<string, DemoEntity>;
    loading: boolean;
}
