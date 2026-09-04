import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-simulator-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="simulator-wrapper">
      <div class="glass-panel sim-card">
        <div class="sim-header">
          <h2>🧪 GIS Fault Injection & AI Simulator</h2>
          <p class="subtitle">Simulate telemetric grid line trips, transformer oil surges, & sensor alerts</p>
        </div>

        <div *ngIf="successMsg()" class="alert-success">
          ✅ {{ successMsg() }}
        </div>

        <div *ngIf="errorMsg()" class="alert-error">
          ⚠️ {{ errorMsg() }}
        </div>

        <form (ngSubmit)="onSimulateFault()" class="sim-form">
          <div class="form-row">
            <div class="form-group">
              <label>Fault Classification / Event</label>
              <select [(ngModel)]="faultData.type" name="type" class="glass-input select-input">
                <option value="Transformer Breakdown">Transformer Breakdown</option>
                <option value="Overhead Line Snap">Overhead Line Snap</option>
                <option value="Feeder Cable Short Circuit">Feeder Cable Short Circuit</option>
                <option value="Meter Tampering Alert">Meter Tampering Alert</option>
                <option value="Substation Over-Voltage Trip">Substation Over-Voltage Trip</option>
              </select>
            </div>

            <div class="form-group">
              <label>Substation / Asset Name</label>
              <input type="text" [(ngModel)]="faultData.fname" name="fname" required class="glass-input" placeholder="e.g. Substation Beta Transformer 2" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Severity Index</label>
              <select [(ngModel)]="faultData.severity" name="severity" class="glass-input select-input">
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div class="form-group">
              <label>Priority Dispatch Level</label>
              <select [(ngModel)]="faultData.priority_level" name="priority_level" class="glass-input select-input">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>GIS Coordinates (Longitude, Latitude)</label>
            <input type="text" [(ngModel)]="faultData.coordinatesStr" name="coordinatesStr" required class="glass-input" placeholder="e.g. 31.053, -17.825" />
            <span class="hint">Format: Longitude, Latitude (WGS84 EPSG:4326)</span>
          </div>

          <div class="form-group">
            <label>Telemetry Event Description / Sensor Log</label>
            <textarea [(ngModel)]="faultData.description" name="description" rows="3" class="glass-input text-area" placeholder="e.g. Auto-recloser tripped due to transient ground fault..."></textarea>
          </div>

          <button type="submit" [disabled]="loading()" class="glass-button w-full sim-btn">
            {{ loading() ? 'Injecting Telemetry Event...' : '🚀 Trigger Simulated Fault' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .simulator-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem 1.5rem;
    }

    .sim-card {
      width: 100%;
      max-width: 650px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .sim-header h2 {
      font-size: 1.35rem;
      color: #ffffff;
    }

    .subtitle {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      margin-top: 0.2rem;
    }

    .sim-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #cbd5e1;
    }

    .hint {
      font-size: 0.7rem;
      color: var(--color-text-muted);
    }

    .select-input option {
      background: #0f172a;
      color: #ffffff;
    }

    .text-area {
      resize: vertical;
      font-family: inherit;
    }

    .w-full { width: 100%; }

    .sim-btn {
      padding: 0.85rem;
      font-size: 0.95rem;
      background: rgba(139, 92, 246, 0.3);
      border-color: rgba(139, 92, 246, 0.5);
    }

    .sim-btn:hover {
      background: rgba(139, 92, 246, 0.6);
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
    }

    .alert-success {
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.5);
      color: #6ee7b7;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.5);
      color: #fca5a5;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
    }
  `]
})
export class SimulatorViewComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  public loading = signal(false);
  public successMsg = signal<string | null>(null);
  public errorMsg = signal<string | null>(null);

  public faultData = {
    type: 'Transformer Breakdown',
    fname: 'Substation Gamma T-20',
    severity: 'Major',
    priority_level: 'High',
    coordinatesStr: '31.058, -17.822',
    description: 'High thermal sensor trigger on secondary winding.'
  };

  async onSimulateFault() {
    this.loading.set(true);
    this.successMsg.set(null);
    this.errorMsg.set(null);

    try {
      const parts = this.faultData.coordinatesStr.split(',').map((p) => parseFloat(p.trim()));
      const payload = {
        type: this.faultData.type,
        fname: this.faultData.fname,
        severity: this.faultData.severity,
        priority_level: this.faultData.priority_level,
        description: this.faultData.description,
        coordinates: [parts[0] || 31.053, parts[1] || -17.825]
      };

      const res = await this.apiService.createFault(payload);
      if (res.success) {
        this.successMsg.set('Simulated fault successfully injected into GIS network!');
        setTimeout(() => this.router.navigate(['/map']), 1200);
      } else {
        this.errorMsg.set(res.message || 'Failed to simulate fault event');
      }
    } catch (err: any) {
      this.errorMsg.set(err.message || 'Network error injecting telemetry');
    } finally {
      this.loading.set(false);
    }
  }
}
