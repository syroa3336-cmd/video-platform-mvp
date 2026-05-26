import { useEffect, useState } from 'react';
import api from '../api';
import VideoCard from '../components/VideoCard';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData) {
      api.get('/videos/my-videos')
        .then(res => setMyVideos(res.data))
        .catch(err => {
          console.error('API Hatası:', err.response?.status, err.response?.data);
          if (err.response?.status === 401) {
            showToast('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', 'error');
          } else {
            showToast('Videolarınız yüklenirken hata oluştu', 'error');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Lütfen giriş yapın</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2>{user.username}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
        <p>Rol: {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</p>
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>📹 Yüklediğim Videolar ({myVideos.length})</h3>
      {myVideos.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>Henüz video yüklemediniz.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {myVideos.map(v => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}