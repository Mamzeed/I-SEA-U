import React, { useState, useEffect } from 'react'; // React import ที่ถูกต้อง

const NewsDetailPage = ({ date, slug }) => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // สมมติว่า fetch ข้อมูลข่าวจาก API หรือ server
        const response = await fetch(`/api/news/${date}/${slug}`);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [date, slug]);

  if (loading) return <div>กำลังโหลด...</div>;
  if (!news) return <div>ไม่พบข่าวนี้</div>;

  return (
    <div>
      <h1>{news.title}</h1>
      <p>{news.content}</p>
      {/* อื่นๆ */}
    </div>
  );
};

export default NewsDetailPage;
