import { TestBed } from '@angular/core/testing';

import { TablaApoyoServiceService } from './tabla-apoyo-service.service';

describe('TablaApoyoServiceService', () => {
  let service: TablaApoyoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablaApoyoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
