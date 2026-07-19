const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { Pool } = require('pg');

let pool;
let isPostgres = false;

if (process.env.DATABASE_URL) {
  isPostgres = true;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log('Using managed PostgreSQL cluster.');
} else {
  const dbPath = path.resolve(__dirname, '../../database.sqlite');
  const db = new sqlite3.Database(dbPath);
  console.log('Using local SQLite fallback.');

  pool = {
    query: (text, params) => {
      return new Promise((resolve, reject) => {
        const sqliteText = text.replace(/\$\d+/g, '?');
        
        if (sqliteText.trim().toUpperCase().startsWith('SELECT') || sqliteText.trim().toUpperCase().startsWith('PRAGMA') || sqliteText.includes('RETURNING')) {
          db.all(sqliteText, params, (err, rows) => {
            if (err) {
              console.error('DB Error:', err);
              reject(err);
            } else {
              resolve({ rows, rowCount: rows.length });
            }
          });
        } else {
          db.run(sqliteText, params, function(err) {
            if (err) {
              console.error('DB Error:', err);
              reject(err);
            } else {
              resolve({ rowCount: this.changes, lastID: this.lastID, rows: [{ id: this.lastID }] });
            }
          });
        }
      });
    }
  };
}

module.exports = pool;
