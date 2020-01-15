import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { scheduleOncePerAnimationFrame } from '../schedule-onse-per-animation-frame';

export function observeOncePerAnimationFrame<T>(
  work: () => void,
  cfg: {
    host: {
      requestAnimationFrameId: number;
    };
    requestAnimationFrameRef?: (cb: () => void) => number;
  }
) {
  return (o: Observable<T>): Observable<T> => {
    return o.pipe(
      tap(v => {
        scheduleOncePerAnimationFrame(work, cfg);
      })
    );
  };
}
