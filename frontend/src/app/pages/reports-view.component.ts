import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, StatsSummary, Fault } from '../services/api.service';

@Component({
  selector: 'app-reports-view',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="reports-container">
      <!-- Analytics Header -->
      <div class="header-banner glass-panel">
        <div>
          <h2>📈 Grid Reliability & Outage Analytics</h2>
          <p class="subtitle">Real-time telemetric assessment across network sectors</p>
        </div>
        <button (click)="loadAnalytics()" class="glass-button">🔄 Refresh Data</button>
      </div>

      <!-- Key Performance Metrics Grid -->
      <div class="metrics-grid">
        <div class="glass-card metric-card">
          <div class="metric-icon alert-icon">⚠️</div>
          <div class="metric-data">
            <span class="metric-val text-red">{{ stats()?.activeOutages || 0 }}</span>
            <span class="metric-label">Active Power Outages</span>
          </div>
        </div>

        <div class="glass-card metric-card">
          <div class="metric-icon comm-icon">🏬</div>
          <div class="metric-data">
            <span class="metric-val text-yellow">{{ stats()?.commercialAffected || 0 }}</span>
            <span class="metric-label">Commercial Clients Affected</span>
          </div>
        </div>

        <div class="glass-card metric-card">
          <div class="metric-icon ind-icon">🏭</div>
          <div class="metric-data">
            <span class="metric-val text-purple">{{ stats()?.industrialAffected || 0 }}</span>
            <span class="metric-label">Industrial Sector Meters</span>
          </div>
        </div>

        <div class="glass-card metric-card">
          <div class="metric-icon dom-icon">🏠</div>
          <div class="metric-data">
            <span class="metric-val text-blue">{{ stats()?.residentialAffected || 0 }}</span>
            <span class="metric-label">Domestic Households</span>
          </div>
        </div>
      </div>

      <!-- Comprehensive Outage Audit Log -->
      <div class="glass-panel main-panel">
        <h3>📋 System Outage Audit Log & Rectification History</h3>
        <div class="table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>FID</th>
                <th>Asset Name</th>
                <th>Fault Classification</th>
                <th>Severity</th>
                <th>Artisan Assigned</th>
                <th>Current Rectification</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let fault of faults()">
                <td>#{{ fault.fid }}</td>
                <td><strong>{{ fault.fname }}</strong></td>
                <td>{{ fault.type }}</td>
                <td>
                  <span class="glass-badge" [ngClass]="{
                    'badge-critical': fault.severity === 'Critical',
                    'badge-major': fault.severity === 'Major',
                    'badge-minor': fault.severity === 'Minor'
                  }">{{ fault.severity }}</span>
                </td>
                <td>👤 {{ fault.artisan || 'Unassigned' }}</td>
                <td>
                  <span class="status-tag" [ngClass]="fault.rectification.toLowerCase().replace(' ', '-')">
                    {{ fault.rectification }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 1.5rem;
      max-width: 1300px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .header-banner {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-banner h2 {
      font-size: 1.35rem;
      color: #ffffff;
    }

    .subtitle {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      margin-top: 0.2rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }

    .metric-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem;
    }

    .metric-icon {
      font-size: 2rem;
      width: 54px;
      height: 54px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .metric-data {
      display: flex;
      flex-direction: column;
    }

    .metric-val {
      font-size: 1.6rem;
      font-weight: 800;
      line-height: 1.1;
    }

    .metric-label {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin-top: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .text-red { color: #f87171; }
    .text-yellow { color: #fde047; }
    .text-purple { color: #c084fc; }
    .text-blue { color: #60a5fa; }

    .main-panel {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .main-panel h3 {
      font-size: 1.1rem;
      color: #ffffff;
    }

    .table-container {
      overflow-x: auto;
    }

    .glass-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }

    .glass-table th, .glass-table td {
      padding: 0.85rem;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .glass-table th {
      color: var(--color-text-muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    .status-tag {
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .status-tag.pending {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }

    .status-tag.in-progress {
      background: rgba(245, 158, 11, 0.2);
      color: #fde047;
    }

    .status-tag.completed {
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }
  `]
})
export class ReportsViewComponent implements OnInit {
  private apiService = inject(ApiService);

  public stats = signal<StatsSummary | null>(null);
  public faults = signal<Fault[]>([]);

  async ngOnInit() {
    await this.loadAnalytics();
  }

  async loadAnalytics() {
    const statsData = await this.apiService.statsResource.value();
    if (statsData) this.stats.set(statsData);

    const faultList = await this.apiService.faultsListResource.value();
    if (faultList) this.faults.set(faultList);
  }
}
