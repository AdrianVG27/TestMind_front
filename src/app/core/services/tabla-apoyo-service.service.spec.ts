import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TablaApoyoService } from './tabla-apoyo-service.service';

describe('TablaApoyoService', () => {
  let service: TablaApoyoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TablaApoyoService
      ]
    });
    service = TestBed.inject(TablaApoyoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer GET a /api/admin/tablaApoyo y actualizar listaTablas', () => {
    const mockResponse = [{ id: 1, tabla: 'Roles' }];

    service.obtenerCatalogoTablas().subscribe();

    const req = httpMock.expectOne('/api/admin/tablaApoyo');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.listaTablas()).toEqual(mockResponse as any);
  });

  it('debería hacer GET a /api/admin/tablaApoyo/:id y actualizar tablaSeleccionadaData', () => {
    const mockResponse = { tabla: 'Roles', registros: [] };

    service.cargarRegistrosTabla(5).subscribe();

    const req = httpMock.expectOne('/api/admin/tablaApoyo/5');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.tablaSeleccionadaData()).toEqual(mockResponse as any);
  });

  it('debería hacer POST a /api/admin/tablaApoyo/:id/row para crear registro', () => {
    const payload = { nombre: 'Admin' };

    service.crearRegistro(2, payload).subscribe();

    const req = httpMock.expectOne('/api/admin/tablaApoyo/2/row');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ success: true });
  });

  it('debería hacer PUT a /api/admin/tablaApoyo/:id/row/:idFila para actualizar registro', () => {
    const payload = { nombre: 'SuperAdmin' };

    service.actualizarRegistro(2, 10, payload).subscribe();

    const req = httpMock.expectOne('/api/admin/tablaApoyo/2/row/10');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ success: true });
  });

  it('debería hacer DELETE a /api/admin/tablaApoyo/:id/row/:idFila para eliminar registro', () => {
    service.eliminarRegistro(2, 10).subscribe();

    const req = httpMock.expectOne('/api/admin/tablaApoyo/2/row/10');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('debería hacer GET y PUT para la gestión de idiomas de una fila', () => {
    service.obtenerTraduccionesFila(1, 5).subscribe();
    const reqGet = httpMock.expectOne('/api/admin/tablaApoyo/1/row/5/lenguajes');
    expect(reqGet.request.method).toBe('GET');
    reqGet.flush([{ lang: 'es', text: 'Hola' }]);

    const traduccionesPayload = [{ lang: 'en', text: 'Hello' }];
    service.guardarTraduccionesFila(1, 5, traduccionesPayload).subscribe();
    const reqPut = httpMock.expectOne('/api/admin/tablaApoyo/1/row/5/lenguajes');
    expect(reqPut.request.method).toBe('PUT');
    expect(reqPut.request.body).toEqual({ traducciones: traduccionesPayload });
    reqPut.flush({ success: true });
  });
});