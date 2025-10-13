import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, DashboardUser, UserStats, GetAllUsersResponse, RegisterRequest, RegisterResponse, ApiErrorResponse } from '../models/user.model';
import { environment, API_ENDPOINTS } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<DashboardUser[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(filter: 'trainer' | 'trainee' | 'All' = 'All'): Observable<DashboardUser[]> {
    return this.http.get<GetAllUsersResponse>(
      `${environment.apiUrl}${API_ENDPOINTS.getAllUsers(filter)}`
    ).pipe(
      map(response => {
        if (response.success) {
          const dashboardUsers = response.data.map(user => this.mapUserToDashboardUser(user));
          this.usersSubject.next(dashboardUsers);
          return dashboardUsers;
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getUserStats(): Observable<UserStats> {
    return this.http.get<GetAllUsersResponse>(
      `${environment.apiUrl}${API_ENDPOINTS.getAllUsers('All')}`
    ).pipe(
      map(response => {
        if (response.success) {
          return this.calculateStats(response.data);
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  createUser(userData: Omit<DashboardUser, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }): Observable<DashboardUser> {
    // Separar nombre completo en nombre y apellido
    const nameParts = userData.name?.split(' ') || ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Preparar los datos para la API de Laravel
    const registerData: RegisterRequest = {
      USR_Name: firstName,
      USR_LastName: lastName,
      USR_Email: userData.email || '',
      USR_Phone: userData.phone || '',
      USR_Password: userData.password || 'Password123',
      USR_UserRole: userData.role as 'trainer' | 'trainee'
    };

    return this.http.post<RegisterResponse>(
      `${environment.apiUrl}${API_ENDPOINTS.register}`,
      registerData
    ).pipe(
      map(response => {
        if (response.success) {
          return this.mapUserToDashboardUser(response.data);
        }
        throw new Error(response.message);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  updateUser(userId: number, userData: Partial<DashboardUser>): Observable<DashboardUser> {
    console.log('Update user:', userId, userData);
    return throwError(() => new Error('Endpoint de actualizaci�n no implementado a�n'));
  }

  deleteUser(userId: number): Observable<void> {
    console.log('Delete user:', userId);
    return throwError(() => new Error('Endpoint de eliminaci�n no implementado a�n'));
  }

  toggleUserStatus(userId: number): Observable<DashboardUser> {
    console.log('Toggle user status:', userId);
    return throwError(() => new Error('Endpoint de cambio de estado no implementado a�n'));
  }

  private mapUserToDashboardUser(user: User): DashboardUser {
    return {
      id: user.USR_ID,
      name: `${user.USR_Name} ${user.USR_LastName}`,
      email: user.USR_Email,
      role: user.USR_UserRole,
      isActive: true,
      phone: user.USR_Phone,
      createdAt: new Date(user.created_at)
    };
  }

  private calculateStats(users: User[]): UserStats {
    const stats: UserStats = {
      total: users.length,
      active: users.length,
      inactive: 0,
      byRole: {
        admin: 0,
        trainer: 0,
        trainee: 0
      }
    };

    users.forEach(user => {
      if (user.USR_UserRole === 'admin') {
        stats.byRole.admin++;
      } else if (user.USR_UserRole === 'trainer') {
        stats.byRole.trainer++;
      } else if (user.USR_UserRole === 'trainee') {
        stats.byRole.trainee++;
      }
    });

    return stats;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const apiError = error.error as ApiErrorResponse;
      if (apiError && apiError.message) {
        errorMessage = apiError.message;
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
    
    console.error('UserService error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
