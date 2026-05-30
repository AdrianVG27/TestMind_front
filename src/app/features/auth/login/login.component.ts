import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslocoPipe, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() irARegistro = new EventEmitter<void>();

  private auth = inject(AuthService);
  private router = inject(Router);

  hayTestPendiente: boolean = sessionStorage.getItem('testmind_respuestas_pendientes') !== null;

  credentials = { email: '', password: '', remember: false };
  errorMessage = signal<string | null>(null);

  cambiarAModalRegistro(event: Event) {
    event.preventDefault();
    this.irARegistro.emit();
  }

  handleLogin() {
    this.auth.login(this.credentials).subscribe({
      next: (res) => {
        if (this.hayTestPendiente) {
          this.loginSuccess.emit();
        } else {
          const route = res.role === 'admin' ? '/admin/dashboard' : '/main';
          this.router.navigate([route]);
        }
      },
      error: (err) => this.errorMessage.set(err.error.message || 'Error de acceso')
    });
  }
}
