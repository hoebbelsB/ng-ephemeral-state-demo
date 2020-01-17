import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Demo03childComponent } from './demo03child.component';

describe('Demo01childComponent', () => {
  let component: Demo03childComponent;
  let fixture: ComponentFixture<Demo03childComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Demo03childComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Demo03childComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
