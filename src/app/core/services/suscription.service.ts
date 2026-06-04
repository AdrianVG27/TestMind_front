import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Tier } from '../models/tier';

declare var paypal: any;

@Injectable({
  providedIn: 'root'
})
export class SuscriptionService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  public planList = signal<Tier[]>([]);

  getAvailablePlans(): Observable<Tier[]> {
    return this.http.get<{ success: boolean; data: Tier[] }>(`${this.apiUrl}/tier`).pipe(
      map(res => res.data || []),
      tap(planes => {
        this.planList.set(planes);
      })
    );
  }

  vincularSuscripcion(subscriptionId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/paypal/vincular-suscripcion`, {
      subscription_id: subscriptionId
    });
  }

  cargarSdkPayPal(): Promise<void> {
    return new Promise((resolve) => {
      if (window.hasOwnProperty('paypal')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AbPRgt6g6UsFKrAh6swjcKbNRrZsEz_2gbdH3PNwzMFA-a8eL5q00qNSzEMInn-j8MM4M8XcqESLttqG&vault=true&intent=subscription&currency=EUR';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  inicializarBotonPayPal(containerElement: HTMLElement, paypalId: string, onCancelOrSuccess: () => void) {
    paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'blue',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: (data: any, actions: any) => {
        return actions.subscription.create({
          'plan_id': paypalId
        });
      },
      onApprove: async (data: any, actions: any) => {
        this.vincularSuscripcion(data.subscriptionID).subscribe({
          next: () => {
            onCancelOrSuccess();
          },
          error: (err) => console.error('Error en bypass de vinculación:', err)
        });
      },
      onError: (err: any) => {
        console.error('Error en pasarela PayPal Sandbox:', err);
      }
    }).render(containerElement);
  }

  cancelarSuscripcionActiva(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/paypal/subscription/cancel`, {});
  }
}