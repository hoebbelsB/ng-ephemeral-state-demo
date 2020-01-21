import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Database } from 'sqlite3';
import { Db } from '../../db';
import { NewTrackInput } from './dto/new-track.input';
import { TracksArgs } from './dto/tracks.args';
import { Track } from './models/track';

@Injectable()
export class TracksService {


    readonly db: Database;

    constructor() {
        this.db = new Database('mydb.db');
    }

    /**
     * MOCK
     * Put some real business logic here
     * Left for demonstration purposes
     */

    async create(data: NewTrackInput): Promise<Track> {
        return {} as any;
    }

    findOneById(id: string): Observable<Track> {
        return Db.find(`SELECT * from tracks where id = ${id}`);
    }

    findAll(recipesArgs: TracksArgs): Observable<Track[]> {
       return Db.findAll('SELECT * from tracks;');
    }

    async remove(id: string): Promise<boolean> {
        return true;
    }
}
