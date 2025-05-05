import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cluster from 'cluster';
import os from 'os';
import cors from 'cors';
import https from 'https';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.routes';
import metricRoutes from './routes/metric.routes';
import logger from './config/logger.config';
import prometheusMiddleware from 'express-prometheus-middleware';
import { authenticateMetrics } from './middleware/auth.middleware';
import { errorHandler } from './utils/errorHandler';
import routes from './routes';

// สร้าง __dirname สำหรับ ES Modules
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

// โหลดไฟล์ .env ตาม environment
dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)
});

// Monitoring endpoints and middleware
const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
};

// Error handling middleware
// const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   logger.error('Error:', err);
//   res.status(500).json({ message: 'Internal server error' });
// };

const setupServer = () => {
  const app = express();

  // กำหนด cors origin
  app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));

  // ตรวจสอบว่ามีโฟลเดอร์ uploads หรือไม่ ถ้าไม่มีให้สร้าง
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads', { recursive: true });
  }

  // กำหนดโฟลเดอร์สำหรับ static file
  app.use(express.static('./public'));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Middleware
  // สำหรับ JSON parsing (ยกเว้น /api/payment/webhook)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl === '/api/payment/webhook') {
      next(); // ข้าม JSON parsing สำหรับ webhook
    } else {
      express.json()(req, res, next);
    }
  });
  //app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // set header
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    next();
  });
  
  // Prometheus metrics middleware
  // app.use('/metrics', authenticateMetrics, prometheusMiddleware({
  //   metricsPath: '/metrics',
  //   collectDefaultMetrics: true,
  //   requestDurationBuckets: [0.1, 0.5, 1, 2, 5]
  // }));

  // Routes
  //app.use('/auth', authRoutes);
  app.use('/api', routes);

  // Monitoring and system metrics endpoints
  //app.use('/metric', metricRoutes);

  // Error handler
  app.all('*', (req, res, next) => {
    const err = new Error(`ไม่พบเส้นทาง ${req.originalUrl} บนเซิร์ฟเวอร์นี้`);
    (err as any).statusCode = 404;
    next(err);
  });

  app.use(errorHandler);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok',
      pid: process.pid,
      workerId: cluster.worker?.id
    });
  });

  return app;
};

// Run with cluster
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  
  logger.info(`Master process ${process.pid} is running`);
  logger.info(`Starting ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.id} died. Code: ${code}, Signal: ${signal}`);
    logger.info('Starting new worker...');
    cluster.fork();
  });

  // Log when a new worker is forked
  cluster.on('fork', (worker) => {
    logger.info(`Worker ${worker.id} started`);
  });
} else {
  const app = setupServer();
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    logger.info(`Worker ${cluster.worker?.id} running on port ${PORT} (PID: ${process.pid})`);
  });

  /* 
  For run on production 
  */
  // const sslOptions = {
  //   key: fs.readFileSync('/etc/letsencrypt/live/devgamemaker.com/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/devgamemaker.com/fullchain.pem')
  // };
  // https.createServer(sslOptions, app).listen(PORT, () => {
  //   console.log(`Server running on port ${PORT}`);
  // });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}