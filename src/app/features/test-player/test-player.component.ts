import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RealizarTest, Pregunta, IntentoResultado } from '../../core/models/test';
import { TestService } from '../../core/services/test.service';
import { LoginComponent } from "../auth/login/login.component";
import { RegisterComponent } from "../auth/register/register.component";
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-test-player',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent, RegisterComponent, TranslocoModule],
  templateUrl: './test-player.component.html',
  styleUrl: './test-player.component.css'
})
export class TestPlayerComponent {
  @Input() testId!: number;

  private testService = inject(TestService);
  private router = inject(Router);

  public test = signal<RealizarTest | null>(null);
  public cargando = signal<boolean>(true);

  public mostrarModalLogin = signal<boolean>(false);
  public modal = signal<'login' | 'registro'>('login');
  public respuestasUsuario = signal<{ [key: number]: any }>({});

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { testId: number };

    if (state) {
      this.testId = state.testId;
    }
  }

  private cargarCuestionario(id: number): void {
    this.testService.realizarTest(id).subscribe({
      next: (data) => {
        this.test.set(data);
        this.cargando.set(false);
        this.inicializarRespuestas(data.preguntas);
      },
      error: (err) => {
        console.error('Error al recuperar el test de TestMind:', err);
        this.router.navigate(['/tests']);
      }
    });
  }

  private inicializarRespuestas(preguntas: Pregunta[]): void {
    const estadoInicial: { [key: number]: any } = {};
    preguntas.forEach((pregunta, index) => {
      estadoInicial[index] = pregunta.tipo === 'multi_respuesta' ? [] : '';
    });
    this.respuestasUsuario.set(estadoInicial);
  }

  public onCheckboxChange(indexPregunta: number, opcion: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const respuestasActuales = { ...this.respuestasUsuario() };
    let listaOpciones: string[] = respuestasActuales[indexPregunta] || [];

    if (checkbox.checked) {
      listaOpciones.push(opcion);
    } else {
      listaOpciones = listaOpciones.filter(o => o !== opcion);
    }

    respuestasActuales[indexPregunta] = listaOpciones;
    this.respuestasUsuario.set(respuestasActuales);
  }

  public limpiarRespuesta(indexPregunta: number): void {
    this.respuestasUsuario.update(respuestas => ({
      ...respuestas,
      [indexPregunta]: ''
    }));
  }

  public actualizarRespuestaUnica(indexPregunta: number, valor: string): void {
    this.respuestasUsuario.update(respuestas => ({
      ...respuestas,
      [indexPregunta]: valor
    }));
  }

  public enviarRespuestas(): void {
    const testId = this.test()?.id;
    if (!testId) return;

    const respuestasPayload = this.respuestasUsuario();
    const duracionSegundos = null;

    this.testService.enviarTestParaCorregir(testId, respuestasPayload, duracionSegundos).subscribe({
      next: (resultado: IntentoResultado) => {
        sessionStorage.removeItem('testmind_respuestas_pendientes');

        this.router.navigate([`result`], {
          state: { datosResultado: resultado }
        });
      },
      error: (err) => {
        if (err.status === 401) {
          const backupData = { testId: testId, duracionSegundos: duracionSegundos, respuestas: respuestasPayload };
          sessionStorage.setItem('testmind_respuestas_pendientes', JSON.stringify(backupData));

          this.modal.set('login');
          this.mostrarModalLogin.set(true);
        } else {
          console.error('Error crítico en el proceso de evaluación:', err);
        }
      }
    });
  }

  public onLoginExitoso(): void {
    this.mostrarModalLogin.set(false);

    const dataGuardada = sessionStorage.getItem('testmind_respuestas_pendientes');
    if (!dataGuardada) return;

    const { testId, duracionSegundos, respuestas } = JSON.parse(dataGuardada);

    this.respuestasUsuario.set(respuestas);

    this.testService.enviarTestParaCorregir(testId, respuestas, duracionSegundos).subscribe({
      next: (resultado: IntentoResultado) => {
        sessionStorage.removeItem('testmind_respuestas_pendientes');
        this.router.navigate([`result`], { state: { datosResultado: resultado } });
      },
      error: (err) => console.error('Error al reintentar tras autenticación:', err)
    });
  }

  ngOnInit(): void {
    if (this.testId) {
      this.cargarCuestionario(Number(this.testId));
    } else {
      console.error('Parametro id no recibido');
      this.router.navigate(['/tests']);
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('testmind_respuestas_pendientes');
  }
}
