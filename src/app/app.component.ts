import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserNavComponent } from './shared/components/user-nav/user-nav.component';
import { AdminNavComponent } from './shared/components/admin-nav/admin-nav.component';
import { AuthService } from './core/services/auth.service';
import { DOCUMENT } from '@angular/common';
import { TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserNavComponent, AdminNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TestMind';

  public authService = inject(AuthService);
  private readonly translocoService = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.initSavedLanguage();
  }

  ngOnInit(): void {
    this.trackLanguageChanges();
  }

  private initSavedLanguage(): void {
    const savedLang = localStorage.getItem('tm_lang');
    if (savedLang) {
      this.translocoService.setActiveLang(savedLang);
    }
  }

  private trackLanguageChanges(): void {
    this.translocoService.langChanges$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((lang: string) => {
        localStorage.setItem('tm_lang', lang);

        this.updateHtmlLangAttribute(lang);
      });
  }

  private updateHtmlLangAttribute(lang: string): void {
    const htmlTag = this.document.documentElement;
    if (htmlTag) {
      htmlTag.setAttribute('lang', lang);
    }
  }
}
