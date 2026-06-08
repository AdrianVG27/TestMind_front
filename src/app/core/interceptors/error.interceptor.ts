import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

const GLOBAL_FALLBACK_ERRORS: Record<string, string> = {
  'error.GlobalHandler_ServerError.500': 'An unexpected error occurred on the TestMind server or the database is down.',
  'error.GlobalHandler_Unauthorized.401': 'Your session has expired. Please log in again.',
  'error.GlobalHandler_Forbidden.403': 'You do not have permissions to perform this action.',
  'error.GlobalHandler_NotFound.404': 'The requested resource does not exist.',
  'network_error': 'Could not establish connection with the server. Please check your internet connection.'
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const transloco = inject(TranslocoService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 422) {
        return throwError(() => error);
      }

      if (error.status === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: GLOBAL_FALLBACK_ERRORS['network_error'],
          confirmButtonText: 'OK',
          background: '#141b24',
          color: '#ffffff',
          confirmButtonColor: '#3085d6'
        });
        return throwError(() => error);
      }

      const payload = error.error;
      let claveTraduccion = 'error.GlobalHandler_ServerError.500';

      if (payload && payload.error_key) {
        claveTraduccion = payload.error_key;
      } else {
        switch (error.status) {
          case 401: claveTraduccion = 'error.GlobalHandler_Unauthorized.401'; break;
          case 403: claveTraduccion = 'error.GlobalHandler_Forbidden.403'; break;
          case 404: claveTraduccion = 'error.GlobalHandler_NotFound.404'; break;
        }
      }

      const parametros = payload?.error_params || {};

      let mensajeFinal = transloco.translate(claveTraduccion, parametros);

      if (mensajeFinal === claveTraduccion || !mensajeFinal) {
        mensajeFinal = GLOBAL_FALLBACK_ERRORS[claveTraduccion] || payload?.message || GLOBAL_FALLBACK_ERRORS['error.GlobalHandler_ServerError.500'];
      }

      const tituloModal = error.status >= 500 ? 'Server Error' : 'Attention';

      Swal.fire({
        icon: error.status >= 500 ? 'error' : 'warning',
        title: tituloModal,
        text: mensajeFinal,
        confirmButtonText: 'OK',
        background: '#141b24',
        color: '#ffffff',
        confirmButtonColor: '#3085d6'
      });

      return throwError(() => error);
    })
  );
};