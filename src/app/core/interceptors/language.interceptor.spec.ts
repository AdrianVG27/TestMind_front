import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslocoService } from '@ngneat/transloco';
import { languageInterceptor } from './language.interceptor';

describe('LanguageInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let mockTransloco: jasmine.SpyObj<TranslocoService>;

  beforeEach(() => {
    mockTransloco = jasmine.createSpyObj('TranslocoService', ['getActiveLang']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([languageInterceptor])),
        provideHttpClientTesting(),
        { provide: TranslocoService, useValue: mockTransloco }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería usar el idioma de localStorage por encima de transloco si existe', () => {
    spyOn(localStorage, 'getItem').and.returnValue('gl');
    mockTransloco.getActiveLang.and.returnValue('en');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('language')).toBe('gl');
    req.flush({});
  });

  it('debería usar el idioma de Transloco si localStorage está vacío', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    mockTransloco.getActiveLang.and.returnValue('en');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('language')).toBe('en');
    req.flush({});
  });

  it('debería usar "es" por defecto si no hay localStorage ni Transloco', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    mockTransloco.getActiveLang.and.returnValue('');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('language')).toBe('es');
    req.flush({});
  });
});