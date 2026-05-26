import jwt from 'jsonwebtoken';
import { openDb } from '../db.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token gerekli' });

  const db = await openDb();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // last_active güncelle
    await db.run(`UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?`, decoded.id);

    const user = await db.get('SELECT id, username, role, banned, last_active FROM users WHERE id = ?', decoded.id);
    if (!user || user.banned) return res.status(403).json({ error: 'Kullanıcı bulunamadı veya banlı' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Geçersiz token' });
  } finally {
    await db.close();
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin yetkisi gerekli' });
  next();
};