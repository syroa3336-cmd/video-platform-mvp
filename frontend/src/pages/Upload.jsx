import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Upload() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ title: '', description: '', category_id: '', tags: '', video: null });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/videos/categories')
      .then(res => setCategories(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 200 * 1024 * 1024) {
      showToast("Dosya 200MB'dan büyük olamaz", 'error');
      return;
    }
    setForm({ ...form, video: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.video) return showToast('Video dosyası seçin', 'error');
    if (!form.title.trim()) return showToast('Başlık girin', 'error');

    setLoading(true);
    const data = new FormData();
    data.append('video', form.video);
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('category_id', form.category_id);
    data.append('tags', form.tags.split(',').map(t => t.trim()).filter(t => t));

    try {
      await api.post('/upload', data);
      showToast('Video başarıyla yüklendi!', 'success');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      showToast(err.response?.data?.error || 'Yükleme hatası', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>📤 Video Yükle</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Başlık *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Açıklama</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Kategori</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">Seçiniz</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Etiketler (virgülle ayır)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="örn: komik, oyun, müzik"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Video Dosyası * (MP4, max 200MB)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFile}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {form.video && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Seçildi: {form.video.name}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem' }}
        >
          {loading ? 'Yükleniyor...' : 'Yükle'}
        </button>
      </form>
    </div>
  );
}