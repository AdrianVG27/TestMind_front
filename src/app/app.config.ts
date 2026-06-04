import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTransloco } from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { languageInterceptor } from './core/interceptors/language.interceptor';
import { IdiomaConfigService } from './core/services/idioma-config.service';

export function inicializarIdiomasBaseDatos(idiomaService: IdiomaConfigService) {
  return () => idiomaService.cargarIdiomasDesdeBD();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        languageInterceptor
      ])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: inicializarIdiomasBaseDatos,
      deps: [IdiomaConfigService],
      multi: true
    },
    provideTransloco({
      config: {
        availableLangs: ['es'],
        defaultLang: 'es',
        fallbackLang: 'es',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        flatten: {
          aot: false
        }
      },
      loader: TranslocoHttpLoader
    })
  ]
};