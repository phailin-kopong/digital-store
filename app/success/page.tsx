import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">ชำระเงินสำเร็จ!</h1>
        <p className="text-gray-600 mb-8">ขอบคุณที่สั่งซื้อสินค้ากับเรา คุณสามารถดาวน์โหลดไฟล์ได้ทันที</p>
        
        {/* ลิงก์สำหรับโหลดไฟล์จำลอง */}
        <a 
          href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
          target="_blank"
          download
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition text-lg block w-full mb-4"
        >
          📥 ดาวน์โหลดไฟล์ของคุณ
        </a>
        
        <Link href="/" className="text-blue-600 hover:underline">
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </main>
  );
}