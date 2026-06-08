import { Component, inject, signal, OnInit } from '@angular/core';
import { CategoriaService } from '../../../core/services/categoria.service';
import { TestService } from '../../../core/services/test.service';
import { Router } from '@angular/router';
import { CatalogoComponent, FiltrosCatalogo } from '../catalogo/catalogo.component';
import { TestCardComponent } from '../test-card/test-card.component';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CatalogoComponent, TestCardComponent, TranslocoModule], 
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.css'
})
export class TestListComponent {
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
    this.ejecutarBusqueda(filtros.pagina, filtros.nombre, filtros.categoriaCodigo);
  }

  private ejecutarBusqueda(page: number, nombre: string, categoriaCodigo: string | undefined) {
    this.testService.testsPaginate(page, nombre, categoriaCodigo).subscribe();
  }

  verTest(id: number) {
    this.router.navigate(['/tests/play'], {
      state: { testId: id }
    });
  }
}