import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSyncComponent } from './calendar-sync.component';

describe('CalendarSyncComponent', () => {
  let component: CalendarSyncComponent;
  let fixture: ComponentFixture<CalendarSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
