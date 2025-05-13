import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ConservationActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3342/api/conservation-activities/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch activities');
        }
        return res.json();
      })
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching activities:', err);
        setError('ไม่สามารถโหลดกิจกรรมได้ในขณะนี้');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-black">กำลังโหลด...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-[#FFF6E9] min-h-screen font-sans">
      {/* Header */}
      <div className="relative bg-[#40A2E3] text-white px-8 py-8 shadow flex items-center justify-between w-full">
        <Link href="/home">
          <button className="bg-white text-black font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition">
            &lt; Home
          </button>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-50" />
        </div>
      </div>

      {/* Page Title */}
      <div style={{ padding: '20px' }}>
        <h1 className="text-5xl font-bold text-black py-5 ml-10">Marine Conservation Activities</h1>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 mb-6"
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black">{activity.title}</h3>
                <p className="text-gray-600 line-clamp-2">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info Box */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-10">
          <h2 className="text-2xl font-bold text-black mb-4">ติดต่อมูลนิธิอนุรักษ์ท้องทะเล</h2>
          <p className="text-gray-700 mb-2">ชื่อมูลนิธิ: มูลนิธิอนุรักษ์ทะเลไทย</p>
          <p className="text-gray-700 mb-2">โทรศัพท์: 02-123-4567</p>
          <p className="text-gray-700 mb-2">อีเมล: info@thaiseaconservation.org</p>
          <p className="text-gray-700">เว็บไซต์: www.thaiseaconservation.org</p>
        </div>
      </div>
    </div>
  );
}