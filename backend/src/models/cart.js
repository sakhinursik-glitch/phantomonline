const db = require('../config/db');

const CartModel = {
  getByUser(userId) {
    const items = db.prepare(`
      SELECT ci.*, p.name as product_name, p.brand as product_brand, p.price as product_price,
             p.category as product_category, p.image as product_image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `).all(userId);

    return items.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.product_name,
      brand: item.product_brand,
      price: item.product_price,
      category: item.product_category,
      image: item.product_image,
      size: item.size,
      qty: item.qty,
      custom: {
        player: item.custom_player || item.custom_name || '',
        number: item.custom_number || '',
        customName: item.custom_custom_name || '',
        customNumber: item.custom_custom_number || '',
      } || null,
      surface: JSON.parse('[]'),
      level: '',
    }));
  },

  addItem(userId, { productId, size, qty = 1, custom }) {
    const existing = db.prepare(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?'
    ).get(userId, productId, size || '');

    if (existing) {
      db.prepare('UPDATE cart_items SET qty = qty + ? WHERE id = ?').run(qty, existing.id);
      return existing.id;
    }

    const result = db.prepare(`
      INSERT INTO cart_items (user_id, product_id, size, qty, custom_player, custom_number, custom_name, custom_custom_name, custom_custom_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId, productId, size || '', qty,
      custom?.player || '', custom?.number || '',
      custom?.name || '', custom?.customName || '', custom?.customNumber || ''
    );
    return result.lastInsertRowid;
  },

  updateQty(itemId, userId, qty) {
    return db.prepare('UPDATE cart_items SET qty = ? WHERE id = ? AND user_id = ?')
      .run(Math.max(1, qty), itemId, userId);
  },

  removeItem(itemId, userId) {
    return db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(itemId, userId);
  },

  clear(userId) {
    return db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
  },

  getRaw(userId) {
    return db.prepare('SELECT * FROM cart_items WHERE user_id = ?').all(userId);
  },
};

module.exports = CartModel;
