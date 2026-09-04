import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Fault } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-artisan-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="artisan-container">
      <div class="glass-panel main-card">
        <div class="header">
          <h2>🛠️ Field Duty & Task Clearance Workspace</h2>
          <span class="user-badge" *ngIf="authService.currentUser()">
            Field Technician: <strong>{{ authService.currentUser()?.firstname }} {{ authService.currentUser()?.surname }}</strong>
          </span>
        </div>

        <div *ngIf="myAssignedFaults().length === 0" class="empty-state glass-card">
          <span>✅ No active fault dispatches assigned to your queue at this moment.</span>
        </div>

        <div class="fault-grid">
          <div *ngFor="let fault of myAssignedFaults()" class="glass-card task-card">
            <div class="task-header">
              <span class="fid">Fault #{{ fault.fid }}</span>
              <span class="glass-badge" [ngClass]="{
                'badge-critical': fault.severity === 'Critical',
                'badge-major': fault.severity === 'Major',
                'badge-minor': fault.severity === 'Minor'
              }">{{ fault.severity }}</span>
            </div>

            <h3 class="asset-title">{{ fault.fname }}</h3>
            <p class="asset-type">{{ fault.type }}</p>
            <p class="desc">{{ fault.description || 'No detailed issue description provided.' }}</p>

            <div class="form-section">
              <label>Update Field Notes / Repair Log</label>
              <textarea [(ngModel)]="fault.description" class="glass-input text-area" rows="2" placeholder="Document site findings, replaced fuses/transformers..."></textarea>
            </div>

            <div class="action-row">
              <div class="status-select">
                <label>Status</label>
                <select [(ngModel)]="fault.rectification" class="glass-input select-input">
                  <option value="Pending">Pending</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button (click)="updateStatus(fault)" class="glass-button update-btn">Update Progress</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .artisan-container {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .main-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 1rem;
    }

    .header h2 {
      font-size: 1.25rem;
      color: #ffffff;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #6ee7b7;
      font-size: 1.05rem;
    }

    .fault-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.25rem;
    }

    .task-card {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .fid {
      font-weight: 700;
      color: #93c5fd;
      font-size: 0.85rem;
    }

    .asset-title {
      font-size: 1.1rem;
      color: #ffffff;
    }

    .asset-type {
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }

    .desc {
      font-size: 0.85rem;
      color: #cbd5e1;
      line-height: 1.4;
    }

    .form-section label, .status-select label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-muted);
      margin-bottom: 0.25rem;
      display: block;
    }

    .text-area {
      resize: vertical;
      font-family: inherit;
    }

    .action-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      margin-top: 0.5rem;
    }

    .status-select {
      flex: 1;
    }

    .select-input option {
      background: #0f172a;
      color: #ffffff;
    }

    .update-btn {
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
    }
  `]
})
export class ArtisanViewComponent implements OnInit {
  private apiService = inject(ApiService);
  public authService = inject(AuthService);

  public myAssignedFaults = signal<Fault[]>([]);

  async ngOnInit() {
    await this.loadMyFaults();
  }

  async loadMyFaults() {
    const all = await this.apiService.faultsListResource.value();
    if (all) {
      const user = this.authService.currentUser();
      const fullName = user ? `${user.firstname} ${user.surname}` : '';

      const filtered = all.filter((f) =>
        !fullName || f.artisan?.toLowerCase().includes(user?.surname.toLowerCase() || '') || f.artisan === 'Unassigned'
      );
      this.myAssignedFaults.set(filtered.length ? filtered : all);
    }
  }

  async updateStatus(fault: Fault) {
    const res = await this.apiService.updateFaultStatus(fault.fid, {
      rectification: fault.rectification,
      description: fault.description
    });
    if (res.success) {
      alert(`Fault #${fault.fid} field log updated.`);
      await this.loadMyFaults();
    } else {
      alert(`Error updating fault: ${res.message}`);
    }
  }
}
