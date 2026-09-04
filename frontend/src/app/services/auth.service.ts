import { Injectable, signal, computed } from '@angular/core';

export interface User {
  empid: number;
  email: string;
  rank: 'Foreman' | 'Artisan' | 'Artisan Assistant' | 'Admin' | string;
  firstname: string;
  surname: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'fault_gis_token';
  private readonly USER_KEY = 'fault_gis_user';

  // Signals for reactive state management
  public currentUser = signal<User | null>(this.getStoredUser());
  public token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  public isAuthenticated = computed(() => !!this.token() && !!this.currentUser());
  public userRank = computed(() => this.currentUser()?.rank || 'Guest');

  public setSession(token: string, user: User) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.token.set(token);
    this.currentUser.set(user);
  }

  public logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
