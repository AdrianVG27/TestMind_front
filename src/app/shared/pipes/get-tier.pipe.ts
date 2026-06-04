import { Pipe, PipeTransform } from '@angular/core';
import { Tier } from '../../core/models/tier';

@Pipe({
  name: 'getTier',
  standalone: true
})
export class GetTierPipe implements PipeTransform {

  transform(tierCodigo: string | undefined | null, planes: Tier[] | null): string {
    if (!tierCodigo) return 'SIN_PLAN_';
    if (!planes || planes.length === 0) return tierCodigo.toUpperCase();

    const tierEncontrado = planes.find(p => p.codigo.toUpperCase() === tierCodigo.toUpperCase());

    return tierEncontrado ? (tierEncontrado.descripcion || tierEncontrado.codigo) : tierCodigo.toUpperCase();
  }

}