import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CategoriaService
      ]
    });
    service = TestBed.inject(CategoriaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer GET a /api/categoria, mapear la respuesta y actualizar el Signal', () => {
    const mockResponse = {
      data: [
        { id: 1, codigo: 'MAT', descripcion: 'Matemáticas' },
        { id: 2, codigo: 'HIS', descripcion: 'Historia' }
      ]
    };

    service.index().subscribe(categorias => {
      expect(categorias.length).toBe(2);
      expect(categorias[0].codigo).toBe('MAT');
    });

    const req = httpMock.expectOne('/api/categoria');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.listaCategorias()).toEqual(mockResponse.data as any);
  });
});