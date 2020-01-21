import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { delay, map, mapTo } from 'rxjs/operators';
import { Track } from '@ephemeral-angular/api';

@Injectable({
    providedIn: 'root'
})
export class DemoDataService {

    constructor(
        private apollo: Apollo
    ) {
    }

    getDemoData(): Observable<Map<string, Track>> {
        return this.apollo
            .query<{ tracks: Track[]}>({
                query: gql`
                    {
                        tracks(skip: 0, take: 10) {
                            id,
                            milliseconds,
                            name,
                            unitPrice,
                            bytes,
                            composer
                        }
                    }
                `
            }).pipe(
                map(values => {
                    return new Map(values.data.tracks.map(t => ([t.id, {...t}])));
                })
        );
    }

}
