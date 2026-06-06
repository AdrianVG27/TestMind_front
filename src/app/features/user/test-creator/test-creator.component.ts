import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { DocumentService } from '../../../core/services/document.service';
import { TestService } from '../../../core/services/test.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { forkJoin, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-test-creator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test-creator.component.html',
  styleUrl: './test-creator.component.css'
})
export class TestCreatorComponent {
  private docService = inject(DocumentService);
  private testService = inject(TestService);
  private catService = inject(CategoriaService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  testId!: number | null;
  documentSource = signal<'upload' | 'existing'>('upload');
  misDocumentos = this.docService.misDocumentos;
  categorias = signal<any[]>([]);
  categoriaDelDocumentoSeleccionado = signal<string>('');

  isReadOnlyMode = signal<boolean>(false);
  testEstadoCodigo = signal<string>('');

  filtroNombreLocal = signal<string>('');
  filtroCategoriaLocal = signal<string | undefined>(undefined);

  mostrarModalPdf = signal<boolean>(false);
  pdfUrlBlob = signal<SafeResourceUrl | null>(null);

  isProcessing = signal<boolean>(false);
  statusMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  isExporting = signal<boolean>(false);
  mostrarModalGift = signal<boolean>(false);
  giftContent = signal<string>('');

  selectedFile: File | null = null;

  testForm = {
    titulo: signal(''),
    categoria_codigo: signal<string | null>(null),
    documento_id: signal<number | null>(null),
    isPublic: signal(false),
    nivel: signal('medio'),
    total: signal(10),
    prop_unica: signal(60),
    prop_multi: signal(20),
    prop_escribir: signal(20),
    min_opciones: signal(3),
    max_opciones: signal(4),
    input_user: signal('')
  };

  documentosFiltrados = computed(() => {
    let docs = this.misDocumentos();
    const currentDocId = this.testForm.documento_id();

    if (this.isReadOnlyMode() && currentDocId) {
      return docs.filter(d => d.id === currentDocId);
    }

    const nombre = this.filtroNombreLocal().toLowerCase().trim();
    const catCodigo = this.filtroCategoriaLocal();

    if (nombre) {
      docs = docs.filter(d => d.nombre.toLowerCase().includes(nombre));
    }
    if (catCodigo !== undefined) {
      docs = docs.filter(d => d.categoria_codigo === catCodigo);
    }
    return docs;
  });

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { testId: number };
    if (state?.testId) {
      this.testId = state.testId;
    }
  }

  ngOnInit() {
    this.isProcessing.set(true);
    this.statusMessage.set('Sincronizando registros académicos...');

    forkJoin({
      cats: this.catService.index(),
      docs: this.docService.obtenerMisDocumentos()
    }).pipe(
      switchMap((resultadoBase) => {
        this.categorias.set(resultadoBase.cats);

        if (this.testId) {
          return this.testService.obtenerTest(Number(this.testId));
        }

        return of(null);
      })
    ).subscribe({
      next: (testResult) => {
        this.isProcessing.set(false);
        this.statusMessage.set(null);

        if (testResult) {
          this.cargarConfiguracionTestExistente(testResult);
        }
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.statusMessage.set(null);
        this.errorMessage.set('Error en la sincronización de datos con el servidor.');
        console.error(err);
      }
    });
  }

  cargarConfiguracionTestExistente(data: any) {
    let testExistente = data.data;
    if (testExistente) {
      this.testForm.titulo.set(testExistente.titulo);
      this.testForm.documento_id.set(testExistente.documento_id);

      this.isReadOnlyMode.set(true);
      this.documentSource.set('existing');
      this.testEstadoCodigo.set(testExistente.estado_codigo);

      const config = testExistente.configuracion || testExistente;
      this.testForm.nivel.set(config.nivel || 'medio');
      this.testForm.total.set(config.total || 10);
      this.testForm.min_opciones.set(config.min_opciones || 3);
      this.testForm.max_opciones.set(config.max_opciones || 4);
      this.testForm.prop_unica.set(config.prop_unica ?? 60);
      this.testForm.prop_multi.set(config.prop_multi ?? 20);
      this.testForm.prop_escribir.set(config.prop_escribir ?? 20);
      this.testForm.input_user.set(config.input_user || '');

      const docAsociado = this.misDocumentos().find(d => d.id === testExistente.documento_id);
      if (docAsociado) {
        const nombreCat = this.obtenerNombreCategoria(docAsociado.categoria_codigo);
        this.categoriaDelDocumentoSeleccionado.set(nombreCat);
      }

      this.filtroNombreLocal.set('');
      this.filtroCategoriaLocal.set(undefined);
    }
  }

  setSource(source: 'upload' | 'existing') {
    if (this.isReadOnlyMode()) return;
    this.documentSource.set(source);
    this.errorMessage.set(null);
    if (source === 'upload') {
      this.testForm.documento_id.set(null);
      this.categoriaDelDocumentoSeleccionado.set('');
    } else {
      this.selectedFile = null;
      this.testForm.categoria_codigo.set(null);
    }
  }

  obtenerNombreCategoria(codigo: string): string {
    const cat = this.categorias().find(c => c.codigo === codigo);
    return cat ? cat.descripcion : 'General';
  }

  seleccionarDocumentoLocal(doc: any) {
    if (this.isReadOnlyMode()) return;
    this.testForm.documento_id.set(doc.id);
    this.categoriaDelDocumentoSeleccionado.set(this.obtenerNombreCategoria(doc.categoria_codigo));
  }

  volverAlPerfil() {
    this.router.navigate(['/profile']);
  }

  abrirPrevisualizador(idDoc: number, event: Event) {
    event.stopPropagation();
    this.statusMessage.set('Cargando flujo d previsualización...');
    this.docService.descargarDocumento(idDoc).subscribe({
      next: (blob) => {
        this.statusMessage.set(null);
        const urlRaw = URL.createObjectURL(blob);
        this.pdfUrlBlob.set(this.sanitizer.bypassSecurityTrustResourceUrl(urlRaw));
        this.mostrarModalPdf.set(true);
      },
      error: () => {
        this.statusMessage.set(null);
        this.errorMessage.set('No se pudo recuperar la previsualización del archivo.');
      }
    });
  }

  cerrarPrevisualizador() {
    this.mostrarModalPdf.set(false);
    this.pdfUrlBlob.set(null);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.errorMessage.set(null);
    } else {
      this.selectedFile = null;
      this.errorMessage.set('El archivo debe ser un PDF válido.');
    }
  }

  isFormValid(): boolean {
    if (this.isReadOnlyMode()) return this.testEstadoCodigo() === 'err';
    if (this.documentSource() === 'upload') {
      return !!this.selectedFile && !!this.testForm.categoria_codigo() && !!this.testForm.titulo();
    }
    return !!this.testForm.documento_id() && !!this.testForm.titulo();
  }

  onFormSubmit() {
    if (!this.isFormValid()) return;

    this.isProcessing.set(true);
    this.errorMessage.set(null);

    if (this.isReadOnlyMode()) {
      this.statusMessage.set('Reiniciando hilos del servidor. Inyectando IA de nuevo...');

      const reintentoPayload = {
        documento_id: this.testForm.documento_id()!,
        titulo: this.testForm.titulo(),
        nivel: this.testForm.nivel(),
        total: this.testForm.total(),
        prop_unica: this.testForm.prop_unica(),
        prop_multi: this.testForm.prop_multi(),
        prop_escribir: this.testForm.prop_escribir(),
        min_opciones: this.testForm.min_opciones(),
        max_opciones: this.testForm.max_opciones(),
        input_user: this.testForm.input_user() || null
      };

      this.testService.crearTest(reintentoPayload).subscribe({
        next: () => {
          this.isProcessing.set(false);
          this.statusMessage.set(null);
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.isProcessing.set(false);
          this.statusMessage.set(null);
          this.errorMessage.set(err.error?.message || 'El motor d IA volvió a fallar. Revisa los apuntes.');
        }
      });
      return;
    }

    const sumaProp = this.testForm.prop_unica() + this.testForm.prop_multi() + this.testForm.prop_escribir();
    if (sumaProp !== 100) {
      this.errorMessage.set('La suma de las proporciones debe ser exactamente 100%.');
      this.isProcessing.set(false);
      return;
    }

    let ejecucionObservable$;
    if (this.documentSource() === 'upload' && this.selectedFile) {
      this.statusMessage.set('Subiendo archivo PDF al servidor...');
      const docData = new FormData();
      docData.append('pdf', this.selectedFile);
      docData.append('categoria_codigo', this.testForm.categoria_codigo()!);
      docData.append('isPublic', this.testForm.isPublic() ? '1' : '0');
      ejecucionObservable$ = this.docService.subirDocumento(docData);
    } else {
      this.statusMessage.set('Parámetros confirmados. Inicializando motor d IA...');
      ejecucionObservable$ = of({ id: this.testForm.documento_id() });
    }

    ejecucionObservable$.pipe(
      tap(() => this.statusMessage.set('Configurando parámetros e inyectando IA...')),
      switchMap((docInstancia: any) => {
        const testPayload = {
          documento_id: docInstancia.id,
          titulo: this.testForm.titulo(),
          nivel: this.testForm.nivel(),
          total: this.testForm.total(),
          prop_unica: this.testForm.prop_unica(),
          prop_multi: this.testForm.prop_multi(),
          prop_escribir: this.testForm.prop_escribir(),
          min_opciones: this.testForm.min_opciones(),
          max_opciones: this.testForm.max_opciones(),
          input_user: this.testForm.input_user() || null
        };
        return this.testService.crearTest(testPayload);
      })
    ).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.statusMessage.set(null);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.statusMessage.set(null);
        this.errorMessage.set(err.error?.message || 'Error en el proceso d generación.');
      }
    });
  }

  abrirModalExportacion(event: Event) {
    event.preventDefault();
    if (!this.testId || this.testEstadoCodigo() !== 'C') return;

    this.isExporting.set(true);
    this.statusMessage.set('Generando formato Moodle GIFT...');

    this.testService.exportarMoodleGift(this.testId).subscribe({
      next: (res) => {
        this.isExporting.set(false);
        this.statusMessage.set(null);
        this.giftContent.set(res.data);
        this.mostrarModalGift.set(true);
      },
      error: (err) => {
        this.isExporting.set(false);
        this.statusMessage.set(null);
        this.errorMessage.set(err.error?.error || 'Error al exportar el test. Revisa tu plan.');
      }
    });
  }

  cerrarModalGift() {
    this.mostrarModalGift.set(false);
    this.giftContent.set('');
  }

  copiarGiftAlPortapapeles() {
    navigator.clipboard.writeText(this.giftContent()).then(() => {
      this.statusMessage.set('¡Texto copiado al portapapeles!');
      setTimeout(() => this.statusMessage.set(null), 3000);
    });
  }

}