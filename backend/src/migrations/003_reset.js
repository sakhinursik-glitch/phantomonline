require('dotenv').config();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(process.env.DB_PATH || './data/phantom.db');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('[RESET] Database deleted:', dbPath);
}
const walPath = dbPath + '-wal';
const shmPath = dbPath + '-shm';
if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);
console.log('[RESET] Done. Run: npm run setup');
