import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../../../core/services/document.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pdf-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-reader.component.html',
  styleUrl: './pdf-reader.component.css'
})
export class PdfReaderComponent implements OnInit {
  @Input() documentId!: number;

  public pdfUrl: SafeResourceUrl | null = null;

  private documentService = inject(DocumentService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { documentId: number};

    if (state) {
      this.documentId = state.documentId;
    }
  }

  ngOnInit() {
    if (this.documentId) {
      this.loadDocument();
    } else {
      console.error("TestMind Error: No se han recibido identificadores para el documento.");
      this.router.navigate(['/docs']);
    }
  }

  loadDocument() {
    this.documentService.descargarDocumento(this.documentId).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
      },
      error: (err) => {
        console.error('Error al descargar el PDF desde el backend de Laravel:', err);
      }
    });
  }
}
