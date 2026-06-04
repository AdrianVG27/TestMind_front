import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
    { path: 'support-tables-management', loadComponent: () => import('./gestion-ta/gestion-ta.component').then(c => c.GestionTAComponent) },
    { path: 'languages-management', loadComponent: () => import('./translation-management/translation-management.component').then(c => c.TranslationManagementComponent) },
];