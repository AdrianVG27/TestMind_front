import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCategoria',
  standalone: true
})
export class GetCategoriaPipe implements PipeTransform {

  transform(categoriaId: number, categorias: any[] | null): string {
    if (!categorias || !categoriaId) return 'Sin categoría';
    const cat = categorias.find(c => c.id === categoriaId);
    return cat ? cat.descripcion : 'No encontrada';
  }

}
