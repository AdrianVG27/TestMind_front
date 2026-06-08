import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-new-admin',
  standalone: true,
  imports: [FormsModule, TranslocoModule],
  templateUrl: './new-admin.component.html'
})
export class NewAdminComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private translocoService = inject(TranslocoService);

  isProcessing = signal<boolean>(false);
  statusMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  erroresValidacion = signal<any>(null);

  adminForm = {
    name: signal(''),
    email: signal(''),
    password: signal(''),
    password_confirmation: signal('')
  };

  public isFormValid(): boolean {
    return !!this.adminForm.name() &&
      !!this.adminForm.email() &&
      !!this.adminForm.password() &&
      !!this.adminForm.password_confirmation();
  }

  public onFormSubmit(): void {
    if (!this.isFormValid()) return;

    if (this.adminForm.password() !== this.adminForm.password_confirmation()) {
      this.errorMessage.set(this.translocoService.translate('admin.new_admin.errorPasswords'));
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.erroresValidacion.set(null);

    const payload = {
      name: this.adminForm.name(),
      email: this.adminForm.email(),
      password: this.adminForm.password(),
      password_confirmation: this.adminForm.password_confirmation()
    };

    this.authService.registerAdmin(payload).subscribe({
      next: (res) => {
        this.isProcessing.set(false);
        this.statusMessage.set(null);

        this.adminForm.name.set('');
        this.adminForm.email.set('');
        this.adminForm.password.set('');
        this.adminForm.password_confirmation.set('');
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

  public volverAlPerfil(): void {
    this.router.navigate(['/profile']);
  }
}