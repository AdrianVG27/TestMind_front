import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslocoService } from '@ngneat/transloco';
import { IdiomaConfigService } from './idioma-config.service';

describe('IdiomaConfigService', () => {
  let service: IdiomaConfigService;
  let httpMock: HttpTestingController;
  let mockTransloco: jasmine.SpyObj<TranslocoService>;

  beforeEach(() => {
    mockTransloco = jasmine.createSpyObj('TranslocoService', ['setAvailableLangs']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        IdiomaConfigService,
        { provide: TranslocoService, useValue: mockTransloco }
      ]
    });

    service = TestBed.inject(IdiomaConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer GET y actualizar idiomasDisponibles y Transloco si hay datos', () => {
    const mockIdiomas = [
      { codigo: 'es', descripcion: 'Español' },
      { codigo: 'en', descripcion: 'Inglés' }
    ];

    service.cargarIdiomasDesdeBD().subscribe();

    const req = httpMock.expectOne('/api/idiomas-disponibles');
    expect(req.request.method).toBe('GET');
    req.flush(mockIdiomas);

    expect(service.idiomasDisponibles()).toEqual(mockIdiomas);
    expect(mockTransloco.setAvailableLangs).toHaveBeenCalledWith(['es', 'en']);
  });

  it('debería activar el catchError y devolver el array de fallback en caso de error HTTP 500', () => {
    spyOn(console, 'error');

    service.cargarIdiomasDesdeBD().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].codigo).toBe('es');
    });

    const req = httpMock.expectOne('/api/idiomas-disponibles');
    req.flush('Error de servidor', { status: 500, statusText: 'Server Error' });
  });
});