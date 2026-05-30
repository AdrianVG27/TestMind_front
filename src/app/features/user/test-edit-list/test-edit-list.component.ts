import { Component, inject, signal } from '@angular/core';
import { CatalogoComponent, FiltrosCatalogo } from "../../../shared/components/catalogo/catalogo.component";
import { TestStatusCardComponent } from "../../../shared/components/test-status-card/test-status-card.component";
import { TestService } from '../../../core/services/test.service';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-test-edit-list',
  standalone: true,
  imports: [CatalogoComponent, TestStatusCardComponent],
  templateUrl: './test-edit-list.component.html',
  styleUrl: './test-edit-list.component.css'
})
export class TestEditListComponent {
  private testService = inject(TestService);
  private catService = inject(CategoriaService);
  private router = inject(Router);

  tests = this.testService.tests;
  paginaActual = this.testService.currentPage;
  totalPaginas = this.testService.lastPage;
  categorias = signal<any[]>([]);

  ngOnInit() {
    this.cargarCategorias();
    this.ejecutarBusqueda(1, '', undefined);
  }

  cargarCategorias() {
    this.catService.index().subscribe(cats => this.categorias.set(cats));
  }

  onFiltrar(filtros: FiltrosCatalogo) {
    this.ejecutarBusqueda(filtros.pagina, filtros.nombre, filtros.categoriaId);
  }

  private ejecutarBusqueda(page: number, nombre: string, categoriaId: number | undefined) {
    this.testService.obtenerMisTests(page, nombre, categoriaId).subscribe();
  }

  verTest(id: number) {
    this.router.navigate(['/creator'], {
      state: { testId: id }
    });
  }
}
