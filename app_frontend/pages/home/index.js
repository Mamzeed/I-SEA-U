'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3342/api/news/')
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error('โหลดข่าวล้มเหลว:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-8 shadow flex items-center justify-between w-full">
        <Link href="/user">
          <button className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition">
            โปรไฟล์ของฉัน
          </button>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-40" />
        </div>
      </div>

      {/* News List */}
      <div className="px-6 mt-10">
        <h1 className="text-3xl font-bold text-center mb-6">ข่าวล่าสุด</h1>

        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md mb-8 p-4 transition hover:scale-[1.01]"
          >
            <img
              src={item.image}  // ใช้ item.image แทน news.image
              alt={item.title}
              className="w-full h-64 object-cover rounded-xl"
            />
            <h2 className="text-2xl font-bold text-[#333] mb-2">{item.title}</h2>
            <p className="text-gray-700 mb-2 line-clamp-3">{item.content}</p>

            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <div>
                โดย <span className="font-semibold">{item.author.username}</span>
              </div>
              <div>{new Date(item.created_at).toLocaleDateString('th-TH')}</div>
            </div>

            <div className="flex gap-6 text-sm text-gray-600 mt-3">
              <span>❤️ {item.likes_count}</span>
              <span>💬 {item.comments_count}</span>
              <span>👁️ {item.views}</span>
            </div>

            <Link
              href={`/news/${item.created_at.slice(0, 10)}/${item.slug}`}
              className="inline-block mt-4"
            >
              <button className="bg-[#40A2E3] text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition">
                อ่านเพิ่มเติม
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
