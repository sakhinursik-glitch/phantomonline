const { query, queryRow, queryAll, execute } = require('../config/db');

const ProductModel = {
  async findById(id) {
    const row = await queryRow('SELECT * FROM products WHERE id = $1', [id]);
    return row ? ProductModel._parse(row) : null;
  },

  async getAll({ search, category, brand, league, surface, level, size, minPrice, maxPrice, sort, isNew, bestseller, featured, sale, collection, page = 1, limit = 50 } = {}) {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let n = 0;

    const p = () => `$${++n}`;

    if (search) {
      const tokens = search.toLowerCase().split(/\s+/).filter(Boolean);
      for (const t of tokens) {
        const cols = ['name', 'brand', 'category', 'subcategory', 'product_type', 'description', 'club', 'level'];
        const like = `%${t}%`;
        const parts = cols.map(c => `LOWER(${c}) LIKE ${p()}`);
        for (let i = 0; i < cols.length; i++) params.push(like);
        sql += ` AND (${parts.join(' OR ')})`;
      }
    }
    if (category) { sql += ` AND category = ${p()}`; params.push(category); }
    if (brand) { sql += ` AND brand = ${p()}`; params.push(brand); }
    if (league) { sql += ` AND league = ${p()}`; params.push(league); }
    if (surface) { sql += ` AND surface LIKE ${p()}`; params.push(`%"${surface}"%`); }
    if (level) { sql += ` AND level = ${p()}`; params.push(level); }
    if (size) { sql += ` AND sizes LIKE ${p()}`; params.push(`%${size}%`); }
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') { sql += ` AND price >= ${p()}`; params.push(Number(minPrice)); }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') { sql += ` AND price <= ${p()}`; params.push(Number(maxPrice)); }
    if (isNew === '1' || isNew === true) { sql += ' AND is_new = 1'; }
    if (bestseller === '1' || bestseller === true) { sql += ' AND bestseller = 1'; }
    if (featured === '1' || featured === true) { sql += ' AND featured = 1'; }
    if (sale === '1' || sale === true) { sql += ' AND sale = 1'; }
    if (collection) { sql += ` AND collection = ${p()}`; params.push(collection); }

    const sortMap = {
      'new': 'is_new DESC, created_at DESC',
      'sale': 'sale DESC, discount DESC',
      'price-asc': 'price ASC',
      'price-desc': 'price DESC',
      'featured': 'featured DESC, bestseller DESC, created_at DESC',
      'popular': 'bestseller DESC, featured DESC',
    };
    sql += ' ORDER BY ' + (sortMap[sort] || sortMap['featured']);

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countRes = await query(countSql, params);
    const total = Number(countRes.rows[0].total);

    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
    sql += ` LIMIT ${p()} OFFSET ${p()}`;
    params.push(Number(limit), offset);

    const rows = await queryAll(sql, params);
    return { items: rows.map(ProductModel._parse), total, page: Number(page), limit: Number(limit) };
  },

  async categories() {
    const rows = await queryAll(
      'SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC'
    );
    return rows;
  },

  async brands() {
    const rows = await queryAll(
      'SELECT brand, COUNT(*) as count FROM products WHERE brand IS NOT NULL GROUP BY brand ORDER BY brand'
    );
    return rows;
  },

  async create(data) {
    await query(
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
      )`,
      [
        data.id, data.name || '', data.description || null, data.price || 0,
        data.oldPrice || null, data.discount || null, data.image || null,
        data.category || 'boots', data.brand || null, data.subcategory || null,
        data.productType || null, data.league || null, data.club || null,
        data.season || null, data.kind || null,
        JSON.stringify(data.sizes || []), JSON.stringify(data.surface || []),
        data.level || null, data.playerProfile || null, data.material || null,
        data.weight || null, data.fit || null,
        data.upper || null, data.soleplate || null, data.generation || null,
        data.purpose || null, data.grip || null,
        data.featured ? 1 : 0, data.bestseller ? 1 : 0, data.isNew ? 1 : 0,
        data.sale ? 1 : 0, data.stock || 0, data.collection || null,
      ]
    );
    return { rowCount: 1, lastID: data.id };
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    let n = 0;
    const p = () => `$${++n}`;
    const map = {
      name: 'name', description: 'description', price: 'price', oldPrice: 'old_price',
      discount: 'discount', image: 'image', category: 'category', brand: 'brand',
      subcategory: 'subcategory', productType: 'product_type', league: 'league',
      club: 'club', season: 'season', kind: 'kind', level: 'level',
      playerProfile: 'player_profile', material: 'material', weight: 'weight',
      fit: 'fit', upper: 'upper', soleplate: 'soleplate', generation: 'generation',
      purpose: 'purpose', grip: 'grip', collection: 'collection', stock: 'stock',
    };
    const boolMap = { featured: 'featured', bestseller: 'bestseller', isNew: 'is_new', sale: 'sale' };
    const arrMap = { sizes: 'sizes', surface: 'surface' };

    for (const [jsKey, dbCol] of Object.entries(map)) {
      if (data[jsKey] !== undefined) {
        fields.push(`${dbCol} = ${p()}`);
        params.push(data[jsKey]);
      }
    }
    for (const [jsKey, dbCol] of Object.entries(boolMap)) {
      if (data[jsKey] !== undefined) {
        fields.push(`${dbCol} = ${p()}`);
        params.push(data[jsKey] ? 1 : 0);
      }
    }
    for (const [jsKey, dbCol] of Object.entries(arrMap)) {
      if (data[jsKey] !== undefined) {
        fields.push(`${dbCol} = ${p()}`);
        params.push(JSON.stringify(data[jsKey]));
      }
    }

    if (!fields.length) return null;
    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    return execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ${p()}`, params);
  },

  async remove(id) {
    return execute('DELETE FROM products WHERE id = $1', [id]);
  },

  _parse(row) {
    if (!row) return null;
    row.sizes = JSON.parse(row.sizes || '[]');
    row.surface = JSON.parse(row.surface || '[]');
    row.featured = !!row.featured;
    row.bestseller = !!row.bestseller;
    row.isNew = !!row.is_new;
    row.sale = !!row.sale;
    row.oldPrice = row.old_price;
    row.productType = row.product_type;
    row.playerProfile = row.player_profile;
    delete row.old_price;
    delete row.product_type;
    delete row.player_profile;
    delete row.created_at;
    delete row.updated_at;
    return row;
  },
};

module.exports = ProductModel;