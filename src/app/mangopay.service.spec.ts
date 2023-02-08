import { TestBed } from '@angular/core/testing';

import { MangopayService } from './mangopay.service';

describe('MangopayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MangopayService = TestBed.get(MangopayService);
    expect(service).toBeTruthy();
  });
});
