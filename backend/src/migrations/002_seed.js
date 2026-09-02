require('dotenv').config();
const path = require('path');

// Load the DEFAULT_CATALOG from the frontend catalog.js file.
// We parse the JS file to extract the array, then strip trailing commas.
const fs = require('fs');
const catalogPath = path.resolve(__dirname, '../../../js/data/catalog.js');
let raw = fs.readFileSync(catalogPath, 'utf-8');

// Extract the array between "const DEFAULT_CATALOG = [" and "];"
const match = raw.match(/const\s+DEFAULT_CATALOG\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not parse DEFAULT_CATALOG from catalog.js');
  process.exit(1);
}

// The JS array is valid JSON except for trailing commas and unquoted keys.
// We need to evaluate it as JS. Using Function to avoid eval.
const evalResult = new Function('return ' + match[1])();
const catalog = Array.isArray(evalResult) ? evalResult : [];

const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Upsert products
const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products (
    id, name, description, price, old_price, discount, image,
    category, brand, subcategory, product_type, league, club, season, kind,
    sizes, surface, level, player_profile, material, weight, fit,
    upper, soleplate, generation, purpose, grip,
    featured, bestseller, is_new, sale, stock, collection
  ) VALUES (
    @id, @name, @description, @price, @old_price, @discount, @image,
    @category, @brand, @subcategory, @product_type, @league, @club, @season, @kind,
    @sizes, @surface, @level, @player_profile, @material, @weight, @fit,
    @upper, @soleplate, @generation, @purpose, @grip,
    @featured, @bestseller, @is_new, @sale, @stock, @collection
  )
`);

const insertMany = db.transaction((items) => {
  for (const p of items) {
    insertProduct.run({
      id: p.id,
      name: p.name || '',
      description: p.description || null,
      price: p.price || 0,
      old_price: p.oldPrice || null,
      discount: p.discount || null,
      image: p.image || null,
      category: p.category || 'boots',
      brand: p.brand || null,
      subcategory: p.subcategory || null,
      product_type: p.productType || null,
      league: p.league || null,
      club: p.club || null,
      season: p.season || null,
      kind: p.kind || null,
      sizes: JSON.stringify(p.sizes || []),
      surface: JSON.stringify(p.surface || []),
      level: p.level || null,
      player_profile: p.playerProfile || null,
      material: p.material || null,
      weight: p.weight || null,
      fit: p.fit || null,
      upper: p.upper || null,
      soleplate: p.soleplate || null,
      generation: p.generation || null,
      purpose: p.purpose || null,
      grip: p.grip || null,
      featured: p.featured ? 1 : 0,
      bestseller: p.bestseller ? 1 : 0,
      is_new: p.isNew ? 1 : 0,
      sale: p.sale ? 1 : 0,
      stock: p.stock || 0,
      collection: p.collection || null,
    });
  }
});

// Create admin user
const adminEmail = process.env.ADMIN_EMAIL || 'admin@phantomonline.kz';
const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-admin-123';
const adminName = process.env.ADMIN_NAME || 'Admin';
const hash = bcrypt.hashSync(adminPassword, 12);

db.prepare(`INSERT OR REPLACE INTO users (id, name, email, password_hash, role) VALUES (1, ?, ?, ?, 'admin')`)
  .run(adminName, adminEmail, hash);

console.log(`[SEED] Created admin: ${adminEmail}`);
insertMany(catalog);
console.log(`[SEED] Seeded ${catalog.length} products`);

// Verify
const count = db.prepare('SELECT COUNT(*) as n FROM products').get().n;
console.log(`[SEED] Total products in DB: ${count}`);
