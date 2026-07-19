require('dotenv').config();
const app = require('./app');
const pool = require('./db/pool');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query('SELECT 1'); // test DB connection
    console.log('Database connection OK');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
}

start();
