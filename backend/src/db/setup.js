const pool = require('./pool');

async function setup() {
  console.log('Setting up database...');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        name TEXT,
        language_pref TEXT DEFAULT 'en',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS driver_profiles (
        user_id INTEGER PRIMARY KEY,
        id_photo_url TEXT,
        verification_status TEXT DEFAULT 'pending',
        is_online BOOLEAN DEFAULT 0,
        last_lat REAL,
        last_lng REAL,
        last_ping_at DATETIME,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER NOT NULL,
        driver_id INTEGER,
        pickup_lat REAL NOT NULL,
        pickup_lng REAL NOT NULL,
        dropoff_lat REAL NOT NULL,
        dropoff_lng REAL NOT NULL,
        item_description TEXT NOT NULL,
        status TEXT DEFAULT 'requested',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        matched_at DATETIME,
        delivered_at DATETIME,
        FOREIGN KEY(vendor_id) REFERENCES users(id),
        FOREIGN KEY(driver_id) REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        rater_id INTEGER NOT NULL,
        ratee_id INTEGER NOT NULL,
        stars INTEGER NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(rater_id) REFERENCES users(id),
        FOREIGN KEY(ratee_id) REFERENCES users(id)
      )
    `);

    console.log('Database tables created successfully.');
  } catch (err) {
    console.error('Error setting up database:', err);
  }
}

setup();
