const express = require('express');
const CartModel = require('../models/cart');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const items = await CartModel.getByUser(req.user.id);
    const total = items.reduce((s, x) => s + x.price * x.qty, 0);
    res.json({ items, total, count: items.reduce((s, x) => s + x.qty, 0) });
  } catch (err) {
    console.error('Cart GET error:', err);
    res.status(500).json({ error: 'Ошибка получения корзины' });
  }
});

router.post('/', validate([
  { name: 'productId', required: true },
  { name: 'qty', required: true, max: 100 },
]), async (req, res) => {
  try {
    const { productId, size, qty = 1, custom } = req.body;
    await CartModel.addItem(req.user.id, { productId, size, qty, custom });
    const items = await CartModel.getByUser(req.user.id);
    const total = items.reduce((s, x) => s + x.price * x.qty, 0);
    res.status(201).json({ items, total, count: items.reduce((s, x) => s + x.qty, 0), message: 'Товар добавлен в корзину' });
  } catch (err) {
    console.error('Cart POST error:', err);
    res.status(500).json({ error: 'Ошибка добавления в корзину' });
  }
});

router.put('/:itemId', validate([
  { name: 'qty', required: true, max: 100 },
]), async (req, res) => {
  try {
    const qty = Number(req.body.qty);
    if (qty < 1) return res.status(400).json({ error: 'Количество не может быть меньше 1' });
    await CartModel.updateQty(Number(req.params.itemId), req.user.id, qty);
    const items = await CartModel.getByUser(req.user.id);
    const total = items.reduce((s, x) => s + x.price * x.qty, 0);
    res.json({ items, total, count: items.reduce((s, x) => s + x.qty, 0) });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления корзины' });
  }
});

router.delete('/:itemId', async (req, res) => {
  try {
    await CartModel.removeItem(Number(req.params.itemId), req.user.id);
    const items = await CartModel.getByUser(req.user.id);
    const total = items.reduce((s, x) => s + x.price * x.qty, 0);
    res.json({ items, total, count: items.reduce((s, x) => s + x.qty, 0), message: 'Товар удалён из корзины' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления из корзины' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await CartModel.clear(req.user.id);
    res.json({ items: [], total: 0, count: 0, message: 'Корзина очищена' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка очистки корзины' });
  }
});

module.exports = router;