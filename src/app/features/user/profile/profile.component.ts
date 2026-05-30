import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileMetricService } from '../../../core/services/profile-metric.service';
import { TestService } from '../../../core/services/test.service';
import { GetCategoriaPipe } from "../../../shared/pipes/get-categoria.pipe";
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, GetCategoriaPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  public authService = inject(AuthService);
  public metricService = inject(ProfileMetricService);
  private testService = inject(TestService);
  private catService = inject(CategoriaService);
  private router = inject(Router);

  public mostrarModalConfig = signal<boolean>(false);
  public cargando = signal<boolean>(true);

  public editForm = signal({ Name: '', Email: '', Nickname: '', password: '', password_confirmation: '' });
  public msjError = signal<string | null>(null);
  categorias = signal<any[]>([]);

  public ultimosIntentos = computed(() => {
    return this.metricService.listaIntentos().slice(0, 10);
  });

  public ultimosCreados = computed(() => {
    return this.testService.tests().slice(0, 10);
  });

  ngOnInit(): void {
    this.authService.obtenerUsuarioAutenticado().subscribe({
      next: () => {
        this.metricService.cargarHistorialIntentos().subscribe({
          next: () => {
            this.testService.obtenerMisTests().subscribe({
              next: () => {
                this.cargarDatosFormulario();
                this.cargarCategorias();
                this.cargando.set(false);
              },
              error: () => this.marcarCargaCompletadaFailsafe()
            });
          },
          error: () => this.marcarCargaCompletadaFailsafe()
        });
      },
      error: (err) => {
        console.error('Error fatal al sincronizar perfil:', err);
        this.cargando.set(false);
      }
    });
  }

  cargarCategorias() {
    this.catService.index().subscribe(cats => this.categorias.set(cats));
  }

  private marcarCargaCompletadaFailsafe(): void {
    this.cargarDatosFormulario();
    this.cargando.set(false);
  }

  private cargarDatosFormulario(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.editForm.set({
        Name: user.Name || '',
        Email: user.Email || '',
        Nickname: user.Nickname || '',
        password: '',
        password_confirmation: ''
      });
    }
  }

  public abrirModal(): void {
    this.cargarDatosFormulario();
    this.msjError.set(null);
    this.mostrarModalConfig.set(true);
  }

  public guardarCambiosPerfil(): void {
    const datos = this.editForm();

    if (datos.password && datos.password !== datos.password_confirmation) {
      this.msjError.set('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      name: datos.Name,
      email: datos.Email,
      nickname: datos.Nickname,
      ...(datos.password ? { password: datos.password } : {})
    };

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.mostrarModalConfig.set(false);
        this.msjError.set(null);
      },
      error: (err) => this.msjError.set(err.error.message || 'Error al actualizar perfil')
    });
  }

  public navegarA(ruta: 'attempts' | 'history'): void {
    this.router.navigate([`${ruta}`]);
  }

  public irACorrecion(intentoId: number): void {
    this.metricService.obtenerDetalleIntento(intentoId).subscribe({
      next: (datosFeedback) => {
        this.router.navigate(['result'], {
          state: {
            datosResultado: datosFeedback,
            origen: '/profile'
          }
        });
      },
      error: (err) => console.error('Error al recuperar la auditoría del examen', err)
    });
  }

  public irAEdicion(testId: number): void {
    this.router.navigate(['/creator'], {
      state: { testId: testId }
    });
  }
}