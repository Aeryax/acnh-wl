import { TestBed } from '@angular/core/testing';

import { VillagerService } from './villager.service';

describe('VillagerService', () => {
  let service: VillagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VillagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
