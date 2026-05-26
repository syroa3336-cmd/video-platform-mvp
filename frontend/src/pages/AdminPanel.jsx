import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      switch (tab) {
        case 'dashboard':
          const statsRes = await api.get('/admin/stats');
          setStats(statsRes.data);
          break;
        case 'videos':
          const videosRes = await api.get('/admin/videos');
          setVideos(videosRes.data);
          break;
        case 'users':
          const usersRes = await api.get('/admin/users');
          setUsers(usersRes.data);
          break;
        case 'categories':
          const catRes = await api.get('/admin/categories');
          setCategories(catRes.data);
          break;
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError('Bu sayfaya erişim yetkiniz yok.');
      } else {
        setError('Veriler yüklenirken hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const tabs = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'videos', label: '🎬 Videolar' },
    { key: 'users', label: '👥 Kullanıcılar' },
    { key: 'categories', label: '🏷️ Kategoriler' },
  ];

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <h1>Admin Paneli</h1>
      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && activeTab === 'dashboard' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="card"><h3>Toplam Video</h3><p>{stats.totalVideos}</p></div>
          <div className="card"><h3>Toplam Kullanıcı</h3><p>{stats.totalUsers}</p></div>
          <div className="card"><h3>Toplam İzlenme</h3><p>{stats.totalViews}</p></div>
          <div className="card"><h3>Bugün Yüklenen</h3><p>{stats.todayVideos}</p></div>
        </div>
      )}

      {!loading && !error && activeTab === 'videos' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>ID</th><th>Başlık</th><th>Yükleyen</th><th>İzlenme</th><th>Durum</th></tr>
          </thead>
          <tbody>
            {videos.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td>{v.id}</td><td>{v.title}</td><td>{v.username}</td><td>{v.views}</td><td>{v.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && activeTab === 'users' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>ID</th><th>Kullanıcı Adı</th><th>Email</th><th>Rol</th><th>Banlı</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td>{u.id}</td><td>{u.username}</td><td>{u.email}</td><td>{u.role}</td><td>{u.banned ? 'Evet' : 'Hayır'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && activeTab === 'categories' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>ID</th><th>Ad</th><th>Slug</th></tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td>{c.id}</td><td>{c.name}</td><td>{c.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}