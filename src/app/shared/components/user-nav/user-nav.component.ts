import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { LangSelectorComponent } from "../lang-selector/lang-selector.component";

@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslocoPipe, LangSelectorComponent],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent {
  private authService = inject(AuthService);

  public isAuthenticated = this.authService.isAuthenticated;
  public userPlan = this.authService.userPlan;

  logout() {
    this.authService.logout();
  }
}