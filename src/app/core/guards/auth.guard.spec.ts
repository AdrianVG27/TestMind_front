import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    mockRouter = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  const executeGuard = () => TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

  it('debería permitir el acceso (return true) si el usuario ESTÁ autenticado', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);

    const result = executeGuard();

    expect(result).toBeTrue();
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  });

  it('debería redirigir a /login si el usuario NO ESTÁ autenticado', () => {
    const dummyUrlTree = {} as UrlTree;
    mockAuthService.isAuthenticated.and.returnValue(false);
    mockRouter.parseUrl.and.returnValue(dummyUrlTree);

    const result = executeGuard();

    expect(result).toBe(dummyUrlTree);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
  });
});