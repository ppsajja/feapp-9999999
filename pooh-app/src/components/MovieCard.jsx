import { useState } from 'react';   // 1. import จาก react

function MovieCard({ title, year }) {
  const [likes, setLikes] = useState(0);   // 2. ประกาศ state

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-bold">{title} ({year})</h3>
      <button
        onClick={() => setLikes(likes + 1)}   // 3. เปลี่ยนค่าผ่าน setLikes
        className="mt-3 rounded-lg bg-pink-100 px-4 py-2 text-pink-700
                   font-semibold hover:bg-pink-200 transition">
        ❤️ {likes}
      </button>
    </div>
  );
}

export default MovieCard;