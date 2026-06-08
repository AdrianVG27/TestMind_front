import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-intento-card',
  standalone: true,
  imports: [],
  templateUrl: './intento-card.component.html',
  styleUrl: './intento-card.component.css'
})
export class IntentoCardComponent {
  intento = input.required<any>();

  clickCard = output<number>();

  onCardClick() {
    this.clickCard.emit(this.intento().id);
  }
}
