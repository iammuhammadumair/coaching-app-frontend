import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAgentsProfileComponent } from './coach-agents-profile.component';

describe('CoachAgentsProfileComponent', () => {
  let component: CoachAgentsProfileComponent;
  let fixture: ComponentFixture<CoachAgentsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAgentsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAgentsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
