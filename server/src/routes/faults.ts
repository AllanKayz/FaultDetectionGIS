import { Router, Request, Response } from 'express';
import { mockDb, isPostgresAvailable, pool, Fault } from '../db';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { CreateFaultSchema, UpdateFaultStatusSchema } from '../schemas';

export const faultsRouter = Router();

faultsRouter.get('/geojson', async (req: Request, res: Response) => {
  try {
    if (isPostgresAvailable) {
      const sql = `
        SELECT row_to_json(f) As feature
        FROM (
          SELECT 'Feature' As type,
          ST_AsGeoJSON(geom)::json As geometry,
          row_to_json((SELECT l FROM (SELECT fid, type, fname, severity, priority_level, artisan, description, rectification, et_occurrence) As l)) As properties
          FROM fault
        ) As f;
      `;
      const result = await pool.query(sql);
      const features = result.rows.map((row) => row.feature);
      res.json({
        type: 'FeatureCollection',
        features
      });
    } else {
      const features = mockDb.faults.map((f) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: f.coordinates
        },
        properties: {
          fid: f.fid,
          type: f.type,
          fname: f.fname,
          severity: f.severity,
          priority_level: f.priority_level,
          artisan: f.artisan || 'Unassigned',
          description: f.description || '',
          rectification: f.rectification,
          et_occurrence: f.et_occurrence
        }
      }));
      res.json({
        type: 'FeatureCollection',
        features
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

faultsRouter.get('/', async (req: Request, res: Response) => {
  try {
    if (isPostgresAvailable) {
      const sql = 'SELECT fid, type, fname, severity, priority_level, artisan, description, rectification, et_occurrence FROM fault';
      const result = await pool.query(sql);
      res.json({ success: true, data: result.rows });
    } else {
      res.json({ success: true, data: mockDb.faults });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

faultsRouter.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const parseResult = CreateFaultSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ success: false, errors: parseResult.error.errors });
    return;
  }

  const { type, fname, severity, priority_level, description, artisan, coordinates } = parseResult.data;

  let coords: [number, number];
  if (typeof coordinates === 'string') {
    const parts = coordinates.split(',').map((p) => parseFloat(p.trim()));
    coords = [parts[0] || 31.053, parts[1] || -17.825];
  } else {
    coords = coordinates;
  }

  try {
    if (isPostgresAvailable) {
      const sql = `
        INSERT INTO fault (type, fname, severity, priority_level, description, artisan, rectification, geom, et_occurrence)
        VALUES ($1, $2, $3, $4, $5, $6, 'Pending', ST_GeomFromText($7, 4326), NOW())
        RETURNING fid, type, fname, severity, priority_level, artisan, description, rectification, et_occurrence
      `;
      const wktPoint = `POINT(${coords[0]} ${coords[1]})`;
      const dbRes = await pool.query(sql, [type, fname, severity, priority_level, description || '', artisan || 'Unassigned', wktPoint]);
      res.status(201).json({ success: true, data: dbRes.rows[0] });
    } else {
      const newFid = mockDb.faults.length ? Math.max(...mockDb.faults.map((f) => f.fid)) + 1 : 101;
      const newFault: Fault = {
        fid: newFid,
        type,
        fname,
        severity,
        priority_level,
        artisan: artisan || 'Unassigned',
        description: description || '',
        rectification: 'Pending',
        et_occurrence: new Date().toISOString(),
        coordinates: coords
      };
      mockDb.faults.push(newFault);
      res.status(201).json({ success: true, data: newFault });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

faultsRouter.patch('/:fid/status', authenticateToken, authorizeRoles('Foreman', 'Artisan', 'Admin'), async (req: Request, res: Response): Promise<void> => {
  const fid = parseInt(req.params.fid, 10);
  const parseResult = UpdateFaultStatusSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ success: false, errors: parseResult.error.errors });
    return;
  }

  const { rectification, artisan, description } = parseResult.data;

  try {
    if (isPostgresAvailable) {
      const sql = `
        UPDATE fault
        SET rectification = $1,
            artisan = COALESCE($2, artisan),
            description = COALESCE($3, description)
        WHERE fid = $4
        RETURNING fid, type, fname, severity, priority_level, artisan, description, rectification
      `;
      const dbRes = await pool.query(sql, [rectification, artisan || null, description || null, fid]);
      if (dbRes.rows.length === 0) {
        res.status(404).json({ success: false, message: 'Fault not found' });
        return;
      }
      res.json({ success: true, data: dbRes.rows[0] });
    } else {
      const fault = mockDb.faults.find((f) => f.fid === fid);
      if (!fault) {
        res.status(404).json({ success: false, message: 'Fault not found' });
        return;
      }
      fault.rectification = rectification;
      if (artisan) fault.artisan = artisan;
      if (description) fault.description = description;
      res.json({ success: true, data: fault });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
