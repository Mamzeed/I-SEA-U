import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SavedNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3342/api/saved-news/')
      .then((res) => {
        if (!res.ok) throw new Error('ไม่สามารถโหลดข่าวที่บันทึกได้');
        return res.json();
      })
      .then((data) => setNewsList(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข่าวนี้?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3342/api/saved-news/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'ลบข่าวไม่สำเร็จ');
      }

      setNewsList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReadClick = (saved_at, slug) => {
    const formattedDate = new Date(saved_at).toISOString().split('T')[0]; // yyyy-mm-dd
    router.push(`/news/${formattedDate}/${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-12 shadow flex items-center justify-between w-full">
        <Link href="/profile/null">
          <button className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition">
            &lt; My Profile
          </button>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-80" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-6xl font-bold mb-8 text-black">Keep</h1>

        {loading && <p className="text-center text-gray-600">กำลังโหลดข่าวที่บันทึกไว้...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && newsList.length === 0 && (
          <p className="text-center text-gray-600">คุณยังไม่มีข่าวที่บันทึกไว้</p>
        )}

        <div className="space-y-6">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden transition hover:scale-[1.02] duration-300 cursor-pointer"
              onClick={() => handleReadClick(news.saved_at, news.news_slug)}
            >
              <img
                src={`http://localhost:3342${news.news_image}` || '/no-image.png'}
                alt={news.news_title}
                className="w-full md:w-60 h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-bold text-black mb-1">{news.news_title}</h2>
                  <p className="text-sm text-gray-700 line-clamp-3">{news.news_content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    โดย {news.username} | บันทึกเมื่อ{' '}
                    {new Date(news.saved_at).toLocaleDateString('th-TH')}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadClick(news.saved_at, news.news_slug);
                    }}
                    className="bg-blue-500 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-600 transition"
                  >
                    Read
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(news.id);
                    }}
                    className="bg-red-500 text-white px-4 py-1.5 text-sm rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
