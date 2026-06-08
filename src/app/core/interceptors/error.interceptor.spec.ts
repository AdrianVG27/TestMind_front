import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslocoService } from '@ngneat/transloco';
import Swal from 'sweetalert2';
import { errorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let mockTransloco: jasmine.SpyObj<TranslocoService>;

  beforeEach(() => {
    mockTransloco = jasmine.createSpyObj('TranslocoService', ['translate']);

    mockTransloco.translate.and.callFake(((key: string) => key) as any);

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: TranslocoService, useValue: mockTransloco }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ignorar los errores 422 y NO lanzar SweetAlert', () => {
    http.get('/api/test').subscribe({
      next: () => fail('Debería fallar'),
      error: (err) => expect(err.status).toBe(422)
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({ errors: { name: ['Requerido'] } }, { status: 422, statusText: 'Unprocessable Entity' });

    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it('debería lanzar SweetAlert de Error de Conexión si el status es 0', () => {
    http.get('/api/test').subscribe({
      next: () => fail('Debería fallar'),
      error: (err) => expect(err.status).toBe(0)
    });

    const req = httpMock.expectOne('/api/test');
    req.error(new ProgressEvent('Network Error'));

    expect(Swal.fire).toHaveBeenCalled();
    const swalArgs = (Swal.fire as jasmine.Spy).calls.mostRecent().args[0];
    expect(swalArgs.title).toBe('Connection Error');
  });

  it('debería procesar error 500 y lanzar SweetAlert mapeado con Transloco', () => {
    http.get('/api/test').subscribe({
      next: () => fail('Debería fallar'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({ error_key: 'error.Server_Fail' }, { status: 500, statusText: 'Server Error' });

    expect(mockTransloco.translate).toHaveBeenCalledWith('error.Server_Fail', {});
    expect(Swal.fire).toHaveBeenCalled();
    const swalArgs = (Swal.fire as jasmine.Spy).calls.mostRecent().args[0];
    expect(swalArgs.icon).toBe('error');
    expect(swalArgs.title).toBe('Server Error');
  });

  it('debería usar el switch case 401 si no hay error_key en la respuesta', () => {
    http.get('/api/test').subscribe({
      next: () => fail('Debería fallar'),
      error: (err) => expect(err.status).toBe(401)
    });

    const req = httpMock.expectOne('/api/test');
    // Enviamos el error sin body (null o vacío) para forzar que entre al "else" y evalúe el switch
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(mockTransloco.translate).toHaveBeenCalledWith('error.GlobalHandler_Unauthorized.401', {});

    const swalArgs = (Swal.fire as jasmine.Spy).calls.mostRecent().args[0];
    expect(swalArgs.icon).toBe('warning');
    expect(swalArgs.title).toBe('Attention');
  });

  it('debería usar el switch case 403 si no hay error_key', () => {
    http.get('/api/test').subscribe({
      next: () => fail('Debería fallar'),
      error: (err) => expect(err.status).toBe(403)
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 403, statusText: 'Forbidden' });

    expect(mockTransloco.translate).toHaveBeenCalledWith('error.GlobalHandler_Forbidden.403', {});
  });

  it('debería usar el switch case 404 si no hay error_key', () => {
    http.get('/api/test').subscribe({
      next: () => fail('Debería fallar'),
      error: (err) => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne('/api/test');
    req.flush(null, { status: 404, statusText: 'Not Found' });

    expect(mockTransloco.translate).toHaveBeenCalledWith('error.GlobalHandler_NotFound.404', {});
  });

  it('debería aplicar el mensaje de fallback si transloco devuelve vacío o la misma clave', () => {
    mockTransloco.translate.and.returnValue('');

    http.get('/api/test').subscribe({
      next: () => fail('Debería fallar'),
      error: (err) => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne('/api/test');
    req.flush(null, { status: 404, statusText: 'Not Found' });

    const swalArgs = (Swal.fire as jasmine.Spy).calls.mostRecent().args[0];
    expect(swalArgs.text).toBe('The requested resource does not exist.');
  });
});