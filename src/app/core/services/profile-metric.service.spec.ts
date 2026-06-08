import { TestBed } from '@angular/core/testing';

import { ProfileMetricService } from './profile-metric.service';

describe('ProfileMetricService', () => {
  let service: ProfileMetricService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileMetricService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
