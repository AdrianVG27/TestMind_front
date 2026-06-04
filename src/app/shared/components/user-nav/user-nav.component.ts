import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { LangSelectorComponent } from "../lang-selector/lang-selector.component";
import { GetTierPipe } from "../../pipes/get-tier.pipe";
import { SuscriptionService } from '../../../core/services/suscription.service';

@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslocoPipe, LangSelectorComponent, GetTierPipe],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent {
  private authService = inject(AuthService);
  private suscriptionService = inject(SuscriptionService);

  public listaPlanes = this.suscriptionService.planList;
  public isAuthenticated = this.authService.isAuthenticated;
  public userPlan = this.authService.userPlan;

  ngOnInit(): void {
    if (this.listaPlanes().length === 0) {
      this.suscriptionService.getAvailablePlans().subscribe({
        error: (err) => console.error('Error al precargar Tiers desde el Nav:', err)
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}