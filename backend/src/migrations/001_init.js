require('dotenv').config();
const { query, rawExec, dialect } = require('../config/db');

const POSTGRES_SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('user','admin')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  old_price INTEGER,
  discount INTEGER,
  image TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  subcategory TEXT,
  product_type TEXT,
  league TEXT,
  club TEXT,
  season TEXT,
  kind TEXT,
  sizes TEXT DEFAULT '[]',
  surface TEXT DEFAULT '[]',
  level TEXT,
  player_profile TEXT,
  material TEXT,
  weight TEXT,
  fit TEXT,
  upper TEXT,
  soleplate TEXT,
  generation TEXT,
  purpose TEXT,
  grip TEXT,
  featured INTEGER DEFAULT 0,
  bestseller INTEGER DEFAULT 0,
  is_new INTEGER DEFAULT 0,
  sale INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  collection TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  qty INTEGER DEFAULT 1,
  custom_player TEXT,
  custom_number TEXT,
  custom_name TEXT,
  custom_custom_name TEXT,
  custom_custom_number TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  address TEXT,
  delivery TEXT,
  delivery_fee INTEGER DEFAULT 0,
  comment TEXT,
  payment TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','paid','processing','shipped','completed','cancelled')),
  subtotal INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  product_brand TEXT,
  size TEXT,
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL,
  custom_player TEXT,
  custom_number TEXT,
  custom_name TEXT,
  custom_custom_name TEXT,
  custom_custom_number TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`;

const SQLITE_SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('user','admin')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  old_price INTEGER,
  discount INTEGER,
  image TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  subcategory TEXT,
  product_type TEXT,
  league TEXT,
  club TEXT,
  season TEXT,
  kind TEXT,
  sizes TEXT DEFAULT '[]',
  surface TEXT DEFAULT '[]',
  level TEXT,
  player_profile TEXT,
  material TEXT,
  weight TEXT,
  fit TEXT,
  upper TEXT,
  soleplate TEXT,
  generation TEXT,
  purpose TEXT,
  grip TEXT,
  featured INTEGER DEFAULT 0,
  bestseller INTEGER DEFAULT 0,
  is_new INTEGER DEFAULT 0,
  sale INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  collection TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  qty INTEGER DEFAULT 1,
  custom_player TEXT,
  custom_number TEXT,
  custom_name TEXT,
  custom_custom_name TEXT,
  custom_custom_number TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  address TEXT,
  delivery TEXT,
  delivery_fee INTEGER DEFAULT 0,
  comment TEXT,
  payment TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','paid','processing','shipped','completed','cancelled')),
  subtotal INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  product_brand TEXT,
  size TEXT,
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL,
  custom_player TEXT,
  custom_number TEXT,
  custom_name TEXT,
  custom_custom_name TEXT,
  custom_custom_number TEXT
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`;

async function migrate() {
  if (dialect === 'sqlite') {
    rawExec(SQLITE_SCHEMA);
  } else {
    const statements = POSTGRES_SCHEMA.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      try {
        await query(stmt);
      } catch (err) {
        if (err.code === '42710') continue;
        console.error('Migration failed:', err.message);
      }
    }
  }
  console.log(`[MIGRATION] Tables created (${dialect})`);
}

module.exports = migrate;
if (require.main === module) migrate().catch(e => { console.error(e); process.exit(1); });