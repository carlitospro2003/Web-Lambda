import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, LogoutResponse, AuthState, ApiErrorResponse } from '../models/user.model';
import { environment, API_ENDPOINTS } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.authStateSubject.next({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null
        });
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}${API_ENDPOINTS.login}`,
      credentials
    ).pipe(
      tap((response: LoginResponse) => {
        if (response.success) {
          // Verificar si el usuario tiene rol 'admin'
          if (response.data.USR_UserRole !== 'admin') {
            this.setLoading(false);
            this.setError('Acceso denegado. Solo los administradores pueden acceder al sistema.');
            throw new Error('Acceso denegado. Solo los administradores pueden acceder al sistema.');
          }
          this.setAuthData(response);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  logout(): Observable<LogoutResponse> {
    this.setLoading(true);
    
    return this.http.post<LogoutResponse>(
      `${environment.apiUrl}${API_ENDPOINTS.logout}`,
      {}
    ).pipe(
      tap((response) => {
        // Independientemente de la respuesta, limpiamos los datos locales
        this.clearAuthData();
        this.authStateSubject.next({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null
        });
      }),
      catchError((error: HttpErrorResponse) => {
        // Incluso si hay error en el servidor, limpiamos los datos locales
        this.clearAuthData();
        this.authStateSubject.next({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null
        });
        // No lanzamos el error ya que el logout debe funcionar siempre
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      const apiError = error.error as ApiErrorResponse;
      if (apiError && apiError.message) {
        errorMessage = apiError.message;
        // Si hay errores de validación, mostrar el primero
        if (apiError.errors) {
          const firstError = Object.values(apiError.errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        }
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    this.setError(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private setAuthData(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
    
    this.authStateSubject.next({
      isAuthenticated: true,
      user: response.data,
      token: response.token,
      loading: false,
      error: null
    });
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      loading
    });
  }

  private setError(error: string): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      loading: false,
      error
    });
  }

  // Getters para facilitar el acceso
  get isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  get currentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  get token(): string | null {
    return this.authStateSubject.value.token;
  }
}