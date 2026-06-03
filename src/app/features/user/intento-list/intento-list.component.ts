import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProfileMetricService } from '../../../core/services/profile-metric.service';
import { CatalogoComponent, FiltrosCatalogo } from '../../../shared/components/catalogo/catalogo.component';
import { IntentoCardComponent } from "../../../shared/components/intento-card/intento-card.component";

@Component({
  selector: 'app-intento-list',
  standalone: true,
  imports: [CatalogoComponent, IntentoCardComponent],
  templateUrl: './intento-list.component.html',
  styleUrl: './intento-list.component.css'
})
export class IntentoListComponent implements OnInit {
  private metricService = inject(ProfileMetricService);
  private catService = inject(CategoriaService);
  private router = inject(Router);

  intentos = this.metricService.listaIntentos; 
  
  paginaActual = signal(1);
  totalPaginas = signal(1);
  
  categorias = signal<any[]>([]);

  ngOnInit() {
    this.cargarCategorias();
    this.ejecutarBusqueda(1, '', undefined);
  }

  cargarCategorias() {
    this.catService.index().subscribe(cats => this.categorias.set(cats));
    console.table(this.categorias);
  }

  onFiltrar(filtros: FiltrosCatalogo) {
    this.ejecutarBusqueda(filtros.pagina, filtros.nombre, filtros.categoriaCodigo);
  }

  private ejecutarBusqueda(page: number, nombre: string, categoriaCodigo: string | undefined) {
    this.metricService.cargarHistorialIntentos().subscribe();
  }

  irACorrecion(idIntento: number) {
    this.metricService.obtenerDetalleIntento(idIntento).subscribe({
      next: (datosFeedback) => {
        this.router.navigate(['result'], {
          state: {
            datosResultado: datosFeedback,
            origen: 'attempts'
          }
        });
      },
      error: (err) => console.error('Error al recuperar la auditoría del examen:', err)
    });
  }
}