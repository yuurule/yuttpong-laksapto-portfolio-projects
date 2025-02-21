import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as metrics from '../config/metrics.config';
import cluster from 'cluster';

const router = express.Router();

router.get('/metrics', authenticate, async (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

router.get('/status', authenticate, (req, res) => {
  const usage = process.memoryUsage();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    pid: process.pid,
    workerId: cluster.worker?.id,
    memory: {
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
      rss: Math.round(usage.rss / 1024 / 1024) + 'MB'
    },
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage()
  });
});

export default router;