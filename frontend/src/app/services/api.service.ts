import { Injectable, signal, resource } from '@angular/core';
import { AuthService } from './auth.service';

export interface Fault {
  fid: number;
  type: string;
  fname: string;
  severity: 'Critical' | 'Major' | 'Minor' | 'Low';
  priority_level: 'High' | 'Medium' | 'Low';
  artisan: string;
  description: string;
  rectification: 'Pending' | 'In progress' | 'Completed';
  et_occurrence?: string;
  coordinates?: [number, number];
}

export interface StatsSummary {
  activeOutages: number;
  commercialAffected: number;
  industrialAffected: number;
  residentialAffected: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private authService: AuthService) {}

  private get headers() {
    const token = this.authService.token();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  // Signal resource for fetching faults GeoJSON
  public faultsGeoJsonResource = resource({
    loader: async () => {
      const res = await fetch(`${this.baseUrl}/faults/geojson`);
      return res.json();
    }
  });

  // Signal resource for fetching fault list
  public faultsListResource = resource({
    loader: async () => {
      const res = await fetch(`${this.baseUrl}/faults`);
      const json = await res.json();
      return (json.data || []) as Fault[];
    }
  });

  // Signal resource for stats summary
  public statsResource = resource({
    loader: async () => {
      const res = await fetch(`${this.baseUrl}/stats/summary`);
      const json = await res.json();
      return (json.data || {}) as StatsSummary;
    }
  });

  public async login(data: any) {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  public async register(data: any) {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  public async createFault(faultData: any) {
    const res = await fetch(`${this.baseUrl}/faults`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(faultData)
    });
    return res.json();
  }

  public async updateFaultStatus(fid: number, statusData: any) {
    const res = await fetch(`${this.baseUrl}/faults/${fid}/status`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(statusData)
    });
    return res.json();
  }

  public async getEquipment() {
    const res = await fetch(`${this.baseUrl}/gis/equipment`);
    return res.json();
  }

  public async getCrew() {
    const res = await fetch(`${this.baseUrl}/gis/crew`);
    return res.json();
  }
}
