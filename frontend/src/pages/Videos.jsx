import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import VideoCard from '../components/VideoCard';
import SkeletonCard from '../components/SkeletonCard';

export default function Videos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchVideos();
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    setSearchParams(params);
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/videos/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Kategoriler yüklenemedi');
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.sort) params.append('sort', filters.sort);
      const res = await api.get(`/videos?${params.toString()}`);
      setVideos(res.data);
    } catch (err) {
      console.error('Videolar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const selectedCategoryName = categories.find(c => c.slug === filters.category)?.name || filters.category;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Tüm Videolar</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'inherit' }}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'inherit' }}
        >
          <option value="newest">En Yeni</option>
          <option value="most_viewed">En Çok İzlenen</option>
          <option value="oldest">En Eski</option>
        </select>
      </div>

      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h3>📭 Bu kategoride henüz video yok</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {filters.category ? `"${selectedCategoryName}" kategorisinde hiç video bulunmuyor.` : 'Hiç video bulunamadı.'}
          </p>
          {(filters.category || filters.search) && (
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ search: '', category: '', sort: 'newest' })}
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}