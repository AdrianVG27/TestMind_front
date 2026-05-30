import { Component, EventEmitter, inject, Output } from '@angular/core';
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

  handleRegister() {
    this.auth.register(this.form).subscribe({
      next: (res) => {
        if (this.hayTestPendiente) {
          this.registerSuccess.emit();
        } else {
          this.router.navigate(['/main']);
        }
      },
      error: (err) => {
        console.error('Error durante el auto-registro académico:', err);
      }
    });
  }

  cambiarAModalLogin(event: Event) {
    event.preventDefault();
    this.irALogin.emit();
  }
}
