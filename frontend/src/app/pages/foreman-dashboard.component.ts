import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Fault } from '../services/api.service';

@Component({
  selector: 'app-foreman-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-grid">
      <!-- Active Faults Dispatch Center -->
      <div class="glass-panel main-panel">
        <div class="panel-header">
          <h2>⚡ Foreman Dispatch & Fault Management</h2>
          <button (click)="refresh()" class="glass-button text-sm">🔄 Refresh</button>
        </div>

        <div class="table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>FID</th>
                <th>Location / Asset</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Assigned Artisan</th>
                <th>Status</th>
                <th>Actions</th>
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
                <td>
                  <input type="text" [(ngModel)]="fault.artisan" class="glass-input compact-input" placeholder="Assign Artisan..." />
                </td>
                <td>
                  <select [(ngModel)]="fault.rectification" class="glass-input compact-input select-input">
                    <option value="Pending">Pending</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <button (click)="saveFaultChanges(fault)" class="glass-button compact-btn">Save</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sidebar: Active Crew Roster & Equipment -->
      <div class="sidebar-column">
        <!-- Crew Roster -->
        <div class="glass-panel side-panel">
          <h3>👥 Available Crew Roster</h3>
          <div class="crew-list">
            <div *ngFor="let member of crew()" class="glass-card compact-card">
              <div class="crew-info">
                <span class="crew-name">{{ member.firstname }} {{ member.surname }}</span>
                <span class="rank-pill">{{ member.rank }}</span>
              </div>
              <span class="skillset">{{ member.skillset }}</span>
            </div>
          </div>
        </div>

        <!-- Equipment Inventory -->
        <div class="glass-panel side-panel">
          <h3>🧰 Field Equipment Health</h3>
          <div class="equip-list">
            <div *ngFor="let item of equipment()" class="glass-card compact-card">
              <div class="equip-info">
                <span class="equip-name">{{ item.name }}</span>
                <span class="equip-type">{{ item.type }}</span>
              </div>
              <span class="glass-badge" [ngClass]="{
                'badge-success': item.condition === 'Good' || item.condition === 'Calibrated',
                'badge-major': item.condition === 'Service Required'
              }">{{ item.condition }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .main-panel, .side-panel {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .sidebar-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-header h2 {
      font-size: 1.25rem;
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

    .compact-input {
      padding: 0.4rem 0.6rem;
      font-size: 0.8rem;
    }

    .compact-btn {
      padding: 0.4rem 0.75rem;
      font-size: 0.75rem;
    }

    .select-input option {
      background: #0f172a;
      color: #ffffff;
    }

    .crew-list, .equip-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .compact-card {
      padding: 0.75rem;
    }

    .crew-info, .equip-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    .crew-name, .equip-name {
      font-weight: 600;
      font-size: 0.85rem;
      color: #ffffff;
    }

    .skillset, .equip-type {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .rank-pill {
      font-size: 0.65rem;
      color: #93c5fd;
      background: rgba(59, 130, 246, 0.2);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ForemanDashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  public faults = signal<Fault[]>([]);
  public crew = signal<any[]>([]);
  public equipment = signal<any[]>([]);

  async ngOnInit() {
    await this.refresh();
  }

  async refresh() {
    const faultData = await this.apiService.faultsListResource.value();
    if (faultData) this.faults.set([...faultData]);

    const crewRes = await this.apiService.getCrew();
    if (crewRes.success) this.crew.set(crewRes.data || []);

    const equipRes = await this.apiService.getEquipment();
    if (equipRes.success) this.equipment.set(equipRes.data || []);
  }

  async saveFaultChanges(fault: Fault) {
    const res = await this.apiService.updateFaultStatus(fault.fid, {
      rectification: fault.rectification,
      artisan: fault.artisan,
      description: fault.description
    });
    if (res.success) {
      alert(`Fault #${fault.fid} updated successfully.`);
    } else {
      alert(`Error updating fault: ${res.message}`);
    }
  }
}
