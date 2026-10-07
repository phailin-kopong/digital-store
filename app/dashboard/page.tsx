'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// เชื่อมต่อ Supabase
const supabase = createClient(
  'https://zyjuwxnhjrczxzswjtqk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5anV3eG5oanJjenh6c3dqdHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNjk2MTIsImV4cCI6MjEwNjg0NTYxMn0.u6KkYLYtNPgCdKfkDVAthr32tHbq2kddaxfyhFoqf_0'
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  // State เก็บตัวเลขสรุปผล
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    customers: 0,
    products: 0
  });

  // State เก็บข้อมูลตาราง 5 รายการล่าสุด
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // 1. ดึงจำนวนสินค้าทั้งหมด
        const { data: productsData } = await supabase.from('products').select('id');
        const productCount = productsData?.length || 0;

        // 2. ดึงประวัติคำสั่งซื้อทั้งหมด
        const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        
        if (ordersData) {
          // คำนวณยอดขายรวม (เฉพาะที่จ่ายเงินแล้วหรือกำลังประมวลผล)
          const totalRev = ordersData.reduce((sum, order) => {
            if (order.status === 'Completed' || order.status === 'Processing') return sum + Number(order.amount);
            return sum;
          }, 0);

          // นับลูกค้าที่ไม่ซ้ำกัน (นับจาก Email)
          const uniqueCustomers = new Set(ordersData.map(o => o.customer_email)).size;

          setStats({
            revenue: totalRev,
            totalOrders: ordersData.length,
            customers: uniqueCustomers,
            products: productCount
          });

          // เอา 5 รายการล่าสุดมาโชว์ในตาราง
          setRecentOrders(ordersData.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // แปลงวันที่ให้อ่านง่าย เช่น "Oct 6, 2026"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-gray-200 font-sans pb-20">
      
      {/* Navbar */}
      <nav className="bg-[#0f121d] border-b border-[#1f2437] sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6 w-1/3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#635BFF] rounded-lg flex items-center justify-center">
                <div className="w-3 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">DigitalStore</span>
            </Link>
          </div>

          <div className="flex items-center justify-end space-x-6 w-full">
             <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition mr-4">
                &larr; Back to Store
             </Link>
             <span className="text-sm text-[#a5b4fc] px-3 py-1.5 border border-[#635BFF]/30 bg-[#635BFF]/10 rounded-md">Dashboard</span>
             <div className="w-8 h-8 rounded-full bg-[#635BFF] text-white flex items-center justify-center font-bold text-sm cursor-pointer">
                 A
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Overview</h1>
          <p className="text-gray-500 text-sm">Real-time data from database</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 my-20 animate-pulse">Loading data...</div>
        ) : (
          <>
            {/* 4 กล่องสรุปผล (ดึงข้อมูลจริง) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#121622] border border-[#1f2437] rounded-xl p-6 relative">
                <div className="absolute top-6 right-6 w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 font-bold">$</div>
                <h3 className="text-gray-400 text-sm font-medium mb-4">Total Revenue</h3>
                <div className="text-3xl font-bold text-white mb-4">${stats.revenue.toLocaleString()}</div>
                <div className="inline-flex items-center px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded">Live Data 🟢</div>
              </div>

              <div className="bg-[#121622] border border-[#1f2437] rounded-xl p-6 relative">
                <div className="absolute top-6 right-6 w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">🛒</div>
                <h3 className="text-gray-400 text-sm font-medium mb-4">Total Orders</h3>
                <div className="text-3xl font-bold text-white mb-4">{stats.totalOrders}</div>
                <div className="inline-flex items-center px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded">Live Data 🟢</div>
              </div>

              <div className="bg-[#121622] border border-[#1f2437] rounded-xl p-6 relative">
                <div className="absolute top-6 right-6 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">👥</div>
                <h3 className="text-gray-400 text-sm font-medium mb-4">Customers</h3>
                <div className="text-3xl font-bold text-white mb-4">{stats.customers}</div>
                <div className="inline-flex items-center px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded">Live Data 🟢</div>
              </div>

              <div className="bg-[#121622] border border-[#1f2437] rounded-xl p-6 relative">
                <div className="absolute top-6 right-6 w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-400">📦</div>
                <h3 className="text-gray-400 text-sm font-medium mb-4">Products</h3>
                <div className="text-3xl font-bold text-white mb-4">{stats.products}</div>
                <div className="inline-flex items-center px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded">Live Data 🟢</div>
              </div>
            </div>

            {/* กราฟจำลอง */}
            <div className="bg-[#121622] border border-[#1f2437] rounded-xl p-6 mb-8 relative overflow-hidden h-[400px]">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                  <h2 className="text-lg font-bold text-white">Sales Overview</h2>
                  <p className="text-gray-500 text-sm mt-1">Monthly performance</p>
                </div>
              </div>
              <div className="absolute left-6 right-6 top-24 bottom-12 flex flex-col justify-between text-xs text-gray-600">
                 <div className="border-b border-[#1f2437] pb-1">$16k</div>
                 <div className="border-b border-[#1f2437] pb-1">$12k</div>
                 <div className="border-b border-[#1f2437] pb-1">$8k</div>
                 <div className="border-b border-[#1f2437] pb-1">$4k</div>
              </div>
              <svg className="absolute bottom-0 left-0 w-full h-[250px] z-0" preserveAspectRatio="none" viewBox="0 0 1000 300">
                 <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="#635BFF" stopOpacity="0.2" />
                       <stop offset="100%" stopColor="#635BFF" stopOpacity="0" />
                    </linearGradient>
                 </defs>
                 <path d="M0,250 C100,200 200,280 300,150 C400,20 500,250 600,180 C700,110 800,200 900,100 L1000,0 L1000,300 L0,300 Z" fill="url(#grad)" />
                 <path d="M0,250 C100,200 200,280 300,150 C400,20 500,250 600,180 C700,110 800,200 900,100 L1000,0" fill="none" stroke="#635BFF" strokeWidth="4" />
              </svg>
            </div>

            {/* ตาราง Recent Orders (ดึงข้อมูลจริง) */}
            <div className="bg-[#121622] border border-[#1f2437] rounded-xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-[#1f2437] flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Recent Orders</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0f121d] text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Order ID</th>
                      <th className="p-4 font-semibold">Product</th>
                      <th className="p-4 font-semibold">Customer Email</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold text-right">Amount</th>
                      <th className="p-4 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2437]">
                    {recentOrders.map((order, i) => (
                      <tr key={i} className="hover:bg-[#161a29] transition-colors">
                        <td className="p-4 text-[#635BFF] text-sm font-medium">{order.order_id}</td>
                        <td className="p-4 text-white text-sm font-medium">{order.product_title}</td>
                        <td className="p-4 text-gray-400 text-sm">{order.customer_email}</td>
                        <td className="p-4 text-gray-500 text-sm">{formatDate(order.created_at)}</td>
                        <td className="p-4 text-white text-sm font-bold text-right">${order.amount}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border ${
                            order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}