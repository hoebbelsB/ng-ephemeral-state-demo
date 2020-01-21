import { Observable, Subject } from 'rxjs';
import { switchMap, switchMapTo } from 'rxjs/operators';
import { Database } from 'sqlite3';

export class Db {
    static db: Database;

    static init() {
        Db.db = new Database('mydb.db');
    }

    static insert(statement: string): Observable<void> {
        const result$ = new Subject<void>();
        Db.db.run(statement, err => {
            if (!err) {
                result$.next();
                result$.complete();
            } else {
                result$.error(err);
            }
        });
        return result$;
    }

    static find<T>(statement: string): Observable<T> {
        const result$ = new Subject<T>();
        Db.db.get(statement, (err, rows) => {
            console.log(rows);
            console.log(err);
            if (!err) {
                result$.next(rows);
                result$.complete();
            } else {
                result$.error(err);
            }
        });
        return result$;
    }

    static findAll<T>(statement: string): Observable<T[]> {
        const result$ = new Subject<T[]>();
        Db.db.all(statement, (err, rows) => {
            console.log(rows);
            console.log(err);
            if (!err) {
                result$.next(rows);
                result$.complete();
            } else {
                result$.error(err);
            }
        });
        return result$;
    }

}
