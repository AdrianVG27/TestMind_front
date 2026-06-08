import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { SuscriptionService } from "../../../core/services/suscription.service";
import { SuscriptionCardComponent } from "../../../shared/components/suscription-card/suscription-card.component";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  selector: 'app-suscription-list',
  standalone: true,
  imports: [CommonModule, SuscriptionCardComponent, TranslocoModule],
  templateUrl: './suscription-list.component.html',
  styleUrl: './suscription-list.component.css'
})
export class SuscriptionListComponent implements OnInit {
  private suscriptionService = inject(SuscriptionService);

  public planes = this.suscriptionService.planList;
  public cargandoEcosistema = signal<boolean>(true);

  public sdkListo = signal<boolean>(false);

  ngOnInit(): void {
    this.inicializarModuloSuscripciones();
  }

  private async inicializarModuloSuscripciones(): Promise<void> {
    try {
      this.cargandoEcosistema.set(true);

      await this.suscriptionService.cargarSdkPayPal();
      this.sdkListo.set(true);

      this.suscriptionService.getAvailablePlans().subscribe({
        next: () => {
          this.cargandoEcosistema.set(false);
        },
        error: (err) => {
          console.error('Error al recuperar catálogo de Tiers desde Laravel:', err);
          this.cargandoEcosistema.set(false);
        }
      });
    } catch (error) {
      console.error('Fallo crítico en la carga de pasarelas asíncronas:', error);
      this.cargandoEcosistema.set(false);
    }
  }
}