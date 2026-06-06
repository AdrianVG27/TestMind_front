import { Component, inject, signal } from '@angular/core';
import { CatalogoComponent, FiltrosCatalogo } from "../../../shared/components/catalogo/catalogo.component";
import { TestStatusCardComponent } from "../../../shared/components/test-status-card/test-status-card.component";
import { TestService } from '../../../core/services/test.service';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { EstadoService } from '../../../core/services/estado.service';

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
  private estadoService = inject(EstadoService);
  private router = inject(Router);

  tests = this.testService.tests;
  paginaActual = this.testService.currentPage;
  totalPaginas = this.testService.lastPage;
  categorias = signal<any[]>([]);
  estados = signal<any[]>([]);

  ngOnInit() {
    this.cargarCategorias();
    this.cargarEstados();
    this.ejecutarBusqueda(1, '', undefined);
  }

  cargarCategorias() {
    this.catService.index().subscribe(cats => this.categorias.set(cats));
  }
  
  cargarEstados() {
    this.estadoService.index().subscribe(estados => this.estados.set(estados));
  }

  onFiltrar(filtros: FiltrosCatalogo) {
    this.ejecutarBusqueda(filtros.pagina, filtros.nombre, filtros.categoriaCodigo);
  }

  private ejecutarBusqueda(page: number, nombre: string, categoriaCodigo: string | undefined) {
    this.testService.obtenerMisTests(page, nombre, categoriaCodigo).subscribe();
  }

  verTest(id: number) {
    this.router.navigate(['/creator'], {
      state: { testId: id }
    });
  }
}
