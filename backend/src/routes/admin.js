const express = require('express');
const ProductModel = require('../models/product');
const OrderModel = require('../models/order');
const { authenticate } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();
router.use(authenticate, adminOnly);

router.get('/stats', (req, res) => {
  try {
    const stats = OrderModel.stats();
    const productCount = require('../config/db').prepare('SELECT COUNT(*) as n FROM products').get().n;
    res.json({ ...stats, products: productCount });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения статистики' });
  }
});

router.post('/products', (req, res) => {
  try {
    const data = req.body;
    if (!data.id || !data.name) {
      return res.status(400).json({ error: 'id и name обязательны' });
    }
    const existing = ProductModel.findById(data.id);
    if (existing) {
      return res.status(409).json({ error: 'Товар с таким id уже существует' });
    }
    ProductModel.create(data);
    const product = ProductModel.findById(data.id);
    res.status(201).json({ product, message: 'Товар создан' });
  } catch (err) {
    console.error('Admin product create error:', err);
    res.status(500).json({ error: 'Ошибка создания товара' });
  }
});

router.put('/products/:id', (req, res) => {
  try {
    const existing = ProductModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Товар не найден' });
    ProductModel.update(req.params.id, req.body);
    const product = ProductModel.findById(req.params.id);
    res.json({ product, message: 'Товар обновлён' });
  } catch (err) {
    console.error('Admin product update error:', err);
    res.status(500).json({ error: 'Ошибка обновления товара' });
  }
});

router.delete('/products/:id', (req, res) => {
  try {
    const existing = ProductModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Товар не найден' });
    ProductModel.remove(req.params.id);
    res.json({ message: 'Товар удалён' });
  } catch (err) {
    console.error('Admin product delete error:', err);
    res.status(500).json({ error: 'Ошибка удаления товара' });
  }
});

router.get('/orders', (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const result = OrderModel.getAll({ status, page: Number(page), limit: Number(limit) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
});

router.put('/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: `Статус должен быть: ${valid.join(', ')}` });
    }
    OrderModel.updateStatus(req.params.id, status);
    const order = OrderModel.getById(req.params.id);
    res.json({ order, message: 'Статус обновлён' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
});

module.exports = router;
