import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SeaDangers() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3342/api/news/category/สิ่งแวดล้อมทางทะเล/')
      .then((res) => res.json())
      .then((data) => {
        setNewsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
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
        <h1 className="text-5xl font-bold text-black py-5">สิ่งแวดล้อมทางทะเล</h1>

        {loading ? (
          <p className="text-black">กำลังโหลด...</p>
        ) : newsList && newsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news) => (
              <Link key={news.slug} href={`/news/${news.slug}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 cursor-pointer">
                  <img
                    src={`http://localhost:3342${news.image}`}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-black">{news.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{news.content}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-black">ไม่มีข่าวที่จะแสดง</p>
        )}
      </div>
    </div>
  );
}
