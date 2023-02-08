import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardInPaypalComponent } from './add-card-in-paypal.component';

describe('AddCardInPaypalComponent', () => {
  let component: AddCardInPaypalComponent;
  let fixture: ComponentFixture<AddCardInPaypalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCardInPaypalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCardInPaypalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
