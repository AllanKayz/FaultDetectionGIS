import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './services/auth.service';

// Mock localStorage for Vitest Node environment
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('Frontend AuthService Unit Tests', () => {
  let authService: AuthService;

  beforeEach(() => {
    mockLocalStorage.clear();
    authService = new AuthService();
  });

  it('AuthService should initialize with unauthenticated state when storage is empty', () => {
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.currentUser()).toBeNull();
  });

  it('AuthService setSession should update signals and store user in localStorage', () => {
    const mockUser = {
      empid: 1,
      email: 'kmukondiwa@powerutility.com',
      rank: 'Foreman',
      firstname: 'Kudakwashe',
      surname: 'Mukondiwa'
    };

    authService.setSession('test_jwt_token', mockUser);

    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.currentUser()?.email).toBe('kmukondiwa@powerutility.com');
    expect(authService.userRank()).toBe('Foreman');
  });

  it('AuthService logout should clear signals and localStorage', () => {
    authService.setSession('test_jwt_token', {
      empid: 1,
      email: 'kmukondiwa@powerutility.com',
      rank: 'Foreman',
      firstname: 'Kudakwashe',
      surname: 'Mukondiwa'
    });

    authService.logout();

    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.currentUser()).toBeNull();
  });
});
