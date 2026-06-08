import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-password',
  standalone: true,
  imports: [FormsModule, TranslocoModule],
  templateUrl: './admin-password.component.html'
})
export class AdminPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private translocoService = inject(TranslocoService);

  isProcessing = signal<boolean>(false);
  statusMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  erroresValidacion = signal<any>(null);

  passForm = {
    current_password: signal(''),
    password: signal(''),
    password_confirmation: signal('')
  };

  public isFormValid(): boolean {
    return !!this.passForm.current_password() &&
      !!this.passForm.password() &&
      !!this.passForm.password_confirmation();
  }

  public onFormSubmit(): void {
    if (!this.isFormValid()) return;

    if (this.passForm.password() !== this.passForm.password_confirmation()) {
      this.errorMessage.set(this.translocoService.translate('admin.changed_password.errorPassword'));
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.erroresValidacion.set(null);

    const payload = {
      current_password: this.passForm.current_password(),
      password: this.passForm.password(),
      password_confirmation: this.passForm.password_confirmation()
    };

    this.authService.updateAdminPassword(payload).subscribe({
      next: (res) => {
        this.isProcessing.set(false);
        this.statusMessage.set(null);

        this.volverAlDashboard();
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.statusMessage.set(null);

        if (err.status === 422) {
          this.erroresValidacion.set(err.error?.errors);
        }
      }
    });
  }

  public volverAlDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}