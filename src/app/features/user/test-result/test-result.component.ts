import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IntentoResultado } from '../../../core/models/test';

@Component({
  selector: 'app-test-result',
  standalone: true,
  imports: [],
  templateUrl: './test-result.component.html',
  styleUrl: './test-result.component.css'
})
export class TestResultComponent {
  private router = inject(Router);

  public resultado = signal<IntentoResultado | null>(null);
  private rutaOrigen = signal<string>('/tests');

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      datosResultado: IntentoResultado,
      origen?: string
    };

    if (state?.datosResultado) {
      this.resultado.set(state.datosResultado);
    }

    if (state?.origen) {
      this.rutaOrigen.set(state.origen);
    }
  }

  public volverAlPanel(): void {
    this.router.navigate([this.rutaOrigen()]);
  }
}
