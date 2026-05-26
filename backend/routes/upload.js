import express from 'express';
import multer from 'multer';
import { openDb } from '../db.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import { uploadToDoodstream } from '../utils/doodstream.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, upload.single('video'), async (req, res) => {
  const db = await openDb();
  try {
    const { title, description, category_id, tags } = req.body;
    const userId = req.user.id;
    const videoFile = req.file;

    if (!videoFile) return res.status(400).json({ error: 'Video dosyası gerekli' });

    // 1. Doodstream'e yükle
    const doodRes = await uploadToDoodstream(videoFile.buffer, videoFile.originalname, process.env.DOODSTREAM_API_KEY);
    if (!doodRes.filecode) throw new Error('Doodstream yükleme başarısız');

    // 2. Benzersiz slug oluştur
    const slug = await generateUniqueSlug(db, title);

    // 3. Onay durumunu belirle
    // Admin mi kontrol et
    const user = await db.get('SELECT role FROM users WHERE id = ?', userId);
    const isAdmin = user.role === 'admin';

    // Onay zorunluluğu ayarını oku
    const configRow = await db.get(`SELECT value FROM admin_config WHERE key = 'requireApproval'`);
    const requireApproval = configRow?.value === 'true';

    // Karar: Admin ise direkt yayınla, değilse ayara bağlı olarak pending/published
    let status = 'pending';
    if (isAdmin) {
      status = 'published';
    } else {
      status = requireApproval ? 'pending' : 'published';
    }

    // 4. Video kaydı
    const result = await db.run(
      `INSERT INTO videos (title, description, slug, doodstream_id, category_id, user_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, slug, doodRes.filecode, category_id || null, userId, status]
    );
    const videoId = result.lastID;

    // 5. Etiketleri işle
    if (tags && Array.isArray(tags)) {
      for (let tagName of tags) {
        let tag = await db.get('SELECT id FROM tags WHERE name = ?', tagName);
        if (!tag) {
          const tagRes = await db.run('INSERT INTO tags (name) VALUES (?)', tagName);
          tag = { id: tagRes.lastID };
        }
        await db.run('INSERT INTO video_tags (video_id, tag_id) VALUES (?, ?)', [videoId, tag.id]);
      }
    }

    res.json({ success: true, videoId, slug, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await db.close();
  }
});

export default router;