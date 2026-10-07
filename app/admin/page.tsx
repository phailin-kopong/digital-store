'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  // สร้างปุ่มเปิด/ปิดโหมดแอดมินชั่วคราวเพื่อให้พรีเซนต์ได้ทันที
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🛡️ Admin Dashboard</h1>
          <Link href="/" className="text-sm font-medium text-purple-600 hover:underline">
            &larr; กลับหน้าร้านค้า
          </Link>
        </div>

        {!isAdminUnlocked ? (
          <div className="p-8 bg-purple-50 rounded-2xl border border-purple-100 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">ระบบความปลอดภัยแอดมิน</h3>
            <p className="text-gray-600 mb-6">คลิกปุ่มด้านล่างเพื่อยืนยันตัวตนเข้าสู่ระบบผู้ดูแล (สำหรับการพรีเซนต์)</p>
            <button
              onClick={() => setIsAdminUnlocked(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition"
            >
              🔑 เข้าสู่ระบบแอดมินทันที
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <h3 className="text-gray-500 font-medium text-sm">สถานะระบบ</h3>
                <p className="text-2xl font-bold text-purple-700 mt-1">Active ✅</p>
              </div>
              <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100">
                <h3 className="text-gray-500 font-medium text-sm">จัดการสินค้า</h3>
                <p className="text-2xl font-bold text-pink-700 mt-1">พร้อมใช้งาน</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 className="text-gray-500 font-medium text-sm">ผู้ดูแลระบบ</h3>
                <p className="text-lg font-bold text-blue-700 mt-1 truncate">minphailin</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">จัดการระบบร้านค้า</h3>
              <p className="text-gray-500 text-sm">คุณสามารถเพิ่ม ลบ หรือแก้ไขข้อมูลสินค้าและตรวจสอบออเดอร์ของลูกค้าได้จากหน้านี้สำหรับการพรีเซนต์</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}