const { query, queryRow, queryAll, execute } = require('../config/db');

const CartModel = {
  async getByUser(userId) {
    const items = await queryAll(
      `SELECT ci.*, p.name as product_name, p.brand as product_brand, p.price as product_price,
              p.category as product_category, p.image as product_image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [userId]
    );

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

  async addItem(userId, { productId, size, qty = 1, custom }) {
    const existing = await queryRow(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2 AND size = $3',
      [userId, productId, size || '']
    );

    if (existing) {
      await execute('UPDATE cart_items SET qty = qty + $1 WHERE id = $2', [qty, existing.id]);
      return existing.id;
    }

    await execute(
      `INSERT INTO cart_items (user_id, product_id, size, qty, custom_player, custom_number, custom_name, custom_custom_name, custom_custom_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId, productId, size || '', qty,
        custom?.player || '', custom?.number || '',
        custom?.name || '', custom?.customName || '', custom?.customNumber || '',
      ]
    );
    const row = await queryRow(
      'SELECT id FROM cart_items WHERE user_id = $1 AND product_id = $2 AND size = $3 ORDER BY id DESC LIMIT 1',
      [userId, productId, size || '']
    );
    return row.id;
  },

  async updateQty(itemId, userId, qty) {
    return execute('UPDATE cart_items SET qty = $1 WHERE id = $2 AND user_id = $3',
      [Math.max(1, qty), itemId, userId]);
  },

  async removeItem(itemId, userId) {
    return execute('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [itemId, userId]);
  },

  async clear(userId) {
    return execute('DELETE FROM cart_items WHERE user_id = $1', [userId]);
  },

  async getRaw(userId) {
    return queryAll('SELECT * FROM cart_items WHERE user_id = $1', [userId]);
  },
};

module.exports = CartModel;