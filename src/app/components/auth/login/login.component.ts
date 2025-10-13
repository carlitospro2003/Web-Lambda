import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  loginData: LoginRequest = {
    USR_Email: '',
    USR_Password: '',
    rememberMe: false
  };

  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.loginData.USR_Email && this.loginData.USR_Password) {
      this.errorMessage = '';
      this.isLoading = true;
      
      this.authService.login(this.loginData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              console.log('Login successful:', response);
              // Redirigir al dashboard
              this.router.navigate(['/dashboard']);
            } else {
              this.errorMessage = response.message || 'Error en el inicio de sesión';
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Error en el inicio de sesión';
            console.error('Login error:', error);
          }
        });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword() {
    console.log('Forgot password clicked');
    // Implementar lógica para recuperar contraseña
  }
}