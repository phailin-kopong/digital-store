'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// เชื่อมต่อ Supabase
const supabase = createClient(
  'https://zyjuwxnhjrczxzswjtqk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5anV3eG5oanJjenh6c3dqdHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNjk2MTIsImV4cCI6MjEwNjg0NTYxMn0.u6KkYLYtNPgCdKfkDVAthr32tHbq2kddaxfyhFoqf_0'
);

const ProductImage = ({ category, className = "h-48" }: { category: string, className?: string }) => {
  let bgClass = "from-purple-300 to-pink-300";
  let icon = "📦";

  if (category === 'Templates') { bgClass = "from-fuchsia-300 to-pink-300"; icon = "📊"; }
  if (category === 'Source Code') { bgClass = "from-blue-200 to-indigo-300"; icon = "💻"; }
  if (category === 'E-Books') { bgClass = "from-pink-300 to-rose-300"; icon = "📖"; }
  if (category === 'Courses') { bgClass = "from-teal-200 to-emerald-300"; icon = "🎓"; }

  return (
    <div className={`w-full ${className} rounded-2xl bg-gradient-to-br ${bgClass} flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-105`}>
      <span className="text-5xl drop-shadow-md">{icon}</span>
    </div>
  );
};

export default function LibraryPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // สินค้าจำลองสำหรับโชว์ในหน้าคลังว่า "ซื้อแล้ว" เพื่อการพรีเซนต์
  const ownedProducts = [
    { id: '1', title: 'SaaS Dashboard UI Kit', category: 'Templates' },
    { id: '4', title: 'Full-Stack React Course', category: 'Courses' },
    { id: '6', title: 'Node API Boilerplate', category: 'Source Code' },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  // ถ้ายังไม่ล็อกอิน ให้แสดงหน้าเตือน
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff0f8] via-white to-[#f4f0ff] p-6 text-center">
        <h1 className="text-3xl font-serif font-bold text-[#0a192f] mb-4">My Library</h1>
        <p className="text-gray-500 mb-8">Please log in to access your purchased products.</p>
        <Link href="/login" className="px-8 py-3.5 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">
          Log in securely
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f8] via-white to-[#f4f0ff] text-gray-800 font-sans pb-20 relative">
      
      {/* Navbar แบบง่ายสำหรับหน้า Library */}
      <nav className="px-6 py-6 max-w-7xl mx-auto flex justify-between items-center relative z-40 border-b border-gray-100/50 mb-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-md">
             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L22 20H2L12 2z"/></svg>
          </div>
          <span className="text-xl font-bold text-[#0a192f] tracking-tight">Digital Store</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-purple-600 transition">
            &larr; Back to Store
          </Link>
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm shadow-sm border border-purple-100">
            {user.email.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0a192f] mb-4">My Library 🎒</h1>
          <p className="text-gray-500 text-lg">Access and download your purchased digital products.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ownedProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col group">
              <ProductImage category={p.category} className="h-48 mb-4" />
              <div className="flex-1 flex flex-col">
                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full w-max tracking-wider uppercase mb-2">
                  Purchased
                </span>
                <h2 className="text-xl font-bold text-[#0a192f] mb-6 line-clamp-1">{p.title}</h2>
                
                <div className="mt-auto">
                  <a 
                    href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
                    target="_blank"
                    download
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 text-[#0a192f] hover:text-purple-600 font-bold py-3.5 rounded-2xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Files
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}