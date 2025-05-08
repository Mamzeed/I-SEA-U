import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function NewsDetailPage() {
  const router = useRouter();
  const { date, slug } = router.query;

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && date && slug) {
      console.log('Date:', date); // ตรวจสอบค่า date
      console.log('Slug:', slug); // ตรวจสอบค่า slug
      fetch(`http://localhost:3342/api/news/${date}/${slug}/`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched Data:', data); // ตรวจสอบข้อมูลที่ได้จาก API
          setNews(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching news:', err);
          setLoading(false);
        });
    }
  }, [router.isReady, date, slug]);

  if (!router.isReady || loading) return <div>กำลังโหลด...</div>;
  if (!news) return <div>ไม่พบข่าวนี้</div>;

  return (
    <div className="bg-[#FFF6E9] min-h-screen font-sans">
      <div className="p-6 space-y-10 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-black ">{news.title}</h1>
        <img
          src={`http://localhost:3342${news.image}`}
          alt={news.title}
          className="rounded-xl w-full object-cover h-[400px]"
        />
        <p className="text-gray-800 text-lg leading-relaxed">{news.content}</p>
        <p className="text-gray-600 text-sm">Tags: {news.tags}</p>
        <p className="text-gray-600 text-sm">{news.additional_info}</p>
      </div>
    </div>
  );
}