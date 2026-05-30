import { Component, input, output } from '@angular/core';
import { GetCategoriaPipe } from '../../pipes/get-categoria.pipe';

@Component({
  selector: 'app-test-card',
  standalone: true,
  imports: [GetCategoriaPipe],
  templateUrl: './test-card.component.html',
  styleUrl: './test-card.component.css'
})
export class TestCardComponent {
  test = input.required<any>();
  categorias = input<any[]>([]);

  clickCard = output<number>();

  onCardClick() {
    this.clickCard.emit(this.test().id);
  }
}