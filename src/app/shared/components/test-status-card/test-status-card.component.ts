import { Component, input, output } from '@angular/core';
import { GetCategoriaPipe } from "../../pipes/get-categoria.pipe";

@Component({
  selector: 'app-test-status-card',
  standalone: true,
  imports: [GetCategoriaPipe],
  templateUrl: './test-status-card.component.html',
  styleUrl: './test-status-card.component.css'
})
export class TestStatusCardComponent {
  test = input.required<any>();
  categorias = input<any[]>([]);

  clickCard = output<number>();

  onCardClick() {
    this.clickCard.emit(this.test().id);
  }
}
