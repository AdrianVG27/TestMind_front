import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
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
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    this.isProcessing.set(true);
    this.statusMessage.set('Forjando credenciales de administración en la base de datos...');
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

        Swal.fire({
          icon: 'success',
          title: 'Administrador Creado',
          text: res.message || 'La nueva cuenta de administración ha sido forjada en TestMind.',
          background: '#141b24',
          color: '#ffffff',
          confirmButtonColor: '#5CF0A5'
        });
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.statusMessage.set(null);

        if (err.status === 422) {
          this.erroresValidacion.set(err.error?.errors);
        } else if (err.status !== 401 && err.status !== 403 && err.status !== 500) {
          this.errorMessage.set(err.error?.message || 'Error crítico en el alta.');
        }
      }
    });
  }

  public volverAlPerfil(): void {
    this.router.navigate(['/profile']);
  }
}