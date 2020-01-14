import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, mapTo } from 'rxjs/operators';
import { DemoEntity, DemoState } from './interfaces';

@Injectable({
    providedIn: 'root'
})
export class DemoDataService {

    constructor() {
    }

    getDemoData(): Observable<Map<string, DemoEntity>> {
        const entities: DemoEntity[] = [
            {
                _id: '1',
                name: 'demo01',
                switch: true
            },
            {
                _id: '2',
                name: 'demo02',
                switch: false
            },
            {
                _id: '3',
                name: 'demo03',
                switch: true
            },
            {
                _id: '4',
                name: 'demo04',
                switch: false
            }
        ];
        const entityMap = new Map<string, DemoEntity>(entities.map(e => [e._id, { ...e }]));
        return of(null)
            .pipe(
                delay(2000),
                mapTo(entityMap)
            );
    }

}
