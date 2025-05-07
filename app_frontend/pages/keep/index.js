import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SavedNewsPage() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const mockNews = [
      {
        id: 1,
        title: 'พบคราบเขม่าทะเลอันดามัน',
        content: 'ดูดุกขาม คาดว่ามาจากเรือขนส่ง',
        image: '/news1.jpg'
      },
      {
        id: 2,
        title: 'ปะการังฟอกขาว',
        content: 'อุณหภูมิทะเลสูงผิดปกติ',
        image: '/news2.jpg'
      },
      {
        id: 3,
        title: 'ข่าวน้ำท่วมชายฝั่ง',
        content: 'เรือเสียหายหลายลำ',
        image: '/news3.jpg'
      }
    ];
    setNewsList(mockNews);
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข่าวนี้?');
    if (confirmDelete) {
      setNewsList(prev => prev.filter(news => news.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-12 shadow flex items-center justify-between w-full">
        <Link href="/user">
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
        {newsList.map(news => (
          <div key={news.id} className="flex bg-white rounded-xl shadow-md mb-7 overflow-hidden w-full h-48">
            <img src={news.image} alt={news.title} className="w-48 h-32 object-cover" />
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-lg font-semibold text-black">{news.title}</h2>
                <p className="text-sm text-black">{news.content}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <Link href={`/news/${news.id}`}>
                  <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transform transition-all duration-300 hover:scale-105">
                    Read
                  </button>
                </Link>
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
