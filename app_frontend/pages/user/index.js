'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState('/user.png');
  const [uploading, setUploading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_access');
    if (!token) {
      router.push('/login');
      return;
    }
  
    setLoadingUser(true);
    fetch('http://localhost:3342/api/me/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          router.push('/login');
        } else {
          setUser({ ...data, token });
          if (data.profile_image) {
            setProfileImage(`http://localhost:3342${data.profile_image}`);
          }
        }
      })
      .catch(() => {
        alert('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
        router.push('/login');
      })
      .finally(() => setLoadingUser(false));
  }, [router]);
  

  // อัปโหลดรูปขึ้น server
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์ภาพเท่านั้น');
      return;
    }

    const form = new FormData();
    form.append('profile_image', file);

    setUploading(true);
    try {
      const res = await fetch('http://localhost:3342/api/customer/', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Upload failed');
      }

      const updated = await res.json();
      setProfileImage(`http://localhost:3342${updated.profile_image}`);
      alert('อัปโหลดรูปโปรไฟล์สำเร็จ');
    } catch (err) {
      console.error(err);
      alert('อัปโหลดรูปโปรไฟล์ล้มเหลว');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (loadingUser) {
    return <div className="p-6 text-center text-gray-700">กำลังโหลดข้อมูลผู้ใช้...</div>;
  }

  if (!user) {
    return null; // ถ้าไม่มี user จะ redirect แล้ว
  }

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-6 shadow flex items-center justify-between">
        <Link href="/home">
          <button className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition">
            &lt; หน้าหลัก
          </button>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-40" />
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center px-6 mt-12">
        <div className="relative">
          <img
            src={profileImage}
            alt="User Profile"
            className="w-40 h-40 rounded-full shadow-lg mb-3 border-4 border-[#E8E8E8] object-cover"
          />
          <label className="cursor-pointer text-sm text-[#40A2E3] hover:underline block">
            {uploading ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูปโปรไฟล์'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <h1 className="text-3xl font-bold text-black mt-4">{user.username}</h1>
        <p className="text-lg text-gray-600 mt-2">{user.email}</p>

        <Link href="/saved-news">
          <button className="bg-[#FFD700] text-black text-lg px-6 py-3 rounded-full shadow-md hover:scale-105 transition mt-6">
            ดูข่าวที่บันทึกไว้
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-[#FF3131] text-black text-lg px-6 py-3 rounded-full shadow-md hover:scale-105 transition mt-4"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
