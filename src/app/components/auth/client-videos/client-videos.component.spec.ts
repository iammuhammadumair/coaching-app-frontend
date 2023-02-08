import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVideosComponent } from './client-videos.component';

describe('ClientVideosComponent', () => {
  let component: ClientVideosComponent;
  let fixture: ComponentFixture<ClientVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
