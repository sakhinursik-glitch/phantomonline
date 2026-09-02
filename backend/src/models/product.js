const db = require('../config/db');

const ProductModel = {
  findById(id) {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return row ? ProductModel._parse(row) : null;
  },

  getAll({ search, category, brand, league, surface, level, size, minPrice, maxPrice, sort, isNew, bestseller, featured, sale, collection, page = 1, limit = 50 } = {}) {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      const tokens = search.toLowerCase().split(/\s+/).filter(Boolean);
      for (const t of tokens) {
        sql += ' AND (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ? OR LOWER(subcategory) LIKE ? OR LOWER(product_type) LIKE ? OR LOWER(description) LIKE ? OR LOWER(club) LIKE ? OR LOWER(level) LIKE ?)';
        const like = `%${t}%`;
        params.push(like, like, like, like, like, like, like, like);
      }
    }
    if (category) { sql += ' AND category = ?'; params.push(category); }
    if (brand) { sql += ' AND brand = ?'; params.push(brand); }
    if (league) { sql += ' AND league = ?'; params.push(league); }
    if (surface) { sql += ' AND surface LIKE ?'; params.push(`%"${surface}"%`); }
    if (level) { sql += ' AND level = ?'; params.push(level); }
    if (size) { sql += ' AND sizes LIKE ?'; params.push(`%${size}%`); }
    if (minPrice) { sql += ' AND price >= ?'; params.push(Number(minPrice)); }
    if (maxPrice) { sql += ' AND price <= ?'; params.push(Number(maxPrice)); }
    if (isNew === '1' || isNew === true) { sql += ' AND is_new = 1'; }
    if (bestseller === '1' || bestseller === true) { sql += ' AND bestseller = 1'; }
    if (featured === '1' || featured === true) { sql += ' AND featured = 1'; }
    if (sale === '1' || sale === true) { sql += ' AND sale = 1'; }
    if (collection) { sql += ' AND collection = ?'; params.push(collection); }

    const sortMap = {
      'new': 'is_new DESC, created_at DESC',
      'sale': 'sale DESC, discount DESC',
      'price-asc': 'price ASC',
      'price-desc': 'price DESC',
      'featured': 'featured DESC, bestseller DESC, created_at DESC',
      'popular': 'bestseller DESC, featured DESC',
    };
    sql += ' ORDER BY ' + (sortMap[sort] || sortMap['featured']);

    // Count before pagination
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const total = db.prepare(countSql).get(...params).total;

    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), offset);

    const rows = db.prepare(sql).all(...params);
    return { items: rows.map(ProductModel._parse), total, page: Number(page), limit: Number(limit) };
  },

  categories() {
    return db.prepare('SELECT DISTINCT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC').all();
  },

  brands() {
    return db.prepare('SELECT brand, COUNT(*) as count FROM products WHERE brand IS NOT NULL GROUP BY brand ORDER BY brand').all();
  },

  create(data) {
    return db.prepare(`INSERT INTO products (
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
    )`).run({
      id: data.id,
      name: data.name || '',
      description: data.description || null,
      price: data.price || 0,
      old_price: data.oldPrice || null,
      discount: data.discount || null,
      image: data.image || null,
      category: data.category || 'boots',
      brand: data.brand || null,
      subcategory: data.subcategory || null,
      product_type: data.productType || null,
      league: data.league || null,
      club: data.club || null,
      season: data.season || null,
      kind: data.kind || null,
      sizes: JSON.stringify(data.sizes || []),
      surface: JSON.stringify(data.surface || []),
      level: data.level || null,
      player_profile: data.playerProfile || null,
      material: data.material || null,
      weight: data.weight || null,
      fit: data.fit || null,
      upper: data.upper || null,
      soleplate: data.soleplate || null,
      generation: data.generation || null,
      purpose: data.purpose || null,
      grip: data.grip || null,
      featured: data.featured ? 1 : 0,
      bestseller: data.bestseller ? 1 : 0,
      is_new: data.isNew ? 1 : 0,
      sale: data.sale ? 1 : 0,
      stock: data.stock || 0,
      collection: data.collection || null,
    });
  },

  update(id, data) {
    const fields = [];
    const params = [];
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
        fields.push(`${dbCol} = ?`);
        params.push(data[jsKey]);
      }
    }
    for (const [jsKey, dbCol] of Object.entries(boolMap)) {
      if (data[jsKey] !== undefined) {
        fields.push(`${dbCol} = ?`);
        params.push(data[jsKey] ? 1 : 0);
      }
    }
    for (const [jsKey, dbCol] of Object.entries(arrMap)) {
      if (data[jsKey] !== undefined) {
        fields.push(`${dbCol} = ?`);
        params.push(JSON.stringify(data[jsKey]));
      }
    }

    if (!fields.length) return null;
    fields.push("updated_at = datetime('now')");
    params.push(id);
    return db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...params);
  },

  remove(id) {
    return db.prepare('DELETE FROM products WHERE id = ?').run(id);
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
