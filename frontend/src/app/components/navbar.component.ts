import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="navbar-header glass-panel">
      <div class="brand">
        <span class="icon">⚡</span>
        <div class="brand-text">
          <span class="title">FaultGIS AI</span>
          <span class="subtitle">Grid Intelligence & Dispatch</span>
        </div>
      </div>

      <nav class="nav-links">
        <a routerLink="/map" routerLinkActive="active" class="nav-item">🗺️ GIS Map</a>
        <a routerLink="/foreman" routerLinkActive="active" *ngIf="authService.userRank() === 'Foreman' || authService.userRank() === 'Admin'" class="nav-item">📊 Foreman Dispatch</a>
        <a routerLink="/artisan" routerLinkActive="active" *ngIf="authService.userRank() === 'Artisan' || authService.userRank() === 'Artisan Assistant' || authService.userRank() === 'Admin'" class="nav-item">🛠️ Field Duty</a>
        <a routerLink="/reports" routerLinkActive="active" class="nav-item">📈 Analytics & Reports</a>
        <a routerLink="/simulator" routerLinkActive="active" class="nav-item">🧪 Fault Simulator</a>
      </nav>

      <div class="user-actions">
        <ng-container *ngIf="authService.isAuthenticated(); else loginBtn">
          <div class="user-badge">
            <span class="user-name">{{ authService.currentUser()?.firstname }} {{ authService.currentUser()?.surname }}</span>
            <span class="rank-pill">{{ authService.userRank() }}</span>
          </div>
          <button (click)="logout()" class="glass-button glass-button-danger logout-btn">Logout</button>
        </ng-container>
        <ng-template #loginBtn>
          <a routerLink="/login" class="glass-button">Sign In</a>
        </ng-template>
      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      margin: 1rem 1.5rem;
      border-radius: 16px;
      z-index: 1000;
      position: relative;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand .icon {
      font-size: 1.75rem;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-text .title {
      font-weight: 800;
      font-size: 1.2rem;
      letter-spacing: -0.02em;
      background: linear-gradient(90deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-text .subtitle {
      font-size: 0.7rem;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .nav-links {
      display: flex;
      gap: 0.5rem;
    }

    .nav-item {
      padding: 0.5rem 1rem;
      color: var(--color-text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .nav-item:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }

    .nav-item.active {
      color: #ffffff;
      background: rgba(59, 130, 246, 0.25);
      border: 1px solid rgba(59, 130, 246, 0.4);
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.85rem;
    }

    .rank-pill {
      font-size: 0.65rem;
      color: #93c5fd;
      background: rgba(59, 130, 246, 0.2);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .logout-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }
  `]
})
export class NavbarComponent {
  public authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
