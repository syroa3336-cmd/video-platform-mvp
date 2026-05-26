import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { openDb } from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Tüm alanlar gerekli' });
  if (password.length < 6) return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı' });

  const db = await openDb();
  try {
    const existingUser = await db.get('SELECT id FROM users WHERE email = ? OR username = ?', email, username);
    if (existingUser) return res.status(400).json({ error: 'Kullanıcı adı veya email zaten kullanılıyor' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      username, email, hashedPassword
    );

    const token = jwt.sign({ id: result.lastID }, process.env.JWT_SECRET);
    const user = { id: result.lastID, username, email, role: 'user' };

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email ve şifre gerekli' });

  const db = await openDb();
  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (!user) return res.status(400).json({ error: 'Geçersiz email veya şifre' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Geçersiz email veya şifre' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

export default router;