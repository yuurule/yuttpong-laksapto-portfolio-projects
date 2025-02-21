import * as client from 'prom-client';

// Create a Registry to store metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({
  register,
  prefix: 'app_',
});

//Custom metrics
// const metrics = {
//   httpRequestDuration: register.getSingleMetric('http_request_duration_seconds') || 
//     new client.Histogram({
//       name: 'http_request_duration_seconds',
//       help: 'Duration of HTTP requests in seconds',
//       labelNames: ['method', 'route', 'status_code'],
//       buckets: [0.1, 0.5, 1, 2, 5]
//     })
// };

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'app_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// let httpRequestDurationMicroseconds;
// const existingMetric = register.getSingleMetric('http_request_duration_seconds');
// if (existingMetric) {
//   httpRequestDurationMicroseconds = existingMetric;
// } else {
//   // สร้างใหม่ถ้ายังไม่มี
//   httpRequestDurationMicroseconds = new client.Histogram({
//     name: 'http_request_duration_seconds',
//     help: 'Duration of HTTP requests in seconds',
//     labelNames: ['method', 'route', 'status_code'],
//     buckets: [0.1, 0.5, 1, 2, 5]
//   });
// }

// ตรวจสอบก่อนสร้าง metric ใหม่
// let httpRequestDurationMicroseconds;
// try {
//   httpRequestDurationMicroseconds = new client.Histogram({
//     name: 'hello_world',
//     help: 'Duration of HTTP requests in seconds',
//     labelNames: ['method', 'route', 'status_code'],
//     buckets: [0.1, 0.5, 1, 2, 5]
//   });
//   register.registerMetric(httpRequestDurationMicroseconds);
// } catch (e) {
//   // ถ้า metric มีอยู่แล้ว ให้ใช้ตัวที่มีอยู่
//   httpRequestDurationMicroseconds = register.getSingleMetric('hello_world');
// }

const authenticationAttempts = new client.Counter({
  name: 'authentication_attempts_total',
  help: 'Total number of authentication attempts',
  labelNames: ['status'] // success, failure
});

const activeUsers = new client.Gauge({
  name: 'active_users_total',
  help: 'Total number of active users with valid tokens'
});

const refreshTokenOperations = new client.Counter({
  name: 'refresh_token_operations_total',
  help: 'Total number of refresh token operations',
  labelNames: ['operation', 'status'] // operation: create, refresh, revoke
});

// Register custom metrics
register.registerMetric(authenticationAttempts);
register.registerMetric(activeUsers);
register.registerMetric(refreshTokenOperations);

export {
  register,
  httpRequestDurationMicroseconds,
  authenticationAttempts,
  activeUsers,
  refreshTokenOperations
};