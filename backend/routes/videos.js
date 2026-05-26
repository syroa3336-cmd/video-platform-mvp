import express from 'express';
import { openDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Filtreli video listesi
router.get('/', async (req, res) => {
  const db = await openDb();
  try {
    const { category, tag, sort = 'newest', search, minDuration, maxDuration, status = 'published' } = req.query;
    let sql = `
      SELECT v.*, u.username, c.name as category_name,
        (SELECT GROUP_CONCAT(t.name) FROM video_tags vt JOIN tags t ON vt.tag_id = t.id WHERE vt.video_id = v.id) as tags
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.status = ?
    `;
    const params = [status];

    if (category) {
      sql += ` AND c.slug = ?`;
      params.push(category);
    }
    if (search) {
      sql += ` AND (v.title LIKE ? OR v.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (minDuration) {
      sql += ` AND v.duration >= ?`;
      params.push(minDuration);
    }
    if (maxDuration) {
      sql += ` AND v.duration <= ?`;
      params.push(maxDuration);
    }
    if (tag) {
      sql += ` AND EXISTS (SELECT 1 FROM video_tags vt JOIN tags t ON vt.tag_id = t.id WHERE vt.video_id = v.id AND t.name = ?)`;
      params.push(tag);
    }

    switch (sort) {
      case 'most_viewed':
        sql += ` ORDER BY v.views DESC`;
        break;
      case 'oldest':
        sql += ` ORDER BY v.created_at ASC`;
        break;
      default:
        sql += ` ORDER BY v.created_at DESC`;
    }

    const videos = await db.all(sql, params);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

// Tek video (slug ile)
router.get('/slug/:slug', async (req, res) => {
  const db = await openDb();
  try {
    const { slug } = req.params;
    const video = await db.get(`
      SELECT v.*, u.username, c.name as category_name,
        (SELECT GROUP_CONCAT(t.name) FROM video_tags vt JOIN tags t ON vt.tag_id = t.id WHERE vt.video_id = v.id) as tags
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.slug = ?
    `, slug);

    if (!video) return res.status(404).json({ error: 'Video bulunamadı' });

    // izlenme sayısını artır
    await db.run('UPDATE videos SET views = views + 1 WHERE id = ?', video.id);

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

// Kategorileri listele
router.get('/categories', async (req, res) => {
  const db = await openDb();
  try {
    const categories = await db.all('SELECT id, name, slug FROM categories ORDER BY name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

// Kullanıcının kendi videoları (yeni endpoint)
router.get('/my-videos', authMiddleware, async (req, res) => {
  const db = await openDb();
  try {
    const videos = await db.all(`
      SELECT v.*, u.username, c.name as category_name,
        (SELECT GROUP_CONCAT(t.name) FROM video_tags vt JOIN tags t ON vt.tag_id = t.id WHERE vt.video_id = v.id) as tags
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.user_id = ?
      ORDER BY v.created_at DESC
    `, req.user.id);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

// Kullanıcının videolarını listele (public)
router.get('/user/:userId', async (req, res) => {
  const db = await openDb();
  try {
    const { userId } = req.params;
    const videos = await db.all(`
      SELECT v.*, u.username, c.name as category_name,
        (SELECT GROUP_CONCAT(t.name) FROM video_tags vt JOIN tags t ON vt.tag_id = t.id WHERE vt.video_id = v.id) as tags
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.user_id = ? AND v.status = 'published'
      ORDER BY v.created_at DESC
    `, userId);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

export default router;