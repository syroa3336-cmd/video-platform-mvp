import slugify from 'slugify';

export function createSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'tr',
    remove: /[*+~.()'"!:@]/g
  });
}

export async function generateUniqueSlug(db, title, attempt = 0) {
  let baseSlug = createSlug(title);
  if (attempt > 0) baseSlug = `${baseSlug}-${attempt}`;
  const existing = await db.get('SELECT id FROM videos WHERE slug = ?', baseSlug);
  if (existing) return generateUniqueSlug(db, title, attempt + 1);
  return baseSlug;
}