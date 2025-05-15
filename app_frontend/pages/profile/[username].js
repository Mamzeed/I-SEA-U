import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!router.isReady || !username) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwt_access');
        if (!token) throw new Error('ไม่พบ token ใน localStorage');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public-profile/${username}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('ไม่พบข้อมูลโปรไฟล์หรือเกิดข้อผิดพลาดในการโหลด');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router.isReady, username]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_access');
    router.push('/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('jwt_access');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    const formData = new FormData();
    formData.append('profile_image', file);
    formData.append('username', username);

    try {
      setUploading(true);

      const res = await fetch(`${API_URL}/api/upload-profile-image/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ');

      const updated = await res.json();
      setProfile((prev) => ({ ...prev, profile_image: updated.profile_image }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('ไม่สามารถอัปโหลดรูปได้');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center mt-10">ไม่พบข้อมูลโปรไฟล์</div>;

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-12 shadow flex items-center justify-between w-full">
        <button
          onClick={() => router.push('/home')}
          className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          &lt; Home
        </button>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-80" />
        </div>
      </div>

      <main className="flex flex-col items-center justify-center px-6 mt-12">
        {/* Profile Section */}
        <div className="w-[600px] min-h-[400px] bg-white rounded-xl shadow-lg p-8 text-center">

          <div
            className="relative group cursor-pointer flex flex-col items-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={profile.profile_image}
              alt="User Profile"
              className="w-40 h-40 rounded-full shadow mb-2 border-4 border-[#E8E8E8] object-cover mt-2"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-4 group-hover:underline">
              คลิกเพื่อเปลี่ยนรูป
            </p>
            {uploading && <p className="text-blue-500 mt-2">กำลังอัปโหลด...</p>}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-black mt-8">
            {profile.username}
          </h1>

          {profile.email && (
            <p className="text-md text-gray-600 mt-3 break-words">{profile.email}</p>
          )}
          {profile.phone && (
            <p className="text-md text-gray-600 mt-1">{profile.phone}</p>
          )}
          {profile.address && (
            <p className="text-md text-gray-600 mt-1">{profile.address}</p>
          )}
  
          </div>
        {/* Button Section */}
          <Link href="/keep" passHref legacyBehavior>
            <a className="block bg-[#FFDF7E] text-black text-lg px-6 py-3 rounded-full shadow-md w-48 text-center hover:scale-105 transition mt-6">
              Keep
            </a>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-[#FF7A7A] text-black text-lg px-6 py-3 rounded-full shadow-md w-48 hover:scale-105 transition mt-6"
          >
            Log Out
          </button>

      </main>
    </div>
  );
}