import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { roleGuard } from './role.guard';

describe('RoleGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['currentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  const executeGuard = (routeData: any = {}) => {
    return TestBed.runInInjectionContext(() => {
      return roleGuard({ data: routeData } as any, {} as any);
    });
  };

  it('debería redirigir a /login si no hay usuario (sesión no iniciada)', () => {
    mockAuthService.currentUser.and.returnValue(null);
    const dummyUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(dummyUrlTree);

    const result = executeGuard();

    expect(result).toBe(dummyUrlTree);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
  });

  it('debería redirigir a /admin/dashboard si se exige rol, no coincide y el usuario es admin', () => {
    mockAuthService.currentUser.and.returnValue({ Role: 'admin', Plan: 'PREMIUM' } as any);
    const dummyUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(dummyUrlTree);

    const result = executeGuard({ role: 'user' });

    expect(result).toBe(dummyUrlTree);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/admin/dashboard');
  });

  it('debería redirigir a /reader si se exige rol, no coincide y el usuario NO es admin', () => {
    mockAuthService.currentUser.and.returnValue({ Role: 'user', Plan: 'FREE' } as any);
    const dummyUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(dummyUrlTree);

    const result = executeGuard({ role: 'admin' });

    expect(result).toBe(dummyUrlTree);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/reader');
  });

  it('debería redirigir a /upgrade si la ruta exige un plan de pago y el usuario es FREE', () => {
    mockAuthService.currentUser.and.returnValue({ Role: 'user', Plan: 'FREE' } as any);
    const dummyUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(dummyUrlTree);

    const result = executeGuard({ role: 'user', plan: 'PREMIUM' });

    expect(result).toBe(dummyUrlTree);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/upgrade');
  });

  it('debería permitir el acceso si los roles y los planes coinciden perfectamente', () => {
    mockAuthService.currentUser.and.returnValue({ Role: 'user', Plan: 'PRO' } as any);

    const result = executeGuard({ role: 'user', plan: 'PRO' });

    expect(result).toBeTrue();
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  });

  it('debería permitir el acceso si la ruta no exige ni rol ni plan específico', () => {
    mockAuthService.currentUser.and.returnValue({ Role: 'user', Plan: 'FREE' } as any);

    const result = executeGuard({});

    expect(result).toBeTrue();
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  });
});