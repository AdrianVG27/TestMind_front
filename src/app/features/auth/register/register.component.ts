import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, TranslocoPipe, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Output() registerSuccess = new EventEmitter<void>();
  @Output() irALogin = new EventEmitter<void>();

  private auth = inject(AuthService);
  private router = inject(Router);

  hayTestPendiente: boolean = sessionStorage.getItem('testmind_respuestas_pendientes') !== null;

  form = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  errorMessage = signal<string | null>(null);
  erroresValidacion = signal<any>(null);

  handleRegister() {
    this.errorMessage.set(null);
    this.erroresValidacion.set(null);

    this.auth.register(this.form).subscribe({
      next: (res) => {
        if (this.hayTestPendiente) {
          this.registerSuccess.emit();
        } else {
          this.router.navigate(['/main']);
        }
      },
      error: (err) => {
        if (err.status === 422) {
          this.erroresValidacion.set(err.error?.errors);
        }
        else if (err.status !== 500 && err.status !== 401 && err.status !== 0) {
          this.errorMessage.set(err.error?.message || 'Error al intentar crear la cuenta.');
        }
      }
    });
  }

  cambiarAModalLogin(event: Event) {
    event.preventDefault();
    this.irALogin.emit();
  }
}