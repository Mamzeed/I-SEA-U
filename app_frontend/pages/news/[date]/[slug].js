import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NewsDetailPage() {
  const router = useRouter();
  const { date, slug } = router.query;

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (router.isReady && date && slug) {
      fetch(`http://localhost:3342/api/news/${date}/${slug}/`)
        .then((res) => res.json())
        .then((data) => {
          setNews(data);
          if (Array.isArray(data.comments)) {
            setComments(data.comments);
          } else {
            setComments([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching news:', err);
          setLoading(false);
        });
    }
  }, [router.isReady, date, slug]);

  const toggleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3342/api/news/like/${slug}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data && data.liked !== undefined) {
        setLiked(data.liked);
      } else {
        console.error("ข้อมูลที่ส่งกลับจาก API ไม่ถูกต้อง");
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // ฟังก์ชันสำหรับการบันทึกข่าว
  const handleSaveNews = async () => {
    if (!news || !news.id) {
      alert("เกิดข้อผิดพลาด: ข่าวนี้ไม่มี ID");
      return;
    }

    try {
      const res = await fetch('http://localhost:3342/api/saved-news/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ news_id: news.id }),
      });

      if (res.ok) {
        router.push('/keep');
      } else {
        const data = await res.json();
        alert(`เกิดข้อผิดพลาด: ${data.error || "ไม่สามารถบันทึกข่าวได้"}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      alert("เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        user: 'คุณ', // สามารถแก้ไขตามชื่อผู้ใช้งานจริง
        text: commentText,
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddComment();
  };

  if (loading) return <div>กำลังโหลด...</div>;
  if (!news) return <div>ไม่พบข่าวนี้</div>;

  return (
    <div className="bg-[#FFF6E9] min-h-screen font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-12 shadow flex items-center justify-between w-full">
        <Link href="/home">
          <button className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition">
            &lt; Home
          </button>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-80" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-10 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-black">{news.title}</h1>
        <img
          src={`http://localhost:3342${news.image}`}
          alt={news.title}
          className="rounded-xl w-full object-cover h-[400px]"
        />
        <p className="text-gray-800 text-lg leading-relaxed">{news.content}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>โดย {news.author || 'ไม่ทราบผู้เขียน'}</span>
          <span>{new Date(news.created_at).toLocaleDateString('th-TH')}</span>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={toggleLike} 
              className={`text-2xl hover:scale-110 transition font-bold ${liked ? 'text-red-600' : 'text-gray-500'}`} 
            >
              {liked ? '❤️' : '🤍'}
            </button>

            <button onClick={handleSaveNews} className="text-2xl hover:scale-110 transition">
              📥 {/* ปุ่มบันทึกข่าว */}
            </button>
            <p className="ml-2 text-black">ความคิดเห็น ({comments ? comments.length : 0})</p>
          </div>

          {/* Comment Form */}
          <div className="flex items-center mb-6 space-x-4">
            <input
              type="text"
              placeholder="แสดงความคิดเห็นที่นี่"
              className="w-full p-3 rounded-full border border-gray-300 shadow text-black"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleAddComment}
              className="bg-[#40A2E3] text-white px-6 py-3 rounded-full shadow hover:scale-105 transition"
            >
              ส่ง
            </button>
          </div>

          {/* แสดงความคิดเห็น */}
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 rounded-xl p-4 shadow mb-3 flex items-start gap-4">
                <img
                  src={comment.profile || '/default-profile.png'}
                  alt="User profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-black">{comment.user}</p>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black">ยังไม่มีความคิดเห็น</p>
          )}
        </div>
      </div>
    </div>
  );
}
