import { Component, input, output } from '@angular/core';
import { GetCategoriaPipe } from '../../pipes/get-categoria.pipe';

@Component({
  selector: 'app-document-card',
  standalone: true,
  imports: [GetCategoriaPipe],
  templateUrl: './document-card.component.html',
  styleUrl: './document-card.component.css'
})
export class DocumentCardComponent {
  doc = input.required<any>();
  categorias = input<any[]>([]);

  clickCard = output<number>();

  onCardClick() {
    this.clickCard.emit(this.doc().id);
  }
}
