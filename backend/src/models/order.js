const { query, queryRow, queryAll, execute, pool } = require('../config/db');

const OrderModel = {
  async create(userId, { name, phone, city, address, delivery, deliveryFee, comment, payment, items, subtotal, total }) {
    const id = 'PH-' + Date.now().toString().slice(-6);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO orders (id, user_id, name, phone, city, address, delivery, delivery_fee, comment, payment, subtotal, total)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [id, userId, name, phone, city || null, address || null, delivery, deliveryFee || 0, comment || null, payment, subtotal, total]
      );

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_brand, size, qty, price, custom_player, custom_number, custom_name, custom_custom_name, custom_custom_number)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
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
            item.custom?.customNumber || '',
          ]
        );
      }

      await client.query('COMMIT');
      return id;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async getById(orderId) {
    const order = await queryRow('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (!order) return null;
    order.items = await queryAll('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
    return order;
  },

  async getByUser(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const totalRow = await queryRow('SELECT COUNT(*) as n FROM orders WHERE user_id = $1', [userId]);
    const total = Number(totalRow.n);
    const orders = await queryAll(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    return { orders, total, page, limit };
  },

  async getAll({ status, page = 1, limit = 20 } = {}) {
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    let n = 0;
    const p = () => `$${++n}`;
    if (status) { sql += ` AND status = ${p()}`; params.push(status); }
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as n');
    const countRes = await query(countSql, params);
    const total = Number(countRes.rows[0].n);
    sql += ` ORDER BY created_at DESC LIMIT ${p()} OFFSET ${p()}`;
    params.push(limit, (page - 1) * limit);
    const orders = await queryAll(sql, params);
    return { orders, total, page, limit };
  },

  async updateStatus(orderId, status) {
    return execute(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [status, orderId]
    );
  },

  async stats() {
    const totalRes = await query('SELECT COUNT(*) as n FROM orders');
    const total = Number(totalRes.rows[0].n);
    const revRes = await query("SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status != 'cancelled'");
    const totalRevenue = Number(revRes.rows[0].s);
    const pendingRes = await query("SELECT COUNT(*) as n FROM orders WHERE status = 'pending'");
    const pending = Number(pendingRes.rows[0].n);
    return { total, totalRevenue, pending };
  },
};

module.exports = OrderModel;