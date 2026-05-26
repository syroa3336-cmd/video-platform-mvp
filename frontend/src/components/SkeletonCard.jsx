export default function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '12px',
      overflow: 'hidden',
      animation: 'pulse 1.5s infinite'
    }}>
      <div style={{
        aspectRatio: '16/9',
        background: 'var(--bg-hover)',
      }} />
      <div style={{ padding: '0.75rem' }}>
        <div style={{
          height: '1rem',
          background: 'var(--bg-hover)',
          borderRadius: '4px',
          marginBottom: '0.5rem',
          width: '80%'
        }} />
        <div style={{
          height: '0.8rem',
          background: 'var(--bg-hover)',
          borderRadius: '4px',
          width: '60%'
        }} />
      </div>
    </div>
  );
}