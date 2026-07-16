import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.verify()) {
    return true; 
  } else {
    return router.createUrlTree(['/signin']); 
  }
};