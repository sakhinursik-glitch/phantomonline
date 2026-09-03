require('dotenv').config();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { query, execute, dialect } = require('../config/db');

const catalogPath = path.resolve(__dirname, '../../../js/data/catalog.js');
let raw = fs.readFileSync(catalogPath, 'utf-8');

const match = raw.match(/const\s+DEFAULT_CATALOG\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not parse DEFAULT_CATALOG from catalog.js');
  process.exit(1);
}

const evalResult = new Function('return ' + match[1])();
const catalog = Array.isArray(evalResult) ? evalResult : [];

async function seed() {
  for (const p of catalog) {
    await execute(
      `INSERT INTO products (
        id, name, description, price, old_price, discount, image,
        category, brand, subcategory, product_type, league, club, season, kind,
        sizes, surface, level, player_profile, material, weight, fit,
        upper, soleplate, generation, purpose, grip,
        featured, bestseller, is_new, sale, stock, collection
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22,
        $23, $24, $25, $26, $27,
        $28, $29, $30, $31, $32, $33
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
        old_price = EXCLUDED.old_price, discount = EXCLUDED.discount, image = EXCLUDED.image,
        category = EXCLUDED.category, brand = EXCLUDED.brand, subcategory = EXCLUDED.subcategory,
        product_type = EXCLUDED.product_type, league = EXCLUDED.league, club = EXCLUDED.club,
        season = EXCLUDED.season, kind = EXCLUDED.kind,
        sizes = EXCLUDED.sizes, surface = EXCLUDED.surface, level = EXCLUDED.level,
        player_profile = EXCLUDED.player_profile, material = EXCLUDED.material,
        weight = EXCLUDED.weight, fit = EXCLUDED.fit,
        upper = EXCLUDED.upper, soleplate = EXCLUDED.soleplate, generation = EXCLUDED.generation,
        purpose = EXCLUDED.purpose, grip = EXCLUDED.grip,
        featured = EXCLUDED.featured, bestseller = EXCLUDED.bestseller,
        is_new = EXCLUDED.is_new, sale = EXCLUDED.sale, stock = EXCLUDED.stock,
        collection = EXCLUDED.collection, updated_at = CURRENT_TIMESTAMP
      `,
      [
        p.id, p.name || '', p.description || null, p.price || 0,
        p.oldPrice || null, p.discount || null, p.image || null,
        p.category || 'boots', p.brand || null, p.subcategory || null,
        p.productType || null, p.league || null, p.club || null,
        p.season || null, p.kind || null,
        JSON.stringify(p.sizes || []), JSON.stringify(p.surface || []),
        p.level || null, p.playerProfile || null, p.material || null,
        p.weight || null, p.fit || null,
        p.upper || null, p.soleplate || null, p.generation || null,
        p.purpose || null, p.grip || null,
        p.featured ? 1 : 0, p.bestseller ? 1 : 0, p.isNew ? 1 : 0,
        p.sale ? 1 : 0, p.stock || 0, p.collection || null,
      ]
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@phantomonline.kz';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-admin-123';
  const adminName = process.env.ADMIN_NAME || 'Admin';
  const hash = await bcrypt.hash(adminPassword, 12);

  await execute(
    `INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, password_hash = EXCLUDED.password_hash`,
    [1, adminName, adminEmail, hash]
  );

  console.log(`[SEED] Created admin: ${adminEmail}`);
  console.log(`[SEED] Seeded ${catalog.length} products`);

  const countRes = await query('SELECT COUNT(*) as n FROM products');
  console.log(`[SEED] Total products in DB: ${countRes.rows ? countRes.rows[0].n : countRes[0].n}`);
}

module.exports = seed;
if (require.main === module) seed().catch(e => { console.error(e); process.exit(1); });