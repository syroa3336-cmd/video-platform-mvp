export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      marginBottom: '1.5rem'
    }}>
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'inherit' }}
      >
        <option value="">Tüm Kategoriler</option>
        <option value="eglence">Eğlence</option>
        <option value="egitim">Eğitim</option>
        <option value="muzik">Müzik</option>
      </select>
      <select
        name="sort"
        value={filters.sort}
        onChange={handleChange}
        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'inherit' }}
      >
        <option value="newest">En Yeni</option>
        <option value="most_viewed">En Çok İzlenen</option>
        <option value="oldest">En Eski</option>
      </select>
    </div>
  );
}