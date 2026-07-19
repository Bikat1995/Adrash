require('dotenv').config();
const http = require('http');
const app = require('./app');
const pool = require('./db/pool');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Mock Redis for Phase 2
const mockRedis = {
  driverLocations: new Map(),
  setDriverLocation: (id, lat, lng) => mockRedis.driverLocations.set(id, { lat, lng }),
  getDriverLocation: (id) => mockRedis.driverLocations.get(id),
};

// WebSocket logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('driver_ping', (data) => {
    // data: { driverId, lat, lng }
    mockRedis.setDriverLocation(data.driverId, data.lat, data.lng);
    // Broadcast to relevant vendor/rooms
    io.emit('driver_location_update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Expose io and mockRedis to app/routes if needed
app.set('io', io);
app.set('mockRedis', mockRedis);

// Mock Phase 3 Automated Payout Job
const simulateDailyPayouts = async () => {
  console.log('[PAYOUT JOB] Running automated driver payouts...');
  try {
    const activeDrivers = await pool.query('SELECT user_id, rating, total_deliveries FROM driver_profiles WHERE total_deliveries > 0');
    console.log(`[PAYOUT JOB] Processed payouts for ${activeDrivers.rowCount} drivers via Telebirr API mock.`);
  } catch (err) {
    console.error('[PAYOUT JOB] Error:', err);
  }
};
// Run once on startup for demonstration, then every 24h
simulateDailyPayouts();
setInterval(simulateDailyPayouts, 24 * 60 * 60 * 1000);

async function start() {
  try {
    await pool.query('SELECT 1'); // test DB connection
    console.log('Database connection OK');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
}

start();
