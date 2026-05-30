import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslocoPipe],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent {
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
