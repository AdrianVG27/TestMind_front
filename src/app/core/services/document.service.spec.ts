import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DocumentService
      ]
    });
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería devolver los valores por defecto en los computed signals al inicializarse (sin datos)', () => {
    expect(service.documentos()).toEqual([]);
    expect(service.currentPage()).toBe(1);
    expect(service.lastPage()).toBe(1);
    expect(service.totalDocumentos()).toBe(0);
    expect(service.misDocumentos()).toEqual([]);
  });

  it('debería hacer GET a /api/documentos usando la página 1 por defecto y sin enviar filtros nulos', () => {
    const mockPaginationResponse = {
      data: [],
      meta: { current_page: 1, last_page: 1, total: 0 }
    };

    service.documentosPublicos().subscribe();

    const req = httpMock.expectOne(request =>
      request.url === '/api/documentos' &&
      request.params.get('page') === '1' &&
      !request.params.has('nombre') &&
      !request.params.has('categoria_codigo')
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockPaginationResponse);
  });

  it('debería hacer GET a /api/documentos con los parámetros correctos y actualizar paginación', () => {
    const mockPaginationResponse = {
      data: [{ id: 1, nombre: 'Apuntes.pdf' }],
      meta: { current_page: 2, last_page: 5, total: 50 }
    };

    service.documentosPublicos(2, 'fisica', 'SCI').subscribe();

    const req = httpMock.expectOne(request =>
      request.url === '/api/documentos' &&
      request.params.get('page') === '2' &&
      request.params.get('nombre') === 'fisica' &&
      request.params.get('categoria_codigo') === 'SCI'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockPaginationResponse);

    expect(service.documentos()).toEqual(mockPaginationResponse.data as any);
    expect(service.currentPage()).toBe(2);
    expect(service.lastPage()).toBe(5);
    expect(service.totalDocumentos()).toBe(50);
  });

  it('debería hacer GET a /api/user/documento y actualizar misDocumentos', () => {
    const mockResponse = {
      data: [{ id: 10, nombre: 'MiDocPrivado.pdf' }]
    };

    service.obtenerMisDocumentos().subscribe(docs => {
      expect(docs.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/user/documento');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.misDocumentos()).toEqual(mockResponse.data as any);
  });

  it('debería hacer GET a /api/documentos/:id/descargar solicitando un Blob', () => {
    const dummyBlob = new Blob(['contenido simulado del pdf'], { type: 'application/pdf' });

    service.descargarDocumento(99).subscribe(blob => {
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne('/api/documentos/99/descargar');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');

    req.flush(dummyBlob);
  });

  it('debería hacer POST a /api/user/documento con el FormData al subir documento', () => {
    const mockFormData = new FormData();
    mockFormData.append('file', new Blob(['test']), 'test.pdf');
    const mockResponse = { id: 1, nombre: 'test.pdf' };

    service.subirDocumento(mockFormData).subscribe(res => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne('/api/user/documento');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(mockFormData);

    req.flush(mockResponse);
  });
});