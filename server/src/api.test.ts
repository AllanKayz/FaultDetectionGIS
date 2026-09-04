import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('Express API Integration Tests', () => {
  let authToken: string;

  it('GET /api/health should return status healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('POST /api/auth/login should authenticate Foreman user and return JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'kmukondiwa@powerutility.com',
      password: '12345'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.rank).toBe('Foreman');

    authToken = res.body.token;
  });

  it('POST /api/auth/login with wrong credentials should fail with 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'kmukondiwa@powerutility.com',
      password: 'wrongpassword'
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/faults/geojson should return GeoJSON FeatureCollection', async () => {
    const res = await request(app).get('/api/faults/geojson');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('FeatureCollection');
    expect(Array.isArray(res.body.features)).toBe(true);
  });

  it('POST /api/faults should create a new fault when authenticated', async () => {
    const res = await request(app)
      .post('/api/faults')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'Feeder Trip',
        fname: 'Substation Gamma Line 2',
        severity: 'Major',
        priority_level: 'High',
        description: 'Auto recloser lockout triggered',
        coordinates: [31.055, -17.828]
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fid).toBeDefined();
    expect(res.body.data.rectification).toBe('Pending');
  });

  it('GET /api/stats/summary should return active outages metrics', async () => {
    const res = await request(app).get('/api/stats/summary');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.activeOutages).toBe('number');
  });
});
