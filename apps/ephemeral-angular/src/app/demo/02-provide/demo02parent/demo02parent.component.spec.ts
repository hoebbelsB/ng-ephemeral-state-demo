import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Demo02parentComponent } from './demo02parent.component';

describe('Demo01parentComponent', () => {
  let component: Demo02parentComponent;
  let fixture: ComponentFixture<Demo02parentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Demo02parentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Demo02parentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
