import { Component, Input, OnInit, AfterViewInit, inject, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tier } from '../../../core/models/tier';
import { SuscriptionService } from '../../../core/services/suscription.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-suscription-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suscription-card.component.html',
  styleUrl: './suscription-card.component.css'
})
export class SuscriptionCardComponent implements OnInit, AfterViewInit {
  private subscriptionService = inject(SuscriptionService);
  private authService = inject(AuthService);

  @Input({ required: true }) plan!: Tier;
  @ViewChild('paypalButtonContainer') paypalButtonContainer!: ElementRef;

  public currentUserPlan = computed(() => this.authService.userPlan().toUpperCase());

  public mostrarModalCancelacion = signal<boolean>(false);

  ngOnInit() {
    if (!this.plan.paypal_id) return;
  }

  ngAfterViewInit() {
    if (!this.plan.paypal_id) return;

    if (this.currentUserPlan() === this.plan.codigo.toUpperCase()) return;

    if (this.paypalButtonContainer && this.paypalButtonContainer.nativeElement) {
      this.subscriptionService.inicializarBotonPayPal(
        this.paypalButtonContainer.nativeElement,
        this.plan.paypal_id,
        () => this.onPagoCompletado()
      );
    }
  }

  public abrirModal(): void {
    this.mostrarModalCancelacion.set(true);
  }

  public cerrarModal(): void {
    this.mostrarModalCancelacion.set(false);
  }

  public confirmarBajaSuscripcion(): void {
    this.cerrarModal();

    this.subscriptionService.cancelarSuscripcionActiva().subscribe({
      next: () => {
        console.log('Solicitud de baja tramitada correctamente.');
        this.authService.obtenerUsuarioAutenticado().subscribe();
      },
      error: (err) => {
        console.error('Error al procesar la baja de la suscripción:', err);
      }
    });
  }

  private onPagoCompletado() {
    console.log('El servicio nos avisa de que el flujo de PayPal terminó.');

    this.authService.obtenerUsuarioAutenticado().subscribe({
      next: () => {
        console.log('¡Ecosistema e interfaz de usuario sincronizados tras el cobro!');
      },
      error: (err) => {
        console.error('Error al actualizar los datos de la sesión pos-pago:', err);
      }
    });
  }
}