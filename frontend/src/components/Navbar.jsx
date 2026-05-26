import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ darkMode, setDarkMode, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      padding: '0.5rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'inherit' }}
        >
          ☰
        </button>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', fontSize: '1.25rem' }}>
          VideoMVP
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        {user ? (
          <>
            <Link to="/upload" className="btn btn-primary">Yükle</Link>
            <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
              {user.username}
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
                ⚙️ Admin
              </Link>
            )}
            <button onClick={handleLogout} className="btn btn-secondary">Çıkış</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Giriş</Link>
            <Link to="/register" className="btn btn-primary">Kayıt</Link>
          </>
        )}
      </div>
    </nav>
  );
}