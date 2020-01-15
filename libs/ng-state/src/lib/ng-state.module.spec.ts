import { async, TestBed } from '@angular/core/testing';
import { NgStateModule } from './ng-state.module';

describe('NgStateModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgStateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgStateModule).toBeDefined();
  });
});
