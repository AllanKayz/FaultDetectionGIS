import { Pool } from 'pg';

export interface Employee {
  empid: number;
  firstname: string;
  surname: string;
  email: string;
  password?: string;
  rank: 'Foreman' | 'Artisan' | 'Artisan Assistant' | 'Admin' | string;
  address?: string;
  phone?: string;
}

export interface Fault {
  fid: number;
  type: string;
  fname: string;
  severity: string;
  priority_level: string;
  artisan?: string;
  description?: string;
  rectification: 'Pending' | 'In progress' | 'Completed';
  et_occurrence?: string;
  coordinates: [number, number];
}

export interface Equipment {
  id: number;
  type: string;
  name: string;
  condition: string;
}

export interface RegisterEntry {
  id: number;
  empid: number;
  firstname: string;
  surname: string;
  rank: string;
  status: string;
  start_time: string;
}

export interface GISFeature {
  id: number;
  name: string;
  type: string;
  client_type?: string;
  coordinates: [number, number] | [number, number][];
}

class MockDatabase {
  public employees: Employee[] = [
    {
      empid: 1,
      firstname: 'Kudakwashe',
      surname: 'Mukondiwa',
      email: 'kmukondiwa@powerutility.com',
      password: '12345',
      rank: 'Foreman',
      phone: '+263771111111'
    },
    {
      empid: 2,
      firstname: 'Farai',
      surname: 'Zimuto',
      email: 'fzimuto@powerutility.com',
      password: '12345',
      rank: 'Artisan',
      phone: '+263772222222'
    },
    {
      empid: 3,
      firstname: 'Vengai',
      surname: 'Manganda',
      email: 'vmanganda@powerutility.com',
      password: '12345',
      rank: 'Artisan Assistant',
      phone: '+263773333333'
    },
    {
      empid: 4,
      firstname: 'System',
      surname: 'Admin',
      email: 'admin@powerutility.com',
      password: '12345',
      rank: 'Admin',
      phone: '+263774444444'
    }
  ];

  public faults: Fault[] = [
    {
      fid: 101,
      type: 'Transformer Breakdown',
      fname: 'Substation Alpha T1',
      severity: 'Critical',
      priority_level: 'High',
      artisan: 'Farai Zimuto',
      description: 'Oil leak and over-voltage trip detected during heavy storm.',
      rectification: 'In progress',
      et_occurrence: new Date().toISOString(),
      coordinates: [31.053, -17.825]
    },
    {
      fid: 102,
      type: 'Overhead Line Snap',
      fname: 'Feeder 4B Line 12',
      severity: 'Major',
      priority_level: 'Medium',
      artisan: 'Unassigned',
      description: 'Fallen tree branch snapped conductor line.',
      rectification: 'Pending',
      et_occurrence: new Date().toISOString(),
      coordinates: [31.062, -17.831]
    },
    {
      fid: 103,
      type: 'Meter Tampering Alert',
      fname: 'Commercial Zone M-88',
      severity: 'Minor',
      priority_level: 'Low',
      artisan: 'Farai Zimuto',
      description: 'Bypassed current transformer loop.',
      rectification: 'Completed',
      et_occurrence: new Date().toISOString(),
      coordinates: [31.041, -17.818]
    }
  ];

  public equipment: Equipment[] = [
    { id: 1, type: 'Safety Gear', name: 'High Voltage Insulation Gloves (Class 4)', condition: 'Good' },
    { id: 2, type: 'Testing Unit', name: 'Megger Insulation Tester 10kV', condition: 'Calibrated' },
    { id: 3, type: 'Vehicle', name: '4x4 Utility Truck Utility-04', condition: 'Service Required' },
    { id: 4, type: 'Climbing Kit', name: 'Pole Harness & Lanyard Set', condition: 'Good' }
  ];

  public register: RegisterEntry[] = [
    { id: 1, empid: 2, firstname: 'Farai', surname: 'Zimuto', rank: 'Artisan', status: 'On Field Duty', start_time: '08:00 AM' },
    { id: 2, empid: 3, firstname: 'Vengai', surname: 'Manganda', rank: 'Artisan Assistant', status: 'Assigned', start_time: '08:15 AM' }
  ];

  public meters: GISFeature[] = [
    { id: 1, name: 'Meter C-101', type: 'Smart Meter', client_type: 'Commercial', coordinates: [31.051, -17.822] },
    { id: 2, name: 'Meter I-202', type: 'CT Meter', client_type: 'Industrial', coordinates: [31.065, -17.835] },
    { id: 3, name: 'Meter D-303', type: 'Single Phase', client_type: 'Domestic', coordinates: [31.042, -17.815] }
  ];

  public substations: GISFeature[] = [
    { id: 1, name: 'Harare Central Substation 33/11kV', type: 'Primary Substation', coordinates: [31.050, -17.820] },
    { id: 2, name: 'Avondale West Substation 11kV', type: 'Distribution Substation', coordinates: [31.035, -17.805] }
  ];

  public poles: GISFeature[] = [
    { id: 1, name: 'Pole P-1002', type: 'Concrete Pole', coordinates: [31.052, -17.824] },
    { id: 2, name: 'Pole P-1003', type: 'Wooden Treated Pole', coordinates: [31.054, -17.826] }
  ];

  public overheadLines: GISFeature[] = [
    {
      id: 1,
      name: 'Line 11kV Feeder 1',
      type: '11kV Line',
      coordinates: [
        [31.050, -17.820],
        [31.052, -17.824],
        [31.054, -17.826]
      ]
    }
  ];
}

export const mockDb = new MockDatabase();

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'faultdetectiongis',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  connectionTimeoutMillis: 2000
});

export let isPostgresAvailable = false;

export async function initDbConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    isPostgresAvailable = true;
    console.log('[Database] Connected to PostgreSQL with PostGIS successfully.');
    return true;
  } catch (err) {
    isPostgresAvailable = false;
    console.warn('[Database] PostgreSQL connection unavailable. Operating in fallback mock DB mode.');
    return false;
  }
}
