import { Router, Request, Response } from 'express';
import { mockDb, isPostgresAvailable, pool } from '../db';

export const statsRouter = Router();

statsRouter.get('/summary', async (req: Request, res: Response) => {
  try {
    if (isPostgresAvailable) {
      const activeOutagesRes = await pool.query("SELECT COUNT(*) FROM fault WHERE rectification = 'Pending' OR rectification = 'In progress'");
      const commercialRes = await pool.query("SELECT COUNT(*) FROM meter WHERE client_typ = 'Commercial'");
      const industrialRes = await pool.query("SELECT COUNT(*) FROM meter WHERE client_typ = 'Industrial'");
      const residentialRes = await pool.query("SELECT COUNT(*) FROM meter WHERE client_typ = 'Domestic'");

      res.json({
        success: true,
        data: {
          activeOutages: parseInt(activeOutagesRes.rows[0].count, 10),
          commercialAffected: parseInt(commercialRes.rows[0].count, 10),
          industrialAffected: parseInt(industrialRes.rows[0].count, 10),
          residentialAffected: parseInt(residentialRes.rows[0].count, 10)
        }
      });
    } else {
      const activeOutages = mockDb.faults.filter((f) => f.rectification !== 'Completed').length;
      const commercialAffected = mockDb.meters.filter((m) => m.client_type === 'Commercial').length;
      const industrialAffected = mockDb.meters.filter((m) => m.client_type === 'Industrial').length;
      const residentialAffected = mockDb.meters.filter((m) => m.client_type === 'Domestic').length;

      res.json({
        success: true,
        data: {
          activeOutages,
          commercialAffected,
          industrialAffected,
          residentialAffected
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

statsRouter.get('/current-faults', async (req: Request, res: Response) => {
  try {
    if (isPostgresAvailable) {
      const sql = "SELECT fid, type, fname, severity, priority_level, artisan, description, rectification FROM fault WHERE rectification = 'Pending' OR rectification = 'In progress'";
      const result = await pool.query(sql);
      res.json({ success: true, data: result.rows });
    } else {
      const active = mockDb.faults.filter((f) => f.rectification !== 'Completed');
      res.json({ success: true, data: active });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
