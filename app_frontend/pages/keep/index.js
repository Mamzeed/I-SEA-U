import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SavedNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // ดึงข่าวที่บันทึกไว้จาก backend
  useEffect(() => {
    fetch(`${API_URL}/api/saved-news/`)
      .then((res) => {
        if (!res.ok) throw new Error('ไม่สามารถโหลดข่าวที่บันทึกได้');
        return res.json();
      })
      .then((data) => setNewsList(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ฟังก์ชันลบข่าวจาก backend
  const handleDelete = async (id) => {
    const confirmDelete = confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข่าวนี้?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/saved-news/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'ลบข่าวไม่สำเร็จ');
      }

      // ลบข่าวออกจาก state ใน frontend
      setNewsList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ฟังก์ชันนำทางไปหน้าอ่านข่าว
  const handleReadClick = (saved_at, slug) => {
    const formattedDate = new Date(saved_at).toLocaleDateString('en-CA'); // yyyy-mm-dd
    router.push(`/news/${formattedDate}/${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-12 shadow flex items-center justify-between w-full">
        <Link href="/profile/null">
          <button className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition">
            My Profile
          </button>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-80" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-6xl font-bold mb-6 text-black">Keep</h1>

        {loading && <p className="text-center text-gray-600">กำลังโหลดข่าวที่บันทึกไว้...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && newsList.length === 0 && (
          <p className="text-center text-gray-600">คุณยังไม่มีข่าวที่บันทึกไว้</p>
        )}

        {newsList.map((news) => (
          <div
            key={news.id}
            className="flex bg-white rounded-xl shadow-md mb-7 overflow-hidden w-full h-48"
          >
            <img
              src={news.news_image}
              alt={news.news_title}
              className="w-48 h-32 object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-lg font-semibold text-black">{news.news_title}</h2>
                <p className="text-sm text-black line-clamp-2">{news.news_content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  โดย {news.username} | บันทึกเมื่อ{' '}
                  {new Date(news.saved_at).toLocaleDateString('th-TH')}
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleReadClick(news.saved_at, news.news_slug)}
                  className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transform transition-all duration-300 hover:scale-105"
                >
                  Read
                </button>
                <button
                  onClick={() => handleDelete(news.id)}
                  className="bg-red-500 text-white px-3 py-1 text-sm rounded transform transition-all duration-300 hover:scale-105 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
