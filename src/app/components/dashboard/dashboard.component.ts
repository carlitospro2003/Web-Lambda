import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User, DashboardUser, UserStats } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  users: DashboardUser[] = [];
  filteredUsers: DashboardUser[] = [];
  isLoading = false;
  isSidebarCollapsed = false;
  
  // Filtros y búsqueda
  searchTerm = '';
  selectedRole = '';
  
  // Modal para editar/crear usuario
  showUserModal = false;
  editingUser: DashboardUser | null = null;
  userForm: Partial<DashboardUser> & { 
    firstName?: string; 
    lastName?: string; 
    password?: string;
  } = {};

  // Estadísticas
  userStats: UserStats = {
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {
      admin: 0,
      trainer: 0,
      trainee: 0
    }
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(authState => {
        this.currentUser = authState.user;
      });

    this.loadUsers();
    this.loadUserStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.isLoading = false;
        }
      });
  }

  loadUserStats(): void {
    this.userService.getUserStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.userStats = stats;
      });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  openCreateUserModal(): void {
    this.editingUser = null;
    this.userForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      role: 'trainee',
      isActive: true
    };
    this.showUserModal = true;
  }

  openEditUserModal(user: DashboardUser): void {
    this.editingUser = user;
    
    // Separar el nombre completo en nombre y apellido
    const nameParts = user.name.split(' ');
    
    this.userForm = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: '' // No pre-llenar la contraseña
    };
    
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.editingUser = null;
    this.userForm = {};
  }

  saveUser(): void {
    if (this.editingUser) {
      // Actualizar usuario existente
      const updateData: any = {
        name: `${this.userForm.firstName} ${this.userForm.lastName}`,
        email: this.userForm.email,
        phone: this.userForm.phone,
        role: this.userForm.role
      };

      // Solo incluir la contraseña si se proporcionó una nueva
      if (this.userForm.password && this.userForm.password.trim() !== '') {
        updateData.password = this.userForm.password;
      }

      console.log('Updating user with data:', updateData);

      this.userService.updateUser(this.editingUser.id!, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedUser) => {
            console.log('User updated:', updatedUser);
            this.loadUsers();
            this.loadUserStats();
            this.closeUserModal();
          },
          error: (error) => {
            console.error('Error updating user:', error);
            alert(`Error al actualizar usuario: ${error.message}`);
          }
        });
    } else {
      // Crear nuevo usuario - preparar datos para la API
      const newUserData: Omit<DashboardUser, 'id' | 'createdAt' | 'updatedAt'> = {
        name: `${this.userForm.firstName} ${this.userForm.lastName}`,
        email: this.userForm.email!,
        phone: this.userForm.phone!,
        role: this.userForm.role as 'admin' | 'trainer' | 'trainee',
        isActive: true
      };

      // Agregar la contraseña al objeto para que el servicio la use
      const userDataWithPassword = {
        ...newUserData,
        password: this.userForm.password
      };

      this.userService.createUser(userDataWithPassword as any)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUsers();
            this.loadUserStats();
            this.closeUserModal();
          },
          error: (error) => {
            console.error('Error creating user:', error);
            alert(`Error al crear usuario: ${error.message}`);
          }
        });
    }
  }

  deleteUser(user: DashboardUser): void {
    if (confirm(`¿Estás seguro de que quieres eliminar permanentemente a ${user.name}? Esta acción no se puede deshacer.`)) {
      this.userService.deleteUser(user.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert(`Usuario ${user.name} eliminado correctamente`);
            this.loadUsers();
            this.loadUserStats();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            alert(`Error al eliminar usuario: ${error.message}`);
          }
        });
    }
  }

  toggleUserStatus(user: DashboardUser): void {
    this.userService.toggleUserStatus(user.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadUsers();
          this.loadUserStats();
        },
        error: (error) => console.error('Error toggling user status:', error)
      });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'trainer': return 'bg-warning';
      case 'trainee': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  getFormValidation(): boolean {
    // Validación para crear nuevo usuario
    if (!this.editingUser) {
      return !this.userForm.firstName || 
             !this.userForm.lastName || 
             !this.userForm.email || 
             !this.userForm.phone || 
             !this.userForm.password || 
             this.userForm.password.length < 8;
    }
    
    // Validación para editar usuario (contraseña opcional)
    const hasValidPassword = !this.userForm.password || this.userForm.password.length >= 8;
    return !this.userForm.firstName || 
           !this.userForm.lastName || 
           !this.userForm.email || 
           !this.userForm.phone ||
           !hasValidPassword;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Incluso si hay error, redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }
}