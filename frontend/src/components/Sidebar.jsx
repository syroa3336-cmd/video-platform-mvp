import { Link } from 'react-router-dom';

export default function Sidebar({ open, darkMode }) {
  if (!open) return null;

  const categories = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Tüm Videolar', path: '/videos' },
    { name: 'Eğlence', path: '/videos?category=eglence' },
    { name: 'Eğitim', path: '/videos?category=egitim' },
    { name: 'Müzik', path: '/videos?category=muzik' },
    { name: 'Spor', path: '/videos?category=spor' },
    { name: 'Teknoloji', path: '/videos?category=teknoloji' },
  ];

  return (
    <aside style={{
      width: '220px',
      background: 'var(--bg-secondary)',
      padding: '1rem',
      borderRight: '1px solid var(--border)',
      minHeight: 'calc(100vh - 60px)',
      flexShrink: 0
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map((cat, i) => (
          <li key={i} style={{ marginBottom: '0.5rem' }}>
            <Link
              to={cat.path}
              style={{
                textDecoration: 'none',
                color: 'var(--text-primary)',
                display: 'block',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}