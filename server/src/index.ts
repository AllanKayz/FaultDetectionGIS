import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDbConnection } from './db';
import { authRouter } from './routes/auth';
import { faultsRouter } from './routes/faults';
import { statsRouter } from './routes/stats';
import { gisRouter } from './routes/gis';

dotenv.config();

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/faults', faultsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/gis', gisRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Fault GIS AI Modernized Backend'
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  initDbConnection().then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] Express GIS Server running on port ${PORT}`);
    });
  });
}
