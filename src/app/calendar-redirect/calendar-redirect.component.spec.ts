import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRedirectComponent } from './calendar-redirect.component';

describe('CalendarRedirectComponent', () => {
  let component: CalendarRedirectComponent;
  let fixture: ComponentFixture<CalendarRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
