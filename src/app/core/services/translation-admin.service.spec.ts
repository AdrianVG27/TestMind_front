import { TestBed } from '@angular/core/testing';

import { TranslationAdminService } from './translation-admin.service';

describe('TranslationAdminService', () => {
  let service: TranslationAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
