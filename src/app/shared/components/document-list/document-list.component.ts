import { Component, inject, signal, OnInit } from '@angular/core';
import { DocumentService } from '../../../core/services/document.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Router } from '@angular/router';
import { CatalogoComponent, FiltrosCatalogo } from '../catalogo/catalogo.component';
import { DocumentCardComponent } from '../document-card/document-card.component';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CatalogoComponent, DocumentCardComponent, TranslocoModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  private docService = inject(DocumentService);
  private catService = inject(CategoriaService);
  private router = inject(Router);

  documentos = this.docService.documentos;
  paginaActual = this.docService.currentPage;
  totalPaginas = this.docService.lastPage;
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
    this.docService.documentosPublicos(page, nombre, categoriaCodigo).subscribe();
  }

  verDocumento(id: number) {
    this.router.navigate(['/docs/read'], {
      state: { documentId: id }
    });
  }
}