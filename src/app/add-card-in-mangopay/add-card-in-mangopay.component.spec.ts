import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardInMangopayComponent } from './add-card-in-mangopay.component';

describe('AddCardInMangopayComponent', () => {
  let component: AddCardInMangopayComponent;
  let fixture: ComponentFixture<AddCardInMangopayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCardInMangopayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCardInMangopayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
