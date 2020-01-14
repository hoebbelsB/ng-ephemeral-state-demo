import { TestBed } from '@angular/core/testing';

import { NgEphemeralState } from './ng-ephemeral.state';

describe('NgEphemeralState', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgEphemeralState = TestBed.get(NgEphemeralState);
    expect(service).toBeTruthy();
  });
});
