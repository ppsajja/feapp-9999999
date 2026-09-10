// make-data.mjs
// สร้างไฟล์ src/data.js ของ movie-site จาก TMDB โดยอัตโนมัติ (มี poster URL ให้เลย)
// วิธีใช้ (ต้องมี Node 18 ขึ้นไป เช็กด้วย  node -v):
//   node make-data.mjs ใส่คีย์ตรงนี้
//TMDB_KEY = 'bf8bebf667f4cfdadb854179c9630d1f'; // ใส่คีย์ของคุณตรงนี้ หรือใช้ environment
// ผลลัพธ์: ไฟล์ data.js ในโฟลเดอร์เดียวกัน คัดลอกไปทับ src/data.js ได้เลย

const KEY = process.argv[2] || process.env.TMDB_KEY;
if (!KEY) {
  console.error('ยังไม่ได้ใส่คีย์ ใช้แบบนี้:  node make-data.mjs ใส่คีย์ตรงนี้');
  process.exit(1);
}

// รายชื่อหนัง 10 เรื่อง
// ถ้ารู้ tmdbId (ตัวเลขใน URL ของหน้าหนังบน themoviedb.org) ให้ใส่ไว้ จะแม่นที่สุด
// ถ้าไม่รู้ ใส่แค่ title + year สคริปต์จะค้นหาให้
const WANTED = [
  { tmdbId: 157336,  title: 'Interstellar',                year: 2014 },
  { tmdbId: 372058,  title: 'Your Name',                   year: 2016 },
  { tmdbId: 496243,  title: 'Parasite',                    year: 2019 },
  { tmdbId: 438631,  title: 'Dune',                        year: 2021 },
  { tmdbId: 533535,  title: 'Deadpool & Wolverine',        year: 2024 },
  { tmdbId: 83533,   title: 'Avatar: Fire and Ash',        year: 2025 },
  { tmdbId: 1228710, title: 'The Mandalorian and Grogu',   year: 2026 },
  { tmdbId: 969681,  title: 'Spider-Man: Brand New Day',   year: 2026 },
  { tmdbId: 1368337, title: 'The Odyssey',                 year: 2026 },
  { tmdbId: 1386315, title: 'The Runner',                  year: 2026 },
];

const API = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w342';

async function getJSON(path, params = {}) {
  const url = new URL(API + path);
  url.searchParams.set('api_key', KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ตอบ ${res.status} สำหรับ ${path}`);
  return res.json();
}

// หา id ของหนัง: ใช้ tmdbId ถ้ามีและตรงกับปีที่คาดไว้ ไม่งั้นค้นด้วยชื่อ + ปี
async function resolveId(w) {
  if (w.tmdbId) {
    try {
      const m = await getJSON(`/movie/${w.tmdbId}`, { language: 'en-US' });
      const y = Number((m.release_date || '').slice(0, 4));
      if (!y || Math.abs(y - w.year) <= 1) return m.id;
      console.warn(`⚠️  id ${w.tmdbId} คือ "${m.title}" (${y}) ไม่ตรงกับ ${w.title} (${w.year}) ขอค้นหาใหม่`);
    } catch (e) {
      console.warn(`⚠️  ใช้ id ${w.tmdbId} ไม่ได้ (${e.message}) ขอค้นหาใหม่`);
    }
  }
  const s = await getJSON('/search/movie', { query: w.title, year: w.year, language: 'en-US' });
  const hit = s.results[0];
  if (!hit) throw new Error(`ไม่พบหนัง: ${w.title} (${w.year})`);
  return hit.id;
}

const movies = [];
let id = 1;

for (const w of WANTED) {
  const tmdbId = await resolveId(w);
  // ดึง 2 ภาษา: อังกฤษเอาชื่อสากล ไทยเอาชื่อไทยกับเรื่องย่อ
  const en = await getJSON(`/movie/${tmdbId}`, { language: 'en-US' });
  const th = await getJSON(`/movie/${tmdbId}`, { language: 'th-TH' });

  const year = Number((en.release_date || `${w.year}`).slice(0, 4));
  const released = en.release_date && new Date(en.release_date) <= new Date();

  movies.push({
    id: id++,
    tmdbId,
    title: en.title,                                   // ชื่ออังกฤษ
    titleTh: th.title !== en.title ? th.title : null,  // ชื่อไทย (ถ้า TMDB มี)
    genre: en.genres?.[0]?.name || 'Unknown',
    year,
    rating: released ? Math.round((en.vote_average || 0) * 10) / 10 : null, // หนังยังไม่ฉาย = null
    detail: (th.overview || en.overview || '').trim() || 'ยังไม่มีเรื่องย่อ',
    poster: en.poster_path ? `${IMG}${en.poster_path}` : null,
  });

  console.log(`✅ ${en.title} (${year})  ${en.poster_path ?? 'ไม่มีโปสเตอร์!'}`);
}

const out =
  '// สร้างอัตโนมัติจาก TMDB ด้วย make-data.mjs\n' +
  '// This product uses the TMDB API but is not endorsed or certified by TMDB.\n' +
  'export const movies = ' + JSON.stringify(movies, null, 2) + ';\n';

await import('node:fs/promises').then(fs => fs.writeFile('data.js', out, 'utf8'));
console.log('\nเขียนไฟล์ data.js เรียบร้อย (' + movies.length + ' เรื่อง)');
