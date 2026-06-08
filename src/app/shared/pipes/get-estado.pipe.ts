import { inject, Pipe, PipeTransform } from '@angular/core';
import { Estado } from '../../core/models/estado';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
  name: 'getEstado',
  standalone: true
})
export class GetEstadoPipe implements PipeTransform {
  private translocoService = inject(TranslocoService);

  transform(estadoCodigo: string | undefined | null, estados: Estado[] | null): string {
    if (!estadoCodigo) return this.translocoService.translate('pipes.estadoNoData');
    if (!estados || estados.length === 0) return estadoCodigo.toUpperCase();

    const estadoEncontrado = estados.find(p => p.codigo.toUpperCase() === estadoCodigo.toUpperCase());

    return estadoEncontrado ? (estadoEncontrado.descripcion || estadoEncontrado.codigo) : estadoCodigo.toUpperCase();
  }

}
