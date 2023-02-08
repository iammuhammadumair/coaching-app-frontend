import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MangoTcComponent } from './mango-tc.component';

describe('MangoTcComponent', () => {
  let component: MangoTcComponent;
  let fixture: ComponentFixture<MangoTcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangoTcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangoTcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
