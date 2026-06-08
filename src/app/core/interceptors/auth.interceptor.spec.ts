import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === 'tm_token' ? 'fake-jwt-token' : null;
    });
    spyOn(localStorage, 'removeItem');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería añadir el token en la cabecera Authorization si existe', () => {
    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token');
    req.flush({});
  });

  it('debería limpiar localStorage y redirigir a /login si la API devuelve 401', () => {
    http.get('/api/test').subscribe({
      next: () => fail('La petición debería fallar'),
      error: (err) => {
        expect(err.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(localStorage.removeItem).toHaveBeenCalledWith('tm_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('tm_user');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});