import { Component, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LangSelectorComponent } from '../lang-selector/lang-selector.component';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslocoPipe, FormsModule, LangSelectorComponent],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {
  private authService = inject(AuthService);

  public isAuthenticated = this.authService.isAuthenticated;
  public userPlan = this.authService.userPlan;

  public isMenuOpen = signal<boolean>(false);

  toggleMenu() {
    this.isMenuOpen.update(val => !val);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
  }
}