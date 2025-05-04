'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function NewsDetail() {
  // State for like and bookmark
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // State for comment form and list (เริ่มต้นเป็นอาร์เรย์ว่าง)
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]); // ไม่มีความคิดเห็นเริ่มต้น

  // Handlers for like and bookmark
  const toggleLike = () => setLiked(!liked);
  const toggleBookmark = () => setBookmarked(!bookmarked);

  // Handler for adding comment
  const handleAddComment = () => {
    if (commentText.trim() === '') return;

    const newComment = {
      id: comments.length + 1,
      user: 'User name', // You can replace this with the actual user name
      text: commentText.trim(),
    };

    setComments([newComment, ...comments]);
    setCommentText(''); // Clear comment text after submission
  };

  // Handler for Enter key to submit comment
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

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
          <img src="/logoiseau_w.png" alt="Logo" className="w-50" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-10">
        <h1 className="text-5xl font-bold text-black py-5 ml-10">ชื่อหัวข้อข่าว</h1>

        {/* News Content Box */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-80 flex flex-col md:flex-row gap-6">
          {/* News Image */}
          <div className="md:w-1/3">
            <img src="/news1.jpg" alt="ข่าว" className="rounded-xl w-full object-cover" />
          </div>

          {/* Main Content */}
          <div className="md:w-2/3">
            <h3 className="text-lg font-semibold mb-2 text-black">เนื้อหาข่าว</h3>
            <p className="text-black">
              (ใส่เนื้อหาข่าวตรงนี้)
            </p>
          </div>
        </div>

        {/* Comments Section in White Box */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={toggleLike} className="text-2xl hover:scale-110 transition">
              {liked ? '❤️' : '👍'}
            </button>
            <button onClick={toggleBookmark} className="text-2xl hover:scale-110 transition">
              {bookmarked ? '📌' : '🔖'}
            </button>
            <p className="ml-2 text-black">ความคิดเห็น ({comments.length})</p>
          </div>

          {/* Comment Form with Flexbox to align the button */}
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
              send
            </button>
          </div>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
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
