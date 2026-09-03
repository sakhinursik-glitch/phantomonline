const express = require('express');
const OrderModel = require('../models/order');
const CartModel = require('../models/cart');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { orderLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.use(authenticate);

router.post('/', orderLimiter, validate([
  { name: 'name', required: true },
  { name: 'phone', required: true, type: 'phone' },
  { name: 'delivery', required: true },
]), async (req, res) => {
  try {
    const { name, phone, city, address, delivery, deliveryFee = 0, comment, payment } = req.body;
    let items = req.body.items;

    if (!items || !items.length) {
      const cart = await CartModel.getByUser(req.user.id);
      if (!cart.length) return res.status(400).json({ error: 'Корзина пуста' });
      items = cart.map(c => ({
        id: c.productId,
        name: c.name,
        brand: c.brand,
        price: c.price,
        size: c.size,
        qty: c.qty,
        custom: { player: c.custom.player, number: c.custom.number },
      }));
    }

    const subtotal = items.reduce((s, x) => s + (x.price || 0) * (x.qty || 1), 0);
    const fee = Number(deliveryFee) || 0;

    const orderId = await OrderModel.create(req.user.id, {
      name, phone, city, address, delivery, deliveryFee: fee, comment, payment, items, subtotal, total: subtotal + fee,
    });

    await CartModel.clear(req.user.id);

    const order = await OrderModel.getById(orderId);
    res.status(201).json({ order, message: 'Заказ успешно создан' });
  } catch (err) {
    console.error('Order create error:', err);
    res.status(500).json({ error: 'Ошибка создания заказа' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await OrderModel.getByUser(req.user.id, Number(page), Number(limit));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await OrderModel.getById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Нет доступа к этому заказу' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения заказа' });
  }
});

module.exports = router;