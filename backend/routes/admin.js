import express from 'express';
import { openDb } from '../db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Tüm admin rotaları korumalı
router.use(authMiddleware, adminMiddleware);

router.get('/stats', async (req, res) => {
  const db = await openDb();
  try {
    const totalVideos = await db.get('SELECT COUNT(*) as count FROM videos');
    const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
    const totalViews = await db.get('SELECT SUM(views) as total FROM videos');
    const todayVideos = await db.get("SELECT COUNT(*) as count FROM videos WHERE date(created_at) = date('now')");
    res.json({
      totalVideos: totalVideos.count,
      totalUsers: totalUsers.count,
      totalViews: totalViews.total || 0,
      todayVideos: todayVideos.count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

router.get('/videos', async (req, res) => {
  const db = await openDb();
  try {
    const videos = await db.all(`
      SELECT v.*, u.username, c.name as category_name
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      ORDER BY v.created_at DESC
    `);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

router.get('/users', async (req, res) => {
  const db = await openDb();
  try {
    const users = await db.all('SELECT id, username, email, role, banned, created_at, last_active FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

router.get('/categories', async (req, res) => {
  const db = await openDb();
  try {
    const categories = await db.all('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

export default router;