import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { IdiomaConfigService } from '../../../core/services/idioma-config.service';

@Component({
  selector: 'app-lang-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lang-selector.component.html',
  styleUrl: './lang-selector.component.css'
})
export class LangSelectorComponent {
  private translocoService = inject(TranslocoService);
  private idiomaService = inject(IdiomaConfigService);

  public idiomasBD = this.idiomaService.idiomasDisponibles;

  public idiomaActual: string = localStorage.getItem('tm_lang') || 'es';

  ngOnInit() {
    this.translocoService.setActiveLang(this.idiomaActual);
  }

  cambiarIdioma(lang: string) {
    if (!lang) return;
    this.idiomaActual = lang;
    localStorage.setItem('tm_lang', lang);
    this.translocoService.setActiveLang(lang);
  }
}