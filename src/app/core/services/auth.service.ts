import { Injectable, signal, computed, inject } from '@angular/core';
import { User, UserRole } from '../models/user';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private userState = signal<User | null>(this.loadFromStorage());

  currentUser = computed(() => this.userState());
  isAuthenticated = computed(() => !!this.userState());
  isAdmin = computed(() => this.userState()?.Role === 'admin');
  userPlan = computed(() => this.userState()?.Plan || 'FREE');

  constructor() {
    if (this.getToken()) {
      this.obtenerUsuarioAutenticado().subscribe({
        error: (err) => console.error('Error sincronizando estado al refrescar:', err)
      });
    }
  }

  register(data: any) {
    return this.http.post<any>('/api/register', data).pipe(
      tap(res => {
        this.setSession(res.access_token, res.data, 'user');
      })
    );
  }

  login(credentials: any) {
    return this.http.post<any>('/api/login', credentials).pipe(
      tap(res => {
        this.setSession(res.access_token, res.data || {}, res.role);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('tm_token');
  }

  setSession(token: string | null, userData: any, role: string) {
    if (token) {
      localStorage.setItem('tm_token', token);
    }

    const userToSave: User = {
      Id: userData.id,
      Name: userData.name,
      Nickname: userData.nickname || '',
      Email: userData.email,
      Role: role as UserRole,
      Plan: userData.plan ? userData.plan.toUpperCase() : 'FREE'
    };

    localStorage.setItem('tm_user', JSON.stringify(userToSave));
    this.userState.set(userToSave);
  }

  logout() {
    this.http.post<any>('/api/logout', {}).subscribe({
      next: (res) => {
      },
      error: (err) => {
        console.error('Error al destruir sesión en el servidor:', err);
      },
      complete: () => {
        localStorage.removeItem('tm_token');
        localStorage.removeItem('tm_user');

        this.userState.set(null);
        this.router.navigate(['/home']);
      }
    });
  }

  private loadFromStorage(): User | null {
    const data = localStorage.getItem('tm_user');
    return data ? JSON.parse(data) : null;
  }

  obtenerUsuarioAutenticado(): Observable<any> {
    return this.http.get<{ data: any; role: string }>('/api/me').pipe(
      tap(res => {
        this.setSession(null, res.data, res.role);
      })
    );
  }

  updateProfile(profileData: { name: string; email: string; nickname: string; password?: string }) {
    return this.http.post<any>('/api/user/update', profileData).pipe(
      tap(res => {
        const current = this.userState();
        if (current && res && res.user) {
          const updatedUser = {
            ...current,
            Name: res.user.name,
            Email: res.user.email,
            Nickname: res.user.nickname
          };

          localStorage.setItem('tm_user', JSON.stringify(updatedUser));
          this.userState.set(updatedUser);

          console.log("¡Signal userState actualizado en vivo con:", updatedUser);
        }
      })
    );
  }

  registerAdmin(adminData: any): Observable<any> {
    return this.http.post<any>('/api/admin/register', adminData);
  }
}