import { useEffect, useState } from 'react';
import api from '../api';
import VideoCard from '../components/VideoCard';

export default function Homepage() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/videos?sort=most_viewed&limit=6').then(res => setVideos(res.data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    api.get(`/videos?search=${search}`).then(res => setVideos(res.data));
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Video ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginRight: '0.5rem' }}
        />
        <button type="submit" className="btn btn-primary">Ara</button>
      </form>

      <h2 style={{ marginBottom: '1.5rem' }}>🔝 En çok izlenenler</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {videos.map(v => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}