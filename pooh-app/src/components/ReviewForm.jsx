import { useState } from 'react';

function ReviewForm({ movieTitle }) {
  const [review, setReview] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');  // 'typing' | 'submitting' | 'success'

  // สถานะ "สำเร็จ" หน้าตาต่างจากที่เหลือทั้งหมด จึง return ออกก่อนเลย
  if (status === 'success') {
    return <p className="text-green-600 font-semibold">ขอบคุณสำหรับรีวิว {movieTitle} 🎉</p>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitReview(review);   // รอ server (วันนี้จำลองไว้ สัปดาห์หน้าเป็น fetch จริง)
      setStatus('success');
    } catch (err) {
      setStatus('typing');          // กลับไปให้แก้ต่อได้
      setError(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-bold">รีวิว {movieTitle}</h3>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        disabled={status === 'submitting'}
        placeholder="ดูแล้วรู้สึกอย่างไร..."
        className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
      />
      <button
        type="submit"
        disabled={review.length === 0 || status === 'submitting'}
        className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white
                   disabled:cursor-not-allowed disabled:bg-slate-300">
        {status === 'submitting' ? 'กำลังส่ง...' : 'ส่งรีวิว'}
      </button>
      {error !== null && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </form>
  );
}

// จำลอง server: รอ 1.5 วินาที ถ้ารีวิวสั้นกว่า 10 ตัวอักษรให้ตอบกลับเป็น error
function submitReview(text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (text.trim().length < 10) {
        reject(new Error('รีวิวสั้นเกินไป ลองเขียนอีกนิด'));
      } else {
        resolve();
      }
    }, 1500);
  });
}

export default ReviewForm;