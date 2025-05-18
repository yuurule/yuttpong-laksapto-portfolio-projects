module.exports = {
  apps: [{
    name: "Comtech-api-node",
    script: "dist/app.js",
    output: "/pm2_logs/output.log",
    error: "/pm2_logs/error.log",
    instances: "2",
    max_restarts: 10,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
    }
  }]
}