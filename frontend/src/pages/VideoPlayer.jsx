import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

export default function VideoPlayer() {
  const { slug } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/videos/slug/${slug}`)
      .then(res => setVideo(res.data))
      .catch(err => {
        console.error(err);
        setError('Video yüklenirken bir hata oluştu.');
      });
  }, [slug]);

  if (error) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>❌ {error}</h2>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  const embedUrl = `https://doodstream.com/e/${video.doodstream_id}`;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        aspectRatio: '16/9',
        background: '#000',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '1.5rem'
      }}>
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          title={video.title}
        />
      </div>
      <h1 style={{ marginBottom: '0.5rem' }}>{video.title}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        {video.views} izlenme • {video.username} • {video.category_name}
      </p>
      {video.tags && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {video.tags.split(',').map((tag, i) => (
            <span key={i} style={{
              background: 'var(--bg-hover)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem'
            }}>
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
      {video.description && (
        <p style={{ lineHeight: '1.6' }}>{video.description}</p>
      )}
    </div>
  );
}