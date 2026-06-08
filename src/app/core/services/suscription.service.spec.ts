import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SuscriptionService } from './suscription.service';

describe('SuscriptionService', () => {
  let service: SuscriptionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        SuscriptionService
      ]
    });
    service = TestBed.inject(SuscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    const scripts = document.querySelectorAll('script[src*="paypal.com"]');
    scripts.forEach(s => s.remove());
    if (window.hasOwnProperty('paypal')) {
      delete (window as any).paypal;
    }
  });

  it('debería hacer GET a /api/tier y actualizar planList', () => {
    const mockResponse = { success: true, data: [{ id: 1, nombre: 'PRO' }] };

    service.getAvailablePlans().subscribe();

    const req = httpMock.expectOne('/api/tier');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.planList()).toEqual(mockResponse.data as any);
  });

  it('debería asignar un array vacío si la API no devuelve datos en getAvailablePlans', () => {
    const mockResponse = { success: true, data: null };

    service.getAvailablePlans().subscribe();

    const req = httpMock.expectOne('/api/tier');
    req.flush(mockResponse as any);

    expect(service.planList()).toEqual([]);
  });

  it('debería hacer POST a /vincular-suscripcion', () => {
    service.vincularSuscripcion('SUB-12345').subscribe();

    const req = httpMock.expectOne('/api/user/paypal/vincular-suscripcion');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ subscription_id: 'SUB-12345' });
    req.flush({});
  });

  it('debería hacer POST a /subscription/cancel para cancelar activa', () => {
    service.cancelarSuscripcionActiva().subscribe();

    const req = httpMock.expectOne('/api/user/paypal/subscription/cancel');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  describe('SDK de PayPal', () => {
    it('debería resolver inmediato si paypal ya existe en window', async () => {
      (window as any).paypal = {};

      await expectAsync(service.cargarSdkPayPal()).toBeResolved();

      const scripts = document.querySelectorAll('script[src*="paypal.com"]');
      expect(scripts.length).toBe(0);
    });

    it('debería inyectar script si paypal NO existe en window y resolver la promesa al cargar (onload)', async () => {
      const promesaCarga = service.cargarSdkPayPal();

      const scripts = document.querySelectorAll('script[src*="paypal.com"]');
      expect(scripts.length).toBe(1);

      const scriptElement = scripts[0] as HTMLScriptElement;
      expect(scriptElement.src).toContain('client-id=AbPRgt');

      scriptElement.dispatchEvent(new Event('load'));

      await expectAsync(promesaCarga).toBeResolved();
    });

    it('debería simular la inicialización y el flujo completo del botón de PayPal (onApprove y errores)', () => {
      const mockContainer = document.createElement('div');
      const mockPaypalId = 'PLAN-123';
      const mockCallback = jasmine.createSpy('onCancelOrSuccess');

      spyOn(console, 'error');

      const fakeButtonsInstance = {
        render: jasmine.createSpy('render').and.returnValue(Promise.resolve())
      };

      const paypalSpy = {
        Buttons: jasmine.createSpy('Buttons').and.callFake((config) => {
          const fakeActions = {
            subscription: jasmine.createSpyObj('subscription', ['create'])
          };
          config.createSubscription({}, fakeActions);
          expect(fakeActions.subscription.create).toHaveBeenCalledWith({ 'plan_id': mockPaypalId });

          config.onApprove({ subscriptionID: 'SUB-OK' }, {});

          config.onError('Error forzado de pasarela');

          return fakeButtonsInstance;
        })
      };

      (window as any).paypal = paypalSpy;

      service.inicializarBotonPayPal(mockContainer, mockPaypalId, mockCallback);

      const req = httpMock.expectOne('/api/user/paypal/vincular-suscripcion');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });

      expect(paypalSpy.Buttons).toHaveBeenCalled();
      expect(fakeButtonsInstance.render).toHaveBeenCalledWith(mockContainer);
      expect(mockCallback).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error en pasarela PayPal Sandbox:', 'Error forzado de pasarela');
    });

    it('debería capturar el error si falla la vinculación al backend tras el onApprove de PayPal', () => {
      const mockContainer = document.createElement('div');

      spyOn(console, 'error');

      const paypalSpy = {
        Buttons: jasmine.createSpy('Buttons').and.callFake((config) => {
          config.onApprove({ subscriptionID: 'SUB-ERROR' }, {});
          return { render: () => { } };
        })
      };

      (window as any).paypal = paypalSpy;

      service.inicializarBotonPayPal(mockContainer, 'PLAN-123', () => { });

      const req = httpMock.expectOne('/api/user/paypal/vincular-suscripcion');

      req.flush('Error de servidor', { status: 500, statusText: 'Server Error' });

      expect(console.error).toHaveBeenCalledWith('Error en bypass de vinculación:', jasmine.any(Object));
    });
  });
});