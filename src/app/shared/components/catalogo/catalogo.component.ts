import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

export interface FiltrosCatalogo {
  nombre: string;
  categoriaCodigo: string | undefined;
  pagina: number;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, TranslocoModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent {
  categorias = input<any[]>([]);
  paginaActual = input<number>(1);
  totalPaginas = input<number>(1);
  mostrarAvisoVacio = input<boolean>(false);
  textoVacio = input<string>();

  filtrar = output<FiltrosCatalogo>();

  filterNombre = signal<string>('');
  filterCategoria = signal<string | undefined>(undefined);

  onNombreChange(nuevoNombre: string) {
    this.filterNombre.set(nuevoNombre);
    this.emitirFiltros(1);
  }

  onCategoriaChange(nuevaCategoria: string | undefined) {
    this.filterCategoria.set(nuevaCategoria);
    this.emitirFiltros(1);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.emitirFiltros(nuevaPagina);
    }
  }

  private emitirFiltros(pagina: number) {
    this.filtrar.emit({
      nombre: this.filterNombre(),
      categoriaCodigo: this.filterCategoria(),
      pagina: pagina
    });
  }
}
