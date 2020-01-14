import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Demo01childComponent } from './demo01child.component';

describe('Demo01childComponent', () => {
  let component: Demo01childComponent;
  let fixture: ComponentFixture<Demo01childComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Demo01childComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Demo01childComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
