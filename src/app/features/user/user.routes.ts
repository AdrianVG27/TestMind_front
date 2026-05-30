import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
    { path: 'profile', loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent) },
    { path: 'creator', loadComponent: () => import('./test-creator/test-creator.component').then(c => c.TestCreatorComponent) },
    { path: 'result', loadComponent: () => import('./test-result/test-result.component').then(c => c.TestResultComponent) },
    { path: 'attempts', loadComponent: () => import('./intento-list/intento-list.component').then(c => c.IntentoListComponent) },
    { path: 'history', loadComponent: () => import('./test-edit-list/test-edit-list.component').then(c => c.TestEditListComponent) },
];