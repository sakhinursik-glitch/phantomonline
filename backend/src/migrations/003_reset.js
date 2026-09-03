require('dotenv').config();
const { query, rawExec, dialect } = require('../config/db');

async function reset() {
  if (dialect === 'sqlite') {
    rawExec(`
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM cart_items;
      DELETE FROM products;
      DELETE FROM users;
    `);
  } else {
    await query('TRUNCATE users, products, cart_items, orders, order_items RESTART IDENTITY CASCADE');
  }
  console.log(`[RESET] All tables truncated (${dialect})`);
  console.log('[RESET] Done. Run: npm run setup');
}

module.exports = reset;
if (require.main === module) reset().catch(e => { console.error(e); process.exit(1); });