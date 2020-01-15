import {
  ChangeDetectorRef,
  NgZone,
  ɵdetectChanges as detectChanges,
  ɵmarkDirty as markDirty,
} from '@angular/core';
import { isIvy, isZoneLess } from '../core';
import { AsyncPipe } from '@angular/common';

export function getChangeDetectionHandler(
  ngZone: NgZone,
  cdRef: ChangeDetectorRef
): <T>(component?: T) => void {
  // @TODO test it properly!!!
  if (isIvy(AsyncPipe)) {
    return isZoneLess(ngZone) ? detectChanges : markDirty;
  } else {
    return isZoneLess(ngZone)
      ? cdRef.detectChanges.bind(cdRef)
      : cdRef.markForCheck.bind(cdRef);
  }
}
