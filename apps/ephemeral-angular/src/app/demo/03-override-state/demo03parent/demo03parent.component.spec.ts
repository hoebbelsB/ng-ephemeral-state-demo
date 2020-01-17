import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Demo03parentComponent } from './demo03parent.component';

describe('Demo01parentComponent', () => {
  let component: Demo03parentComponent;
  let fixture: ComponentFixture<Demo03parentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Demo03parentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Demo03parentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
