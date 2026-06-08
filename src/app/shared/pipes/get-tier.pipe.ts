import { inject, Pipe, PipeTransform } from '@angular/core';
import { Tier } from '../../core/models/tier';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
  name: 'getTier',
  standalone: true
})
export class GetTierPipe implements PipeTransform {
  private translocoService = inject(TranslocoService);

  transform(tierCodigo: string | undefined | null, planes: Tier[] | null): string {
    if (!tierCodigo) return this.translocoService.translate('pipes.tierNoData');
    if (!planes || planes.length === 0) return tierCodigo.toUpperCase();

    const tierEncontrado = planes.find(p => p.codigo.toUpperCase() === tierCodigo.toUpperCase());

    return tierEncontrado ? (tierEncontrado.descripcion || tierEncontrado.codigo) : tierCodigo.toUpperCase();
  }

}