'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// เชื่อมต่อ Supabase
const supabase = createClient(
  'https://zyjuwxnhjrczxzswjtqk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5anV3eG5oanJjenh6c3dqdHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNjk2MTIsImV4cCI6MjEwNjg0NTYxMn0.u6KkYLYtNPgCdKfkDVAthr32tHbq2kddaxfyhFoqf_0'
);

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // ดึงข้อมูล session ปัจจุบันจาก Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      // เช็คว่าล็อกอินอยู่ และอีเมลตรงกับแอดมินหรือไม่
      if (session && session.user.email === 'minphailin2018@gmail.com') {
        setIsAdmin(true);
      }
      setLoading(false);
    };
    
    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium animate-pulse">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">คุณไม่มีสิทธิ์เข้าถึงหน้านี้ เฉพาะผู้ดูแลระบบเท่านั้น</p>
        <Link href="/" className="px-6 py-3 bg-[#0a192f] text-white rounded-xl font-medium shadow-md hover:bg-gray-800 transition">
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-purple-600 hover:text-purple-800 transition flex items-center gap-1">
            &larr; กลับหน้าร้านค้า
          </Link>
        </div>

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
            <p className="text-lg font-bold text-blue-700 mt-1 truncate">minphailin2018</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">จัดการระบบร้านค้า</h3>
          <p className="text-gray-500 text-sm">ระบบตรวจสอบสิทธิ์แอดมินทำงานสมบูรณ์พร้อมสำหรับการใช้งาน</p>
        </div>
      </div>
    </div>
  );
}