const { query, queryRow } = require('../config/db');

const UserModel = {
  async create({ name, email, passwordHash, role = 'user' }) {
    await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [name, email, passwordHash, role]
    );
    return this.findByEmail(email);
  },

  async findByEmail(email) {
    return queryRow('SELECT * FROM users WHERE email = $1', [email]);
  },

  async findById(id) {
    return queryRow(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
  },

  async updateProfile(id, { name, email }) {
    await query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3',
      [name || null, email || null, id]
    );
    return this.findById(id);
  },

  async orderHistory(userId) {
    return query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]).then(r => r.rows);
  },
};

module.exports = UserModel;