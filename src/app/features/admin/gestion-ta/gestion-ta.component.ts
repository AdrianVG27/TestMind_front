import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaApoyoService } from '../../../core/services/tabla-apoyo-service.service';

@Component({
  selector: 'app-gestion-ta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-ta.component.html',
  styleUrl: './gestion-ta.component.css'
})
export class GestionTAComponent {
  private apiService = inject(TablaApoyoService);

  tablasDisponibles = this.apiService.listaTablas;
  tablaActiva = this.apiService.tablaSeleccionadaData;

  idTablaSeleccionada = signal<number | null>(null);
  filaEnEdicion = signal<any | null>(null);
  idFilaActiva = signal<number | null>(null);

  isCreandoNuevo = signal<boolean>(false);
  nuevaFilaData = signal<any | null>(null);

  isProcessing = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  isModalAbierta = signal<boolean>(false);
  filaParaModal = signal<any | null>(null);
  traduccionesCargadas = signal<any[]>([]);
  idiomaModalActivo = signal<string>('es');

  isModalBorradoAbierta = signal<boolean>(false);
  idFilaParaBorrar = signal<number | null>(null);

  columnasTabla = computed(() => {
    const data = this.tablaActiva();
    if (!data || !data.registros || data.registros.length === 0) return [];
    return Object.keys(data.registros[0]);
  });

  isBorradoProhibido = computed(() => {
    const tabla = this.tablaActiva();
    const idFila = this.idFilaParaBorrar();
    
    if (!tabla || !idFila) return false;
    
    if (tabla.tabla.toLowerCase() === 'tablaapoyo') {
      const fila = tabla.registros.find((r: any) => r.id === idFila);
      if (fila && fila.nombreTA && fila.nombreTA.toLowerCase() === 'tablaapoyo') {
        return true;
      }
    }
    return false;
  });

  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    this.isProcessing.set(true);
    this.apiService.obtenerCatalogoTablas().subscribe({
      next: () => this.isProcessing.set(false),
      error: () => {
        this.isProcessing.set(false);
        this.errorMessage.set('Error al recuperar el catálogo de tablas de apoyo.');
      }
    });
  }

  onTablaChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const id = Number(selectElement.value);

    if (!id) {
      this.idTablaSeleccionada.set(null);
      this.apiService.tablaSeleccionadaData.set(null);
      this.cancelarCreacion();
      return;
    }

    this.idTablaSeleccionada.set(id);
    this.cancelarEdicion();
    this.cancelarCreacion();
    this.cargarFilas(id);
  }

  actualizarCampoFila(columna: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const copia = { ...this.filaEnEdicion() };
    copia[columna] = input.value;
    this.filaEnEdicion.set(copia);
  }

  cargarFilas(id: number) {
    this.isProcessing.set(true);
    this.apiService.cargarRegistrosTabla(id).subscribe({
      next: () => this.isProcessing.set(false),
      error: () => {
        this.isProcessing.set(false);
        this.errorMessage.set('No se pudieron leer los registros de la tabla seleccionada.');
      }
    });
  }

  iniciarEdicion(fila: any) {
    this.cancelarCreacion();
    this.idFilaActiva.set(fila.id);
    this.filaEnEdicion.set({ ...fila });
    this.limpiarMensajes();
  }

  cancelarEdicion() {
    this.idFilaActiva.set(null);
    this.filaEnEdicion.set(null);
  }

  iniciarCreacion() {
    this.cancelarEdicion();
    this.limpiarMensajes();

    const estructuraVacia: any = {};
    this.columnasTabla().forEach(col => {
      estructuraVacia[col] = this.isCampoBloqueadoCreacion(col) ? '(AUTO)' : '';
    });

    this.nuevaFilaData.set(estructuraVacia);
    this.isCreandoNuevo.set(true);
  }

  cancelarCreacion() {
    this.isCreandoNuevo.set(false);
    this.nuevaFilaData.set(null);
  }

  actualizarCampoNuevaFila(columna: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const copia = { ...this.nuevaFilaData() };
    copia[columna] = input.value;
    this.nuevaFilaData.set(copia);
  }

  ejecutarGuardadoNuevo() {
    const idTabla = this.idTablaSeleccionada();
    const payload = this.nuevaFilaData();
    if (!idTabla || !payload) return;

    this.isProcessing.set(true);
    this.apiService.crearRegistro(idTabla, payload).subscribe({
      next: (res) => {
        this.successMessage.set(res.message || 'Nuevo registro inyectado correctamente.');
        this.cancelarCreacion();
        this.cargarFilas(idTabla);
        this.cargarCatalogo();
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.errorMessage.set(err.error?.error || 'Error al persistir el nuevo registro auxiliar.');
      }
    });
  }

  isCampoProtegido(columna: string): boolean {
    const columnasBloqueadas = ['id', 'codigo', 'created_at', 'updated_at'];
    if (columnasBloqueadas.includes(columna.toLowerCase())) {
      return true;
    }

    const tabla = this.tablaActiva();
    const fila = this.filaEnEdicion();

    if (tabla && fila && tabla.tabla.toLowerCase() === 'tablaapoyo') {
      if (fila.nombreTA && fila.nombreTA.toLowerCase() === 'tablaapoyo') {
        if (columna.toLowerCase() === 'nombreta') {
          return true;
        }
      }
    }
    return false;
  }

  isCampoBloqueadoCreacion(columna: string): boolean {
    const columnasAuto = ['id', 'created_at', 'updated_at'];
    return columnasAuto.includes(columna.toLowerCase());
  }

  guardarCambios() {
    const idTabla = this.idTablaSeleccionada();
    const idFila = this.idFilaActiva();
    const payload = this.filaEnEdicion();

    if (!idTabla || !idFila || !payload) return;

    this.isProcessing.set(true);
    this.apiService.actualizarRegistro(idTabla, idFila, payload).subscribe({
      next: (res) => {
        this.successMessage.set(res.message || 'Registro actualizado con éxito.');
        this.cancelarEdicion();
        this.cargarFilas(idTabla);
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.errorMessage.set(err.error?.error || 'Error al procesar la actualización.');
      }
    });
  }

  solicitarEliminarFila(idFila: number) {
    this.idFilaParaBorrar.set(idFila);
    this.isModalBorradoAbierta.set(true);
    this.limpiarMensajes();
  }

  cancelarBorrado() {
    this.isModalBorradoAbierta.set(false);
    this.idFilaParaBorrar.set(null);
  }

  ejecutarEliminacionConfirmada() {
    const idTabla = this.idTablaSeleccionada();
    const idFila = this.idFilaParaBorrar();
    if (!idTabla || !idFila) return;

    this.isProcessing.set(true);
    this.isModalBorradoAbierta.set(false);

    this.apiService.eliminarRegistro(idTabla, idFila).subscribe({
      next: () => {
        this.successMessage.set('Registro eliminado correctamente de la tabla.');
        this.idFilaParaBorrar.set(null);
        this.cancelarEdicion();
        this.cargarFilas(idTabla);
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.idFilaParaBorrar.set(null);
        this.errorMessage.set(err.error?.error || 'No se pudo borrar la fila. Comprueba si está siendo usada como llave foránea.');
      }
    });
  }

  abrirModalIdiomas(fila: any) {
    const idTabla = this.idTablaSeleccionada();
    if (!idTabla || !fila.id) return;

    this.filaParaModal.set(fila);
    this.isProcessing.set(true);
    this.limpiarMensajes();

    this.apiService.obtenerTraduccionesFila(idTabla, fila.id).subscribe({
      next: (datos) => {
        this.traduccionesCargadas.set(datos);
        if (datos && datos.length > 0) {
          this.idiomaModalActivo.set(datos[0].lenguaje_codigo);
        }
        this.isModalAbierta.set(true);
        this.isProcessing.set(false);
      },
      error: () => {
        this.isProcessing.set(false);
        this.errorMessage.set('No se pudieron recuperar las traducciones asociadas.');
      }
    });
  }

  cerrarModal() {
    this.isModalAbierta.set(false);
    this.filaParaModal.set(null);
    this.traduccionesCargadas.set([]);
  }

  cambiarIdiomaModal(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.idiomaModalActivo.set(select.value);
  }

  actualizarTextoTraduccion(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const copia = [...this.traduccionesCargadas()];
    copia[index].descripcion = input.value;
    this.traduccionesCargadas.set(copia);
  }

  ejecutarGuardadoIdiomasMasivo() {
    const idTabla = this.idTablaSeleccionada();
    const fila = this.filaParaModal();
    if (!idTabla || !fila) return;

    this.isProcessing.set(true);
    this.apiService.guardarTraduccionesFila(idTabla, fila.id, this.traduccionesCargadas()).subscribe({
      next: (res) => {
        this.successMessage.set(res.message || 'Idiomas actualizados correctamente.');
        this.cerrarModal();
        this.cargarFilas(idTabla);
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.errorMessage.set(err.error?.error || 'Error crítico al actualizar las traducciones.');
      }
    });
  }

  private limpiarMensajes() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}