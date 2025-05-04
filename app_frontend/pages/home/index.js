/*หน้า homepage*/
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF6E9]">
      <header className="relative bg-[#40A2E3] text-white px-7 py-8 shadow flex items-center justify-between w-full">
        {/* โลโก้ตรงกลางแบบ absolute */}
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/logoiseau_w.png" alt="Logo" className="w-50" />
        </div>

        {/* รูป user ชิดขวา พร้อมลิงก์ไปยังหน้าผู้ใช้ */}
        <Link href="/user">
          <img src="/user.png" alt="user" className="w-12 mr-auto cursor-pointer" />
        </Link>
      </header>

      <main className="p-8">
      <div className="flex flex-wrap gap-6 mb-6 justify-center">

          <Link href="/SEA1">
            <button className="bg-white text-black px-4 py-3 rounded-full shadow mr-40
              transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 text-2xl">
              สิ่งแวดล้อมทางทะเล
            </button>
          </Link>



        <Link href="/SEA2">
          <button className="bg-white text-black px-4 py-3 rounded-full shadow mr-30
            transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 text-2xl">
            ภัยพิบัติทางทะเล
          </button>
        </Link>


        <Link href="/SEA3">
          <button className="bg-white text-black px-4 py-3 rounded-full shadow 
            transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 text-2xl">
            อาชญากรรมทางทะเล
          </button>
        </Link>


        <Link href="/SAVE_SEA">
          <button className="bg-white text-black px-4 py-3 rounded-full shadow ml-40
            transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 text-2xl">
            กิจกรรมอนุรักษ์ท้องทะเล
          </button>
        </Link>


      </div>
      <h1 className="text-5xl font-bold text-black py-4 ml-15 ">ข่าวแนะนำ</h1>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mt-7">

          {/* ข่าว 1: ขยายเต็มความกว้าง */}
          <Link href="/news" className="lg:col-span-3 block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <img src="/news1.jpg" alt="ข่าว 1" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-black">หัวข้อข่าว 1</h3>
                <p className="text-gray-600">รายละเอียดสั้น ๆ ของข่าวนี้...</p>
              </div>
            </div>
          </Link>


          {/* ข่าว 2 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1">
            <img src="/news2.jpg" alt="ข่าว 2" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-black">หัวข้อข่าว 2</h3>
              <p className="text-gray-600">รายละเอียดสั้น ๆ ของข่าวนี้...</p>
            </div>
          </div>

          {/* ข่าว 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1">
            <img src="/news3.jpg" alt="ข่าว 3" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-black">หัวข้อข่าว 3</h3>
              <p className="text-gray-600">รายละเอียดสั้น ๆ ของข่าวนี้...</p>
            </div>
          </div>

          {/* ข่าว 4 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1">
            <img src="/news4.jpg" alt="ข่าว 4" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-black">หัวข้อข่าว 4</h3>
              <p className="text-gray-600">รายละเอียดสั้น ๆ ของข่าวนี้...</p>
            </div>
          </div>

      </div>

    </main>

    </div>
  );
}
