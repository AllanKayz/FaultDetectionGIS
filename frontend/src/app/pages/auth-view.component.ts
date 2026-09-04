import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-wrapper">
      <div class="glass-panel auth-card">
        <div class="auth-tabs">
          <button (click)="isLogin.set(true)" [class.active]="isLogin()">Sign In</button>
          <button (click)="isLogin.set(false)" [class.active]="!isLogin()">Employee Registration</button>
        </div>

        <div *ngIf="errorMessage()" class="alert-error">
          ⚠️ {{ errorMessage() }}
        </div>

        <!-- Login Form -->
        <form *ngIf="isLogin()" (ngSubmit)="onLogin()" class="auth-form">
          <h2>Authentication Portal</h2>
          <p class="subtitle">Enter your utility network credentials</p>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="loginData.email" name="email" required class="glass-input" placeholder="e.g. kmukondiwa@powerutility.com" />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="loginData.password" name="password" required class="glass-input" placeholder="••••••••" />
          </div>

          <button type="submit" [disabled]="loading()" class="glass-button w-full">
            {{ loading() ? 'Authenticating...' : 'Sign In to Portal' }}
          </button>
        </form>

        <!-- Registration Form -->
        <form *ngIf="!isLogin()" (ngSubmit)="onRegister()" class="auth-form">
          <h2>Register Utility Staff</h2>
          <p class="subtitle">Onboard new artisan or foreman personnel</p>

          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" [(ngModel)]="registerData.firstname" name="firstname" required class="glass-input" placeholder="First Name" />
            </div>
            <div class="form-group">
              <label>Surname</label>
              <input type="text" [(ngModel)]="registerData.surname" name="surname" required class="glass-input" placeholder="Surname" />
            </div>
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="registerData.email" name="regEmail" required class="glass-input" placeholder="email@powerutility.com" />
          </div>

          <div class="form-group">
            <label>Role / Rank</label>
            <select [(ngModel)]="registerData.rank" name="rank" class="glass-input select-input">
              <option value="Foreman">Foreman</option>
              <option value="Artisan">Artisan</option>
              <option value="Artisan Assistant">Artisan Assistant</option>
              <option value="Admin">System Admin</option>
            </select>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="registerData.password" name="regPassword" required class="glass-input" placeholder="••••••••" />
          </div>

          <button type="submit" [disabled]="loading()" class="glass-button w-full">
            {{ loading() ? 'Registering...' : 'Register Employee' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 140px);
      padding: 1.5rem;
    }

    .auth-card {
      width: 100%;
      max-width: 460px;
      padding: 2rem;
    }

    .auth-tabs {
      display: flex;
      gap: 0.5rem;
      background: rgba(0, 0, 0, 0.2);
      padding: 0.35rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
    }

    .auth-tabs button {
      flex: 1;
      padding: 0.6rem;
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .auth-tabs button.active {
      background: rgba(59, 130, 246, 0.3);
      color: #ffffff;
      border: 1px solid rgba(59, 130, 246, 0.4);
    }

    .auth-form h2 {
      font-size: 1.35rem;
      color: #ffffff;
      margin-bottom: 0.25rem;
    }

    .subtitle {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }

    .form-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #cbd5e1;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .select-input option {
      background: #0f172a;
      color: #ffffff;
    }

    .w-full {
      width: 100%;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.5);
      color: #fca5a5;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }
  `]
})
export class AuthViewComponent {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLogin = signal(true);
  public loading = signal(false);
  public errorMessage = signal<string | null>(null);

  public loginData = {
    email: '',
    password: ''
  };

  public registerData = {
    firstname: '',
    surname: '',
    email: '',
    password: '',
    rank: 'Artisan'
  };

  async onLogin() {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.apiService.login(this.loginData);
      if (res.success) {
        this.authService.setSession(res.token, res.user);
        this.router.navigate(['/map']);
      } else {
        this.errorMessage.set(res.message || 'Login failed');
      }
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Server error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  async onRegister() {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.apiService.register(this.registerData);
      if (res.success) {
        this.isLogin.set(true);
        this.loginData.email = this.registerData.email;
        this.errorMessage.set(null);
      } else {
        this.errorMessage.set(res.message || 'Registration failed');
      }
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Server error occurred');
    } finally {
      this.loading.set(false);
    }
  }
}
