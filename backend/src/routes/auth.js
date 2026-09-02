const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/register', authLimiter, validate([
  { name: 'name', required: true, minLength: 2 },
  { name: 'email', required: true, type: 'email' },
  { name: 'password', required: true, minLength: 6 },
]), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }
    const hash = await bcrypt.hash(password, 12);
    UserModel.create({ name, email, passwordHash: hash });
    const user = UserModel.findByEmail(email);
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, jwtSecret, { expiresIn: jwtExpiresIn });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

router.post('/login', authLimiter, validate([
  { name: 'email', required: true, type: 'email' },
  { name: 'password', required: true },
]), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

router.get('/me', authenticate, (req, res) => {
  const user = UserModel.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json({ user });
});

router.put('/me', authenticate, validate([
  { name: 'name', required: false, minLength: 2 },
  { name: 'email', required: false, type: 'email' },
]), (req, res) => {
  try {
    UserModel.updateProfile(req.user.id, req.body);
    const user = UserModel.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Email уже используется' });
    }
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

module.exports = router;
