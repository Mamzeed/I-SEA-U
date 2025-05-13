import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || !username) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwt_access');
        if (!token) throw new Error('ไม่พบ token ใน localStorage');

        const res = await fetch(`http://localhost:3342/api/public-profile/${username}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('jwt_access'); // ลบ access token
    router.push('/login'); // เปลี่ยนไปหน้า login
  };

  if (loading) return <div className="text-center mt-10 text-lg">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center mt-10">ไม่พบข้อมูลโปรไฟล์</div>;

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
      <div className="relative bg-[#40A2E3] text-white px-8 py-12 shadow flex items-center justify-between w-full">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-80" />
        </div>
      </div>

      <div className="flex flex-col items-center px-6 mt-12">
        <div className="relative">
          <img
            src={profile.profile_image}
            alt="User Profile"
            className="w-40 h-40 rounded-full shadow-lg mb-3 border-4 border-[#E8E8E8] object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold text-black mt-4">{profile.username}</h1>
        {profile.email && <p className="text-lg text-gray-600 mt-2">{profile.email}</p>}
        {profile.phone && <p className="text-lg text-gray-600 mt-2">{profile.phone}</p>}
        {profile.address && <p className="text-lg text-gray-600 mt-2">{profile.address}</p>}
      </div>

      <div className="flex flex-col items-center mt-6 space-y-4">
        <Link href="/keep">
          <button className="bg-[#FFD700] text-black text-lg px-6 py-3 rounded-full shadow-md hover:scale-105 transition">
            ดูข่าวที่บันทึกไว้
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-[#FF3131] text-black text-lg px-6 py-3 rounded-full shadow-md hover:scale-105 transition"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
