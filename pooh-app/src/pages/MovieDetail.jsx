import { useParams, Link } from 'react-router-dom';
import { movies } from '../data/data';

function MovieDetail() {
  const { id } = useParams();                       // อ่านค่าจาก URL (ได้เป็น string!)
  const movie = movies.find(m => m.id === Number(id));

  if (!movie) {
    return <p className="p-8 text-center text-slate-500">ไม่พบหนังเรื่องนี้ 😢</p>;
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-3xl font-bold text-slate-800">{movie.title}</h1>
      <p className="mt-1 text-slate-500">ปี {movie.year} · {movie.genre}</p>
      <p className="mt-4 leading-relaxed text-slate-700">{movie.detail}</p>
      <Link to="/movies"
            className="mt-6 inline-block rounded-lg bg-cyan-600 px-4 py-2
                       font-semibold text-white hover:bg-cyan-700 transition">
        ← กลับไปหน้าหนังทั้งหมด
      </Link>
    </div>
  );
}

export default MovieDetail;