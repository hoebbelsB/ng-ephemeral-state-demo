import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Demo02childComponent } from './demo02child.component';

describe('Demo01childComponent', () => {
  let component: Demo02childComponent;
  let fixture: ComponentFixture<Demo02childComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Demo02childComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Demo02childComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
