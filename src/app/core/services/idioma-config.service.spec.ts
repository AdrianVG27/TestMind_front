import { TestBed } from '@angular/core/testing';

import { IdiomaConfigService } from './idioma-config.service';

describe('IdiomaConfigService', () => {
  let service: IdiomaConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdiomaConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
