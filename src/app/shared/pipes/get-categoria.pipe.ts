import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCategoria',
  standalone: true
})
export class GetCategoriaPipe implements PipeTransform {

  transform(categoriaCodigo: string, categorias: any[] | null): string {
    if (!categorias || !categoriaCodigo) return 'Sin categoría';
    const cat = categorias.find(c => c.codigo === categoriaCodigo);
    return cat ? cat.descripcion : 'No encontrada';
  }

}
