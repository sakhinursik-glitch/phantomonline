const db = require('../config/db');

const UserModel = {
  create({ name, email, passwordHash, role = 'user' }) {
    return db.prepare(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
    ).run(name, email, passwordHash, role);
  },

  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(id);
  },

  updateProfile(id, { name, email }) {
    return db.prepare('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?')
      .run(name || null, email || null, id);
  },

  orderHistory(userId) {
    return db.prepare(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId);
  },
};

module.exports = UserModel;
