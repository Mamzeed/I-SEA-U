'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';



export default function HomePage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);  // ใช้สถานะในการแสดงการโหลด
  const [error, setError] = useState(null); // สถานะสำหรับข้อผิดพลาด
  const [isAuthenticated, setIsAuthenticated] = useState(false); // สถานะสำหรับการตรวจสอบ token

  useEffect(() => {
    // ตรวจสอบว่า user ได้ล็อกอินหรือยัง
    const token = localStorage.getItem('jwt_access');
    if (token) {
      setIsAuthenticated(true);
    }

    // ดึงข้อมูลข่าว
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/news/`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('โหลดข่าวล้มเหลว:', err);
        setError('ไม่สามารถโหลดข่าวได้ในขณะนี้');
        setLoading(false);
      });
  }, []);

  const handleMyProfile = () => {
    const username = localStorage.getItem('username');
    if (username) {
      router.push(`/profile/${username}`);
    } else {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>กำลังโหลดข่าว...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>ไม่มีข่าวในตอนนี้</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-12 shadow flex items-center justify-between w-full">
        <Link href={isAuthenticated ? `/profile/${localStorage.getItem('username')}` : "/login"}>
          <button className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition">
            My Profile
          </button>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-80" />
        </div>
      </div>

      {/* ปุ่มหมวดหมู่ข่าว */}
      <div className="flex flex-wrap justify-center gap-6 mt-8 px-6">
        {[{ href: "/SEA1", label: "Marine Environment" },
          { href: "/SEA2", label: "Marine Disaster" },
          { href: "/SEA3", label: "Maritime Crime" },
          { href: "/SAVE_SEA", label: "Marine Conservation Activities" }
        ].map(({ href, label }) => (
          <Link key={label} href={href}>
            <button className="bg-white text-black px-6 py-3 rounded-full shadow transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 text-xl">
              {label}
            </button>
          </Link>
        ))}
      </div>

      {/* เนื้อหาข่าว */}
      <div className="px-6 mt-12">
        {/* ข่าวหลัก */}
        <div
          key={news[0].id}
          className="bg-white rounded-2xl shadow-lg mb-12 p-6 transition hover:scale-[1.01] flex flex-col md:flex-row gap-8"
        >
          <img
            src={news[0].image}
            alt={news[0].title}
            className="w-full md:w-96 h-80 object-cover rounded-xl shadow-sm"
          />
          <div className="flex flex-col justify-between w-full">
            <div>
              <h2 className="text-3xl font-extrabold text-[#222] mb-4 leading-snug">{news[0].title}</h2>
              <p className="text-gray-700 mb-4 text-base leading-relaxed line-clamp-4">{news[0].content}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <div>
                by <span className="font-semibold text-black">{news[0].author.username}</span>
              </div>
              <div>{new Date(news[0].created_at).toLocaleDateString('th-TH')}</div>
            </div>
            <div className="flex gap-6 text-sm text-gray-600 mb-4">
              <span>Like {news[0].likes_count}</span>
              <span>Comment {news[0].comments_count}</span>
              <span>Seen {news[0].views}</span>
            </div>
            <Link href={`/news/${news[0].created_at.slice(0, 10)}/${news[0].slug}`}>
              <button className="bg-[#40A2E3] text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition duration-300">
                Read
              </button>
            </Link>
          </div>
        </div>

        {/* ข่าวอื่นๆ 3 ข่าวย่อย */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.slice(1, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition duration-300 hover:scale-[1.02] flex flex-col"
            >
              <img
                src={item.image}
                alt={item.title}
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