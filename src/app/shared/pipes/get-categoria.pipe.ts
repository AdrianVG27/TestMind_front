import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
  name: 'getCategoria',
  standalone: true
})
export class GetCategoriaPipe implements PipeTransform {
  private translocoService = inject(TranslocoService);

  transform(categoriaCodigo: string, categorias: any[] | null): string {
    if (!categorias || !categoriaCodigo) return this.translocoService.translate('pipes.categoriaNoData');
    const cat = categorias.find(c => c.codigo === categoriaCodigo);
    return cat ? cat.descripcion : this.translocoService.translate('pipes.categoriaNoData');
  }

}
