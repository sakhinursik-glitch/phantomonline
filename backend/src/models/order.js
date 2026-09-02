const db = require('../config/db');

const OrderModel = {
  create(userId, { name, phone, city, address, delivery, deliveryFee, comment, payment, items, subtotal, total }) {
    const id = 'PH-' + Date.now().toString().slice(-6);

    const insertOrder = db.prepare(`
      INSERT INTO orders (id, user_id, name, phone, city, address, delivery, delivery_fee, comment, payment, subtotal, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, product_brand, size, qty, price, custom_player, custom_number, custom_name, custom_custom_name, custom_custom_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      insertOrder.run(id, userId, name, phone, city || null, address || null, delivery, deliveryFee || 0, comment || null, payment, subtotal, total);

      for (const item of items) {
        insertItem.run(
          id,
          item.id || null,
          item.name || '',
          item.brand || '',
          item.size || '',
          item.qty || 1,
          item.price || 0,
          item.custom?.player || '',
          item.custom?.number || '',
          item.custom?.name || '',
          item.custom?.customName || '',
          item.custom?.customNumber || ''
        );
      }
    });

    transaction();
    return id;
  },

  getById(orderId) {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order) return null;
    order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    return order;
  },

  getByUser(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const total = db.prepare('SELECT COUNT(*) as n FROM orders WHERE user_id = ?').get(userId).n;
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(userId, limit, offset);
    return { orders, total, page, limit };
  },

  getAll({ status, page = 1, limit = 20 } = {}) {
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as n');
    const total = db.prepare(countSql).get(...params).n;
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    const orders = db.prepare(sql).all(...params);
    return { orders, total, page, limit };
  },

  updateStatus(orderId, status) {
    return db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .run(status, orderId);
  },

  stats() {
    const total = db.prepare('SELECT COUNT(*) as n FROM orders').get().n;
    const totalRevenue = db.prepare(`SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status != 'cancelled'`).get().s;
    const pending = db.prepare(`SELECT COUNT(*) as n FROM orders WHERE status = 'pending'`).get().n;
    return { total, totalRevenue, pending };
  },
};

module.exports = OrderModel;
