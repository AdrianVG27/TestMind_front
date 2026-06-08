import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProfileMetricService } from './profile-metric.service';

describe('ProfileMetricService', () => {
  let service: ProfileMetricService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProfileMetricService
      ]
    });
    service = TestBed.inject(ProfileMetricService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer GET a /api/user/intento y poblar signals de lista y métricas', () => {
    const mockResponse = {
      data: {
        intentos: [{ id: 1, nota: 8 }],
        metrics: { mediaResultados: 8, totalRealizados: 1, categoriaMasRealizada: 'Ciencias' }
      }
    };

    service.cargarHistorialIntentos().subscribe();

    const req = httpMock.expectOne('/api/user/intento');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.listaIntentos()).toEqual(mockResponse.data.intentos);
    expect(service.metrics()).toEqual(mockResponse.data.metrics);
  });

  it('debería mapear correctamente los datos crudos al modelo IntentoResultado en detalleIntento', () => {
    const mockResponse = {
      data: { nota: 9.5, aciertos: 19, total: 20, feedback: [{ q: 'q1' }], basura: 'ignorar' }
    };

    service.obtenerDetalleIntento(5).subscribe(res => {
      expect(res.nota).toBe(9.5);
      expect(res.aciertos).toBe(19);
      expect(res.total).toBe(20);
      expect(res.feedback.length).toBe(1);
      expect((res as any).basura).toBeUndefined();
    });

    const req = httpMock.expectOne('/api/user/intento/5');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería aplicar los valores por defecto en los signals si la API no devuelve intentos o métricas', () => {
    const mockResponseVacia = {
      data: {
        intentos: null,
        metrics: null
      }
    };

    service.cargarHistorialIntentos().subscribe();

    const req = httpMock.expectOne('/api/user/intento');
    req.flush(mockResponseVacia as any);

    expect(service.listaIntentos()).toEqual([]);
    expect(service.metrics()).toEqual({
      mediaResultados: 0,
      totalRealizados: 0,
      categoriaMasRealizada: 'Ninguna'
    });
  });

  it('debería asignar un array vacío al feedback si la API no lo devuelve en el detalle', () => {
    const mockResponseSinFeedback = {
      data: { nota: 5, aciertos: 10, total: 20, feedback: null }
    };

    service.obtenerDetalleIntento(5).subscribe(res => {
      expect(res.feedback).toEqual([]);
    });

    const req = httpMock.expectOne('/api/user/intento/5');
    req.flush(mockResponseSinFeedback);
  });
});