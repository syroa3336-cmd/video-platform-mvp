import { Link } from 'react-router-dom';

export default function VideoCard({ video }) {
  return (
    <Link
      to={`/video/${video.slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        display: 'block'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        aspectRatio: '16/9',
        background: 'var(--bg-hover)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem'
      }}>
        🎬
      </div>
      <div style={{ padding: '0.75rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{video.title}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {video.username} • {video.views || 0} izlenme
        </p>
      </div>
    </Link>
  );
}