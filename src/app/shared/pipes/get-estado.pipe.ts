import { Pipe, PipeTransform } from '@angular/core';
import { Estado } from '../../core/models/estado';

@Pipe({
  name: 'getEstado',
  standalone: true
})
export class GetEstadoPipe implements PipeTransform {

  transform(estadoCodigo: string | undefined | null, estados: Estado[] | null): string {
    if (!estadoCodigo) return 'falloEstado';
    if (!estados || estados.length === 0) return estadoCodigo.toUpperCase();

    const estadoEncontrado = estados.find(p => p.codigo.toUpperCase() === estadoCodigo.toUpperCase());

    return estadoEncontrado ? (estadoEncontrado.descripcion || estadoEncontrado.codigo) : estadoCodigo.toUpperCase();
  }

}
