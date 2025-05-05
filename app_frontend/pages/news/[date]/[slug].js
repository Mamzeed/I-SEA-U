import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NewsDetailPage() {
  const router = useRouter();
  const { slug } = router.query; // ดึง slug จาก URL

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
    const user = localStorage.getItem('user'); // หรือวิธีที่ใช้เก็บข้อมูลผู้ใช้
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    if (slug) {
      // ดึงข้อมูลข่าวจาก API
      fetch(`http://localhost:3342/api/news/${slug}/`)
        .then((res) => res.json())
        .then((data) => {
          setNews(data);
          setLiked(data.is_liked); // กำหนดสถานะไลค์
          setBookmarked(data.is_saved); // กำหนดสถานะบุ๊กมาร์ก
          setComments(data.comments); // ดึงคอมเมนต์
          setLoading(false);
        })
        .catch((err) => {
          console.error('โหลดข่าวล้มเหลว:', err);
          setLoading(false);
        });
    }
  }, [slug]);

  const toggleLike = () => {
    if (!user) return; // หากยังไม่ได้ล็อกอิน
    setLiked(!liked);
    // สามารถส่งคำขอไปยัง API เพื่อบันทึกสถานะไลค์ที่นี่
  };

  const toggleBookmark = () => {
    if (!user) return; // หากยังไม่ได้ล็อกอิน
    setBookmarked(!bookmarked);
    // สามารถส่งคำขอไปยัง API เพื่อบันทึกสถานะบุ๊กมาร์กที่นี่
  };

  const handleAddComment = () => {
    if (commentText.trim() === '') return;
    if (!user) {
      alert('กรุณาล็อกอินก่อนแสดงความคิดเห็น');
      return;
    }

    const newComment = {
      id: comments.length + 1,
      user: user.username, // ใช้ username ของผู้ใช้ที่ล็อกอิน
      text: commentText.trim(),
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    // สามารถส่งคอมเมนต์ไปยัง API ที่ Backend ได้ที่นี่
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  if (loading) return <div className="p-6 text-center text-black">กำลังโหลด...</div>;
  if (!news) return <div className="p-6 text-center text-red-600">ไม่พบข่าวนี้</div>;

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
          <span>โดย {news.author?.username || 'ไม่ทราบผู้เขียน'}</span>
          <span>{new Date(news.created_at).toLocaleDateString('th-TH')}</span>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={toggleLike} className="text-2xl hover:scale-110 transition">
              {liked ? '❤️' : '👍'}
            </button>
            <button onClick={toggleBookmark} className="text-2xl hover:scale-110 transition">
              {bookmarked ? '📌' : '🔖'}
            </button>
            <p className="ml-2 text-black">ความคิดเห็น ({comments?.length || 0})</p>
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

          {/* Comment List */}
        <div className="space-y-4">
            {comments?.length > 0 ? (
                comments.map((comment) => (
                <div key={comment.id} className="bg-gray-100 rounded-xl p-4 shadow mb-3">
                    <p className="font-semibold text-black">{comment.user}</p>
                    <p className="text-gray-700">{comment.text}</p>
                </div>
                ))
            ) : (
                <p className="text-black">ยังไม่มีความคิดเห็น</p>
            )}
        </div>
        </div>
      </div>
    </div>
  );
}
