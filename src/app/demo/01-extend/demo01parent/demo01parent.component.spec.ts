import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Demo01parentComponent } from './demo01parent.component';

describe('Demo01parentComponent', () => {
  let component: Demo01parentComponent;
  let fixture: ComponentFixture<Demo01parentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Demo01parentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Demo01parentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
