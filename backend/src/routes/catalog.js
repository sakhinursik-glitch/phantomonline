const express = require('express');
const ProductModel = require('../models/product');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { search, category, brand, league, surface, level, size, minPrice, maxPrice, sort, isNew, bestseller, featured, sale, collection, page, limit } = req.query;
    const result = ProductModel.getAll({ search, category, brand, league, surface, level, size, minPrice, maxPrice, sort, isNew, bestseller, featured, sale, collection, page, limit });
    res.json(result);
  } catch (err) {
    console.error('Catalog error:', err);
    res.status(500).json({ error: 'Ошибка получения каталога' });
  }
});

router.get('/categories', (req, res) => {
  try {
    res.json(ProductModel.categories());
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения категорий' });
  }
});

router.get('/brands', (req, res) => {
  try {
    res.json(ProductModel.brands());
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения брендов' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения товара' });
  }
});

module.exports = router;
