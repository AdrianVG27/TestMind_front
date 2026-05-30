import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRole = route.data['role'];
  const requiredPlan = route.data['plan'];

  const user = authService.currentUser();

  if (!user) return router.parseUrl('/login');

  if (expectedRole && user.Role !== expectedRole) {
    return router.parseUrl(user.Role === 'admin' ? '/admin/dashboard' : '/reader');
  }

  if (requiredPlan && user.Plan === 'free' && requiredPlan !== 'free') {
    return router.parseUrl('/upgrade');
  }

  return true;
};