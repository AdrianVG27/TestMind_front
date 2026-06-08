import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationAdminService, InterfazTraduccionModel } from '../../../core/services/translation-admin.service';
import { IdiomaConfigService } from '../../../core/services/idioma-config.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-translation-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  templateUrl: './translation-management.component.html',
  styleUrl: './translation-management.component.css'
})
export class TranslationManagementComponent {
  private translationService = inject(TranslationAdminService);
  private idiomaService = inject(IdiomaConfigService);
  private translocoService = inject(TranslocoService);

  public idiomaFiltro = signal<string>('es');
  public terminoBusqueda = signal<string>('');
  public isLoading = signal<boolean>(false);

  public mostrarModal = signal<boolean>(false);
  public nuevaClave = '';
  public nuevoValor = '';

  public erroresValidacion = signal<any>(null);

  public idiomasDisponibles = this.idiomaService.idiomasDisponibles;

  public traduccionesFiltradas = computed(() => {
    const codigoFiltro = this.idiomaFiltro();
    const buscar = this.terminoBusqueda().toLowerCase().trim();

    let resultado = this.translationService.catalogoTraducciones().filter(
      t => t.lenguaje_codigo === codigoFiltro
    );

    if (buscar) {
      resultado = resultado.filter(t =>
        t.clave.toLowerCase().includes(buscar) ||
        t.valor.toLowerCase().includes(buscar)
      );
    }

    return resultado;
  });

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading.set(true);
    this.translationService.obtenerCatalogo().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  cambiarFiltroIdioma(codigo: string) {
    this.idiomaFiltro.set(codigo);
  }

  actualizarBusqueda(texto: string) {
    this.terminoBusqueda.set(texto);
  }

  guardarCambioEnLinea(item: InterfazTraduccionModel, nuevoTexto: string) {
    if (item.valor === nuevoTexto) return;

    const payload: InterfazTraduccionModel = {
      id: item.id,
      clave: item.clave,
      valor: nuevoTexto,
      lenguaje_codigo: item.lenguaje_codigo
    };

    this.translationService.actualizarLiteral(payload).subscribe({
      error: () => this.cargarDatos()
    });
  }

  abrirModalCrear() {
    this.nuevaClave = '';
    this.nuevoValor = '';
    this.erroresValidacion.set(null);
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  crearNuevaTraduccion() {
    this.erroresValidacion.set(null);

    const payload: InterfazTraduccionModel = {
      clave: this.nuevaClave.trim(),
      valor: this.nuevoValor,
      lenguaje_codigo: this.idiomaFiltro()
    };

    this.isLoading.set(true);
    this.translationService.actualizarLiteral(payload).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarDatos();
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 422) {
          this.erroresValidacion.set(err.error?.errors);
        }
      }
    });
  }

  eliminarClaveDiccionario(clave: string) {
    let confirmar = confirm(
      this.translocoService.translate('admin.gestionLenguajes.confirmarEliminar', { clave: clave })
    );

    if (!confirmar) return;

    this.isLoading.set(true);
    this.translationService.eliminarLiteral(clave).subscribe({
      next: () => this.isLoading.set(false),
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}