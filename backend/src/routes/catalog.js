const express = require('express');
const ProductModel = require('../models/product');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category, brand, league, surface, level, size, minPrice, maxPrice, sort, isNew, bestseller, featured, sale, collection, page, limit } = req.query;
    const result = await ProductModel.getAll({ search, category, brand, league, surface, level, size, minPrice, maxPrice, sort, isNew, bestseller, featured, sale, collection, page, limit });
    res.json(result);
  } catch (err) {
    console.error('Catalog error:', err);
    res.status(500).json({ error: 'Ошибка получения каталога' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const cats = await ProductModel.categories();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения категорий' });
  }
});

router.get('/brands', async (req, res) => {
  try {
    const brands = await ProductModel.brands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения брендов' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения товара' });
  }
});

module.exports = router;