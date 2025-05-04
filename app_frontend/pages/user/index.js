'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const [profileImage, setProfileImage] = useState('/user.png');
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm('คุณต้องการออกจากระบบหรือไม่?');
    if (confirmed) {
      // TODO: ล้าง token หรือข้อมูลผู้ใช้ใน localStorage ถ้ามี
      router.push('/'); // นำไปหน้าแรกหรือหน้า login
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans">
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

      {/* User Info Section */}
      <div className="flex flex-col items-center justify-center px-6 mt-14 text-center">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={profileImage}
            alt="User Profile"
            className="w-50 h-50 rounded-full shadow-lg mb-3 border-4 border-[#E8E8E8] object-cover"
          />
          <label className="cursor-pointer text-sm text-[#40A2E3] hover:underline mt-2 inline-block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            เปลี่ยนรูปโปรไฟล์
          </label>
        </div>

        {/* Username */}
        <h1 className="text-4xl font-bold text-black mt-15 mb-2">ชื่อผู้ใช้</h1>

        {/* Email */}
        <p className="text-lg text-gray-600 mt-4 mb-8">user@example.com</p>

        {/* Saved News Button */}
        <Link href="/saved-news">
          <button className="bg-[#FFD700] text-black text-lg px-6 py-3 rounded-full shadow-md hover:scale-105 transition mb-4">
            ดูข่าวที่บันทึกไว้
          </button>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-[#FF3131] text-black text-lg px-7.5 py-3 rounded-full shadow-md hover:scale-105 transition mt-2"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
