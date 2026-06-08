import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestService } from './test.service';

describe('TestService', () => {
  let service: TestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TestService
      ]
    });
    service = TestBed.inject(TestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería devolver los valores por defecto en los computed signals al inicializarse (sin datos)', () => {
    expect(service.tests()).toEqual([]);
    expect(service.currentPage()).toBe(1);
    expect(service.lastPage()).toBe(1);
    expect(service.totalTests()).toBe(0);
  });

  it('debería hacer GET a /api/tests sin parámetros opcionales', () => {
    service.testsPaginate().subscribe();

    const req = httpMock.expectOne(request =>
      request.url === '/api/tests' &&
      request.params.get('page') === '1' &&
      !request.params.has('titulo') &&
      !request.params.has('categoria_codigo')
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], meta: {} });
  });

  it('debería hacer GET a /api/user/test (Mis Tests) con filtros', () => {
    service.obtenerMisTests(2, 'Math', 'MAT').subscribe();

    const req = httpMock.expectOne(request =>
      request.url === '/api/user/test' &&
      request.params.get('page') === '2' &&
      request.params.get('titulo') === 'Math' &&
      request.params.get('categoria_codigo') === 'MAT'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], meta: {} });
  });

  it('debería hacer GET a /api/tests con los parámetros correctos y actualizar el Signal de paginación', () => {
    const mockPagination = {
      data: [{ id: 1, titulo: 'Test Global' }],
      meta: { current_page: 2, last_page: 10, total: 100 }
    };

    service.testsPaginate(2, 'Historia', 'HIS').subscribe();

    const req = httpMock.expectOne(request =>
      request.url === '/api/tests' &&
      request.params.get('page') === '2' &&
      request.params.get('titulo') === 'Historia' &&
      request.params.get('categoria_codigo') === 'HIS'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPagination);

    expect(service.tests()).toEqual(mockPagination.data as any);
    expect(service.currentPage()).toBe(2);
    expect(service.totalTests()).toBe(100);
  });

  it('debería hacer GET a /api/user/test (Mis Tests) sin filtros adicionales y actualizar Signal', () => {
    const mockPagination = {
      data: [{ id: 2, titulo: 'Mi Test' }],
      meta: { current_page: 1, last_page: 1, total: 1 }
    };

    service.obtenerMisTests().subscribe();

    const req = httpMock.expectOne(request =>
      request.url === '/api/user/test' &&
      request.params.get('page') === '1' &&
      !request.params.has('titulo') &&
      !request.params.has('categoria_codigo')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPagination);

    expect(service.tests()).toEqual(mockPagination.data as any);
  });

  it('debería hacer GET para obtenerTest y realizarTest', () => {
    service.obtenerTest(10).subscribe();
    const req1 = httpMock.expectOne('/api/user/test/10');
    expect(req1.request.method).toBe('GET');
    req1.flush({});

    (service as any).realizarTest(10).subscribe();
    const req2 = httpMock.expectOne('/api/test/10/realizar');
    expect(req2.request.method).toBe('GET');
    req2.flush({});
  });

  it('debería hacer POST a /api/user/test/:id/corregir con las respuestas y duración', () => {
    const mockRespuestas = { 1: 'a', 2: 'b' };

    service.enviarTestParaCorregir(5, mockRespuestas, 120).subscribe();

    const req = httpMock.expectOne('/api/user/test/5/corregir');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ respuestas: mockRespuestas, duracion: 120 });
    req.flush({});
  });

  it('debería hacer POST a /api/user/test para crear un test nuevo', () => {
    const payload = {
      documento_id: 1,
      titulo: 'Test IA',
      nivel: 'Dificil',
      total: 10,
      prop_unica: 50,
      prop_multi: 30,
      prop_escribir: 20,
      min_opciones: 3,
      max_opciones: 4,
      input_user: 'Enfócate en la mitosis'
    };

    service.crearTest(payload).subscribe();

    const req = httpMock.expectOne('/api/user/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('debería hacer GET a /exportar/moodle-gift para extraer formato GIFT', () => {
    service.exportarMoodleGift(99).subscribe();

    const req = httpMock.expectOne('/api/user/test/99/exportar/moodle-gift');
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Success', data: '::Q1::' });
  });
});