import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslationAdminService, InterfazTraduccionModel } from './translation-admin.service';

describe('TranslationAdminService', () => {
  let service: TranslationAdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TranslationAdminService
      ]
    });
    service = TestBed.inject(TranslationAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer GET a /api/admin/lenguaje y setear el catalogoTraducciones', () => {
    const mockData: InterfazTraduccionModel[] = [
      { id: 1, clave: 'nav.home', valor: 'INICIO', lenguaje_codigo: 'es' },
      { id: 2, clave: 'nav.login', valor: 'INICIAR SESIÓN', lenguaje_codigo: 'es' }
    ];

    service.obtenerCatalogo().subscribe();

    const req = httpMock.expectOne('/api/admin/lenguaje');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(service.catalogoTraducciones()).toEqual(mockData);
  });

  it('debería hacer PUT a /update y actualizar el valor del literal localmente en el Signal', () => {
    service.catalogoTraducciones.set([
      { id: 10, clave: 'auth.name', valor: 'NOMBRE', lenguaje_codigo: 'es' },
      { id: 11, clave: 'auth.email', valor: 'CORREO', lenguaje_codigo: 'es' }
    ]);

    const payload: InterfazTraduccionModel = {
      id: 10,
      clave: 'auth.name',
      valor: 'NOMBRE COMPLETO',
      lenguaje_codigo: 'es'
    };

    service.actualizarLiteral(payload).subscribe();

    const req = httpMock.expectOne('/api/admin/lenguaje/update');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ success: true });

    const currentCatalogo = service.catalogoTraducciones();
    expect(currentCatalogo.find(item => item.id === 10)?.valor).toBe('NOMBRE COMPLETO');
    expect(currentCatalogo.find(item => item.id === 11)?.valor).toBe('CORREO');
  });

  it('debería hacer DELETE a /destroy y purgar el literal del Signal mediante su clave', () => {
    service.catalogoTraducciones.set([
      { id: 20, clave: 'btn.save', valor: 'Guardar', lenguaje_codigo: 'es' },
      { id: 21, clave: 'btn.cancel', valor: 'Cancelar', lenguaje_codigo: 'es' }
    ]);

    service.eliminarLiteral('btn.cancel').subscribe();

    const req = httpMock.expectOne('/api/admin/lenguaje/destroy');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ clave: 'btn.cancel' });
    req.flush({ success: true });

    const currentCatalogo = service.catalogoTraducciones();
    expect(currentCatalogo.length).toBe(1);
    expect(currentCatalogo[0].clave).toBe('btn.save');
  });
});