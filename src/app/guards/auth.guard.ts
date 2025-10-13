import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    map(authState => {
      if (authState.isAuthenticated) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    map(authState => {
      if (authState.isAuthenticated) {
        // Redirigir al dashboard si ya está autenticado
        router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    })
  );
};