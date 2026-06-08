import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EstadoService } from './estado.service';

describe('EstadoService', () => {
  let service: EstadoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        EstadoService
      ]
    });
    service = TestBed.inject(EstadoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer GET a /api/estado, mapear los datos y actualizar el Signal de listaEstados', () => {
    const mockResponse = {
      data: [
        { id: 1, codigo: 'ACTIVO', descripcion: 'Activo' },
        { id: 2, codigo: 'INACTIVO', descripcion: 'Inactivo' }
      ]
    };

    service.index().subscribe(estados => {
      expect(estados.length).toBe(2);
      expect(estados[1].codigo).toBe('INACTIVO');
    });

    const req = httpMock.expectOne('/api/estado');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.listaEstados()).toEqual(mockResponse.data as any);
  });
});