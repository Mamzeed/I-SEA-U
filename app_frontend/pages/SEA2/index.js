import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SEA2() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt_access'); // อ่าน JWT Token จาก localStorage

    if (!token) {
      setError('คุณต้องเข้าสู่ระบบก่อน');
      setLoading(false);
      router.push('/login'); // เปลี่ยนเส้นทางไปยังหน้าล็อกอินหากไม่มี token
      return;
    }

    fetch('http://localhost:3342/api/news/category/MarineDisaster/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // ส่ง JWT Token ไปใน headers
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch news');
        }
        return res.json();
      })
      .then((data) => {
        setNewsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
        setError('ไม่สามารถโหลดข่าวได้ในขณะนี้');
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="text-black">กำลังโหลด...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!newsList || newsList.length === 0) return <p className="text-black">ไม่มีข่าวที่จะแสดง</p>;

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-12 shadow flex items-center justify-between w-full">
        <button
          onClick={() => window.history.back()}
          className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          &lt; Home
        </button>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-80" />
        </div>
      </div>

      {/* ข่าวย่อย */}
      <div className="px-6 mt-12">
        <h1 className="text-6xl font-bold text-black mb-6">Marine Disaster</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition duration-300 hover:scale-[1.02] flex flex-col"
            >
              <img
                src={item.image}
                alt={item.title || 'ไม่มีชื่อข่าว'}
                className="w-full h-48 object-cover rounded-xl mb-4 shadow-sm"
              />
              <h3 className="text-xl font-semibold text-[#333] mb-2">{item.title}</h3>
              <p className="text-gray-700 text-sm mb-3 line-clamp-3">{item.content}</p>

              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>by {item.author.username}</span>
                <span>{new Date(item.created_at).toLocaleDateString('th-TH')}</span>
              </div>

              <div className="flex gap-3 text-xs text-gray-600 mb-4">
                <span>Like {item.likes_count}</span>
                <span>Comment {item.comments_count}</span>
                <span>Seen {item.views}</span>
              </div>

              <Link href={`/news/${item.created_at.slice(0, 10)}/${item.slug}`} className="mt-auto">
                <button className="bg-[#40A2E3] text-white w-full py-2 rounded-lg shadow hover:scale-105 transition duration-300">
                  Read
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
