import { Subject } from 'rxjs';
import { Track } from '@ephemeral-angular/api';


export interface DemoView {
    readonly addEntity: Subject<Track>;
    readonly removeEntity: Subject<string>;
    readonly reload: Subject<void>;
}

export interface DemoState {
    readonly title: string;
    readonly entities: Map<string, Track>;
    readonly loading: boolean;
    readonly loggedIn: boolean;
}
