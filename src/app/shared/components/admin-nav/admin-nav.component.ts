import { Component, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslocoPipe],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {
  private translocoService = inject(TranslocoService);
  private authService = inject(AuthService);

  userPlan = this.authService.userPlan;
  isAuthenticated = this.authService.isAuthenticated;

  logout() {
    this.authService.logout();
  }

  cambiarIdioma(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  get langActivo() {
    return this.translocoService.getActiveLang();
  }
}
