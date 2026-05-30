import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },

    // Rutas Públicas
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'docs',
        loadComponent: () => import('./shared/components/document-list/document-list.component').then(m => m.DocumentListComponent)
    },
    {
        path: 'docs/read',
        loadComponent: () => import('./shared/components/pdf-reader/pdf-reader.component').then(m => m.PdfReaderComponent)
    },
    {
        path: 'tests',
        loadComponent: () => import('./shared/components/test-list/test-list.component').then(m => m.TestListComponent)
    },
    {
        path: 'tests/play',
        loadComponent: () => import('./features/test-player/test-player.component').then(m => m.TestPlayerComponent)
    },
    {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },

    // Rutas de Usuario (Cualquier nivel: Free, Premium, etc.)
    {
        path: '',
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'user' },
        loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
    },

    // Rutas de Administrador
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'admin' },
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },

    // 5. Catch-all (Opcional pero recomendado para el TFG)
    {
        path: '**',
        redirectTo: 'home'
    }
];