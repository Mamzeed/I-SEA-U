import Link from 'next/link';

export default function SeaDangers() {
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
      
      {/* Page Title */}
      <div style={{ padding: '20px' }}>
        <h1 className="text-5xl font-bold text-black py-5 ml-10">สิ่งแวดล้อมทางทะเล</h1>

        {/* News Cards */}
        {[1, 2, 3].map((num) => (
          <div key={num} className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 mb-6">
            <img src={`/news${num}.jpg`} alt={`ข่าว ${num}`} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-black">{`หัวข้อข่าว ${num}`}</h3>
              <p className="text-gray-600">รายละเอียดสั้น ๆ ของข่าวนี้...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

