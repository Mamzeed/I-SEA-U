import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SEA2() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3342/api/news/category/อาชญากรรมทางทะเล/')
      .then((res) => res.json())
      .then((data) => setNewsList(data))
      .catch((err) => console.error('Error fetching SEA2 news:', err));
  }, []);

  return (
    <div className="bg-[#FFF6E9] min-h-screen font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-8 shadow flex items-center justify-between w-full">
        <Link href="/home">
          <button className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition">
            &lt; หน้าหลัก
          </button>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-40" />
        </div>
      </div>

      {/* Page Title */}
      <div className="p-6">
        <h1 className="text-5xl font-bold text-black py-5">ภัยพิบัติทางทะเล</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <Link key={news.slug} href={`/news/${news.slug}`}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 hover:-translate-y-1 cursor-pointer">
                <img
                  src={`http://localhost:3342${news.image}`}
                  className="w-full h-48 object-cover"
                  alt={news.title}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-black">{news.title}</h3>
                  <p className="text-gray-600">{news.content.substring(0, 80)}...</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
