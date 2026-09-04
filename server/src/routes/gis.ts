import { Router, Request, Response } from 'express';
import { mockDb, isPostgresAvailable, pool } from '../db';

export const gisRouter = Router();

gisRouter.get('/equipment', async (req: Request, res: Response) => {
  try {
    if (isPostgresAvailable) {
      const sql = 'SELECT id, type, name, condition FROM equipment';
      const result = await pool.query(sql);
      res.json({ success: true, data: result.rows });
    } else {
      res.json({ success: true, data: mockDb.equipment });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

gisRouter.get('/meters', async (req: Request, res: Response) => {
  try {
    if (isPostgresAvailable) {
      const sql = `
        SELECT row_to_json(f) As feature
        FROM (
          SELECT 'Feature' As type,
          ST_AsGeoJSON(geom)::json As geometry,
          row_to_json((SELECT l FROM (SELECT gid, name, client_typ) As l)) As properties
          FROM meter
        ) As f;
      `;
      const result = await pool.query(sql);
      res.json({
        type: 'FeatureCollection',
        features: result.rows.map((r) => r.feature)
      });
    } else {
      res.json({
        type: 'FeatureCollection',
        features: mockDb.meters.map((m) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: m.coordinates },
          properties: { id: m.id, name: m.name, client_type: m.client_type }
        }))
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

gisRouter.get('/substations', async (req: Request, res: Response) => {
  try {
    if (isPostgresAvailable) {
      const sql = `
        SELECT row_to_json(f) As feature
        FROM (
          SELECT 'Feature' As type,
          ST_AsGeoJSON(geom)::json As geometry,
          row_to_json((SELECT l FROM (SELECT gid, name, type) As l)) As properties
          FROM substation
        ) As f;
      `;
      const result = await pool.query(sql);
      res.json({
        type: 'FeatureCollection',
        features: result.rows.map((r) => r.feature)
      });
    } else {
      res.json({
        type: 'FeatureCollection',
        features: mockDb.substations.map((s) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: s.coordinates },
          properties: { id: s.id, name: s.name, type: s.type }
        }))
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

gisRouter.get('/crew', async (req: Request, res: Response) => {
  try {
    if (isPostgresAvailable) {
      const sql = `
        SELECT employees.empid, employees.firstname, employees.surname, employees.rank, expertise.skillset
        FROM employees
        INNER JOIN allocatecrew ON employees.empid = allocatecrew.empid
        INNER JOIN expertise ON allocatecrew.expertise_id = expertise.id
      `;
      const result = await pool.query(sql);
      res.json({ success: true, data: result.rows });
    } else {
      const crewData = mockDb.employees.map((e) => ({
        empid: e.empid,
        firstname: e.firstname,
        surname: e.surname,
        rank: e.rank,
        skillset: e.rank === 'Foreman' ? 'Electrical Grid Supervision & Dispatch' : 'High Voltage Transmission Repair'
      }));
      res.json({ success: true, data: crewData });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

gisRouter.get('/register', async (req: Request, res: Response) => {
  try {
    if (isPostgresAvailable) {
      const sql = `
        SELECT employees.firstname, employees.surname, employees.rank, register.status, register.start_time
        FROM employees
        INNER JOIN register ON employees.empid = register.empid
      `;
      const result = await pool.query(sql);
      res.json({ success: true, data: result.rows });
    } else {
      res.json({ success: true, data: mockDb.register });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
