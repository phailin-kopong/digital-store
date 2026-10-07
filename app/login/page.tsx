'use client';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import Link from 'next/link';

// เชื่อมต่อ Supabase
const supabase = createClient(
  'https://zyjuwxnhjrczxzswjtqk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5anV3eG5oanJjenh6c3dqdHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNjk2MTIsImV4cCI6MjEwNjg0NTYxMn0.u6KkYLYtNPgCdKfkDVAthr32tHbq2kddaxfyhFoqf_0'
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMessage({ text: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง', type: 'error' });
    } else {
      window.location.href = '/'; 
    }
    setLoading(false);
  };

  // 🟢 ฟังก์ชันสำหรับล็อกอินด้วย Google ที่เพิ่มเข้ามา
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setMessage({ text: 'ไม่สามารถล็อกอินด้วย Google ได้', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff0f8] via-white to-[#f4f0ff] p-6 font-sans relative">
      
      {/* ปุ่มกลับหน้าหลัก */}
      <Link href="/" className="absolute top-8 left-8 flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition font-medium bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-100">
        <span>&larr;</span> <span>Back to Store</span>
      </Link>

      <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full border border-gray-100 relative overflow-hidden">
        
        {/* แถบสีตกแต่งด้านบน */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>

        <div className="text-center mb-8 pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-purple-500 text-white shadow-md mb-5">
             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L22 20H2L12 2z"/></svg>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#0a192f] mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500">Log in to your account to continue</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl mb-6 text-sm font-medium text-center ${message.type === 'error' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 focus:border-purple-300 outline-none transition text-gray-900"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2 pl-1 pr-1">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <a href="#" className="text-xs text-pink-500 hover:text-pink-600 font-medium">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-50 focus:border-purple-300 outline-none transition text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#0a192f] hover:bg-gray-800 text-white font-bold py-4 rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none mt-2"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* เส้นคั่นระหว่างฟอร์มปกติกับ Google Login */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-3 text-sm text-gray-400 font-medium">Or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* 🟢 ปุ่ม Sign in with Google ที่เพิ่มเข้ามา */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-2xl shadow-sm transition-all transform hover:-translate-y-0.5"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            className="w-5 h-5" 
            alt="Google logo"
          />
          <span>Sign in with Google</span>
        </button>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-500 font-bold hover:text-purple-600 transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}