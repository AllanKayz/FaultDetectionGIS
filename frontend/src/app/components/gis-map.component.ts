import { Component, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { ApiService, Fault } from '../services/api.service';

@Component({
  selector: 'app-gis-map',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map-container">
      <div #mapElement class="map-view"></div>

      <!-- Floating Glass Overlay Panel -->
      <div class="glass-overlay glass-panel">
        <div class="overlay-header">
          <h3>⚡ Grid Active Faults</h3>
          <span class="count-badge">{{ faults().length }} Active</span>
        </div>

        <div class="fault-list">
          <div *ngFor="let fault of faults()" (click)="zoomToFault(fault)" class="glass-card fault-card">
            <div class="fault-top">
              <span class="fault-title">{{ fault.fname }}</span>
              <span class="glass-badge" [ngClass]="{
                'badge-critical': fault.severity === 'Critical',
                'badge-major': fault.severity === 'Major',
                'badge-minor': fault.severity === 'Minor'
              }">{{ fault.severity }}</span>
            </div>
            <p class="fault-desc">{{ fault.description || fault.type }}</p>
            <div class="fault-meta">
              <span>👤 {{ fault.artisan || 'Unassigned' }}</span>
              <span class="status-tag" [ngClass]="fault.rectification.toLowerCase().replace(' ', '-')">{{ fault.rectification }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      position: relative;
      width: 100%;
      height: calc(100vh - 120px);
      border-radius: 16px;
      overflow: hidden;
    }

    .map-view {
      width: 100%;
      height: 100%;
    }

    .glass-overlay {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 360px;
      max-height: calc(100% - 40px);
      z-index: 1000;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .overlay-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .overlay-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .count-badge {
      background: rgba(59, 130, 246, 0.3);
      color: #93c5fd;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      border: 1px solid rgba(59, 130, 246, 0.4);
    }

    .fault-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow-y: auto;
      padding-right: 0.25rem;
    }

    .fault-card {
      cursor: pointer;
      padding: 0.85rem;
    }

    .fault-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }

    .fault-title {
      font-weight: 600;
      font-size: 0.9rem;
      color: #ffffff;
    }

    .fault-desc {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      margin-bottom: 0.5rem;
    }

    .fault-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: #cbd5e1;
    }

    .status-tag {
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-weight: 600;
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
export class GisMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapElement') mapElement!: ElementRef<HTMLDivElement>;

  private apiService = inject(ApiService);
  private map?: L.Map;
  private markersGroup = L.layerGroup();

  public faults = signal<Fault[]>([]);

  async ngAfterViewInit() {
    this.initMap();
    await this.loadMapFeatures();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    // Harare Coordinates default
    this.map = L.map(this.mapElement.nativeElement, {
      center: [-17.825, 31.053],
      zoom: 13
    });

    // Dark Map Tile Layer for Glassmorphism contrast
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    this.markersGroup.addTo(this.map);
  }

  private async loadMapFeatures() {
    try {
      const geoJson = await this.apiService.faultsGeoJsonResource.value();
      const rawList = await this.apiService.faultsListResource.value();
      if (rawList) {
        this.faults.set(rawList);
      }

      if (geoJson && geoJson.features) {
        this.markersGroup.clearLayers();

        geoJson.features.forEach((feature: any) => {
          if (feature.geometry && feature.geometry.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            const props = feature.properties || {};

            const marker = L.circleMarker([lat, lng], {
              radius: 9,
              fillColor: props.severity === 'Critical' ? '#ef4444' : props.severity === 'Major' ? '#f59e0b' : '#3b82f6',
              color: '#ffffff',
              weight: 2,
              opacity: 0.9,
              fillOpacity: 0.85
            });

            const popupContent = `
              <div style="color: #0f172a; font-family: sans-serif; padding: 4px;">
                <strong style="font-size: 14px;">${props.fname || 'Fault'}</strong><br/>
                <span style="font-size: 12px; color: #475569;">Type: ${props.type || 'N/A'}</span><br/>
                <span style="font-size: 12px; color: #475569;">Severity: ${props.severity}</span><br/>
                <span style="font-size: 12px; color: #475569;">Status: ${props.rectification}</span>
              </div>
            `;

            marker.bindPopup(popupContent);
            this.markersGroup.addLayer(marker);
          }
        });
      }
    } catch (err) {
      console.error('Failed to load map features:', err);
    }
  }

  public zoomToFault(fault: Fault) {
    if (fault.coordinates && this.map) {
      this.map.setView([fault.coordinates[1], fault.coordinates[0]], 15, { animate: true });
    }
  }
}
