import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminMetricService } from './admin-metric.service';

describe('AdminMetricService', () => {
  let service: AdminMetricService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AdminMetricService
      ]
    });
    service = TestBed.inject(AdminMetricService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer GET a /api/admin/metrics/users y actualizar el signal segmentacionUsuarios', () => {
    const mockData = { total: 100, free: 80, premium: 20 } as any;

    service.obtenerSegmentacionUsuarios().subscribe();

    const req = httpMock.expectOne('/api/admin/metrics/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(service.segmentacionUsuarios()).toEqual(mockData);
  });

  it('debería hacer GET a /api/admin/metrics/tests-creados y actualizar el signal testsCreadosHistorico', () => {
    const mockData = [{ fecha: '2023-10-01', cantidad: 5 }];

    service.obtenerHistoricoTestsCreados().subscribe();

    const req = httpMock.expectOne('/api/admin/metrics/tests-creados');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(service.testsCreadosHistorico()).toEqual(mockData);
  });

  it('debería hacer GET a /api/admin/metrics/categorias y actualizar el signal testsPorCategoria', () => {
    const mockData = [{ categoria: 'Historia', total: 10 }];

    service.obtenerTestsPorCategoria().subscribe();

    const req = httpMock.expectOne('/api/admin/metrics/categorias');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(service.testsPorCategoria()).toEqual(mockData);
  });
});