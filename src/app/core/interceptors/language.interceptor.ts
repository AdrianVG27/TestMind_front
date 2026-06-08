import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const translocoService = inject(TranslocoService);
  
  const activeLang = localStorage.getItem('tm_lang') || translocoService.getActiveLang() || 'es';

  const authReq = req.clone({
    setHeaders: {
      'language': activeLang
    }
  });

  return next(authReq);
};
