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
  userPlan = computed(() => this.userState()?.Plan || 'free');

  register(data: any) {
    return this.http.post<any>('/api/register', data).pipe(
      tap(res => {
        this.setSession(res.access_token, res.user, 'user');
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

  setSession(token: string, userData: any, role: string) {
    localStorage.setItem('tm_token', token);
    const userToSave = { ...userData, Role: role, Plan: userData.plan || 'free' };
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
    return this.http.get<{ data: any; role: string; type: string }>('/api/me').pipe(
      tap(res => {
        const userToSave = {
          Id: res.data.id,
          Name: res.data.name,
          Nickname: res.data.nickname,
          Email: res.data.email,
          Role: res.role as UserRole,
          Plan: res.data.plan || 'free'
        };
        localStorage.setItem('tm_user', JSON.stringify(userToSave));
        this.userState.set(userToSave);
      })
    );
  }

  updateProfile(profileData: { name: string; email: string; password?: string }) {
    return this.http.put<any>('/api/user/profile', profileData).pipe(
      tap(res => {
        const current = this.userState();
        if (current) {
          const updatedUser = { ...current, name: res.user.name, email: res.user.name };
          localStorage.setItem('tm_user', JSON.stringify(updatedUser));
          this.userState.set(updatedUser);
        }
      })
    );
  }
}
