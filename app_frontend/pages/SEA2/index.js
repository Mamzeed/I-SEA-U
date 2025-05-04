import Link from 'next/link';

export default function SeaDangers() {
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#FFF6E9', minHeight: '100vh' }}>
      
      {/* Header */}
      <div
        style={{
            backgroundColor: '#40A2E3',
            padding: '5px',  // เพิ่มขนาด padding เป็น 10px หรือค่าที่เหมาะสม
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}
>
        {/* ปุ่มชิดซ้าย */}
        <div style={{ position: 'absolute', left: '30px' }}>
          <a href="/home">
            <button className="py-2 px-4 bg-white text-black font-bold rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1">
              ← หน้าหลัก
            </button>
          </a>
        </div>

        {/* โลโก้ตรงกลาง */}
        <img src="/logoiseau_w.png" alt="Logo" style={{ height: '160px' }} />
      </div>

      {/* Page Title */}
      <div style={{ padding: '20px' }}>
        <h1 className="text-5xl font-bold text-black py-5 ml-10">ภัยพิบัติทางทะเล</h1>

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

