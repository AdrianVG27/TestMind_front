import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;
  let store: Record<string, string | null> = {};

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    store = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => { store[key] = value; });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => { delete store[key]; });
  });

  function initService() {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('debería hacer POST a /api/login, guardar el token y actualizar el usuario', () => {
    initService();
    const mockCreds = { email: 'test@test.com', password: '123' };
    const mockResponse = {
      access_token: 'fake-jwt',
      role: 'user',
      data: { id: 1, name: 'Test User', email: 'test@test.com', plan: 'premium' }
    };

    service.login(mockCreds).subscribe();

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith('tm_token', 'fake-jwt');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('debería hacer POST a /api/register y establecer la sesión como usuario estándar', () => {
    initService();
    const mockRegisterData = { name: 'New User', email: 'new@test.com', password: '123' };
    const mockResponse = {
      access_token: 'register-jwt',
      data: { id: 2, name: 'New User', email: 'new@test.com' }
    };

    service.register(mockRegisterData).subscribe();

    const req = httpMock.expectOne('/api/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUser()?.Role).toBe('user');
  });

  it('debería ejecutar obtenerUsuarioAutenticado en el constructor si ya existe un token', () => {
    store['tm_token'] = 'existing-token';
    spyOn(console, 'error');

    initService();

    const req = httpMock.expectOne('/api/me');
    expect(req.request.method).toBe('GET');

    const mockMeResponse = {
      role: 'admin',
      data: { id: 1, name: 'Admin', email: 'admin@test.com' }
    };
    req.flush(mockMeResponse);

    expect(service.isAdmin()).toBeTrue();
  });

  it('debería manejar el error si la sincronización del constructor falla', () => {
    store['tm_token'] = 'bad-token';
    spyOn(console, 'error');

    initService();

    const req = httpMock.expectOne('/api/me');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(console.error).toHaveBeenCalled();
  });

  it('debería hacer POST a /api/logout, limpiar la sesión y navegar a /home', () => {
    initService();
    service.setSession('fake', { id: 1, email: 't@t.com' }, 'user');

    service.logout();

    const req = httpMock.expectOne('/api/logout');
    req.flush({});

    expect(localStorage.removeItem).toHaveBeenCalledWith('tm_token');
    expect(service.isAuthenticated()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería hacer POST a /api/user/update y fusionar los datos nuevos', () => {
    initService();
    service.setSession('token', { id: 1, name: 'Viejo', email: 'viejo@v.com' }, 'user');

    const updatePayload = { name: 'Nuevo', email: 'nuevo@v.com', nickname: 'Nuevito' };
    const mockResponse = { user: updatePayload };

    service.updateProfile(updatePayload).subscribe();

    const req = httpMock.expectOne('/api/user/update');
    req.flush(mockResponse);

    expect(service.currentUser()?.Name).toBe('Nuevo');
  });

  it('debería hacer POST a /api/admin/register para registrar administradores', () => {
    initService();
    const mockAdminData = { name: 'Nuevo Admin', email: 'admin2@test.com' };

    service.registerAdmin(mockAdminData).subscribe();

    const req = httpMock.expectOne('/api/admin/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAdminData);
    req.flush({ success: true });
  });

  it('debería hacer POST a /api/admin/update para actualizar la contraseña', () => {
    initService();
    const mockPasswordPayload = {
      current_password: '123',
      password: '456',
      password_confirmation: '456'
    };

    service.updateAdminPassword(mockPasswordPayload).subscribe();

    const req = httpMock.expectOne('/api/admin/update');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });

  it('debería exponer correctamente los estados derivados (isAdmin, userPlan)', () => {
    initService();
    service.setSession('token', { id: 1, plan: 'PRO' }, 'admin');

    expect(service.isAdmin()).toBeTrue();
    expect(service.userPlan()).toBe('PRO');
  });

  it('debería asignar valores por defecto en setSession si faltan datos (plan y nickname)', () => {
    initService();

    service.setSession(null, { id: 99, name: 'SinDatos', email: 'a@a.com' }, 'user');

    const user = service.currentUser();
    expect(user?.Nickname).toBe('');
    expect(user?.Plan).toBe('FREE');
    expect(localStorage.setItem).not.toHaveBeenCalledWith('tm_token', jasmine.any(String));
  });

  it('debería devolver estado por defecto cuando data es nulo en el login', () => {
    initService();
    service.login({ email: 'x', password: 'y' }).subscribe();

    const req = httpMock.expectOne('/api/login');

    req.flush({ access_token: 'fake', role: 'user', data: null });

    expect(service.currentUser()?.Email).toBeUndefined();
  });

  it('debería manejar error en el servidor al intentar hacer logout', () => {
    initService();
    spyOn(console, 'error');
    service.logout();

    const req = httpMock.expectOne('/api/logout');

    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalledWith('Error al destruir sesión en el servidor:', jasmine.any(Object));
  });

  it('no debería actualizar el perfil localmente si la respuesta de la API no contiene el objeto user', () => {
    initService();
    service.setSession('token', { id: 1, name: 'Viejo', email: 'v@v.com' }, 'user');

    service.updateProfile({ name: 'Nuevo', email: 'n@n.com', nickname: 'N' }).subscribe();

    const req = httpMock.expectOne('/api/user/update');
    req.flush({ success: true });

    expect(service.currentUser()?.Name).toBe('Viejo');
  });

  it('debería devolver FREE y valores nulos si no hay usuario autenticado', () => {
    initService();
    expect(service.userPlan()).toBe('FREE');
    expect(service.nickname()).toBeUndefined();
  });

  it('debería cargar el usuario desde localStorage al inicializar el servicio (loadFromStorage)', () => {
    const mockUserStr = JSON.stringify({ id: 99, Name: 'Recuperado', Role: 'user', Plan: 'PRO' });
    store['tm_user'] = mockUserStr;

    initService(); 

    expect(service.currentUser()?.Name).toBe('Recuperado');
    expect(service.userPlan()).toBe('PRO');
  });
});