import { TestBed } from '@angular/core/testing';

import { AdminMetricService } from './admin-metric.service';

describe('AdminMetricService', () => {
  let service: AdminMetricService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminMetricService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
