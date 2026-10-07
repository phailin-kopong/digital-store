'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// เชื่อมต่อ Supabase
const supabase = createClient(
  'https://zyjuwxnhjrczxzswjtqk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5anV3eG5oanJjenh6c3dqdHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNjk2MTIsImV4cCI6MjEwNjg0NTYxMn0.u6KkYLYtNPgCdKfkDVAthr32tHbq2kddaxfyhFoqf_0'
);

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviews_count: number;
  badge: string | null;
  image_url: string;
}

const backupProducts: Product[] = [
  { id: '1', title: 'SaaS Dashboard UI Kit', category: 'Templates', price: 49, rating: 4.8, reviews_count: 1240, badge: null, image_url: '' },
  { id: '2', title: 'Next.js E-Commerce Starter', category: 'Source Code', price: 89, rating: 4.9, reviews_count: 873, badge: null, image_url: '' },
  { id: '3', title: 'Mastering TypeScript 5', category: 'E-Books', price: 29, rating: 4.9, reviews_count: 1240, badge: null, image_url: '' },
  { id: '4', title: 'Full-Stack React Course', category: 'Courses', price: 129, rating: 4.9, reviews_count: 654, badge: null, image_url: '' },
  { id: '5', title: 'Landing Page Pack', category: 'Templates', price: 0, rating: 4.5, reviews_count: 120, badge: 'Free', image_url: '' },
  { id: '6', title: 'Node API Boilerplate', category: 'Source Code', price: 39, rating: 4.6, reviews_count: 430, badge: null, image_url: '' },
];

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase.from('products').select('*');
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(backupProducts);
      }
    }
    loadProducts();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCart([]);
  };

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); 
    
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (cart.find(item => item.id === product.id)) {
      alert('สินค้านี้อยู่ในตะกร้าแล้วครับ!');
      return;
    }
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // จำลองการชำระเงินสำหรับพรีเซนต์
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoadingCheckout(true);
    
    // จำลองเวลาประมวลผล 2 วินาที แล้วพาเด้งไปหน้า success
    setTimeout(() => {
      setLoadingCheckout(false);
      window.location.href = '/success'; 
    }, 2000);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const filteredProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);
  const heroProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f8] via-white to-[#f4f0ff] text-gray-800 font-sans pb-20 relative">
      
      {/* 1. หน้ารายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-[#fffafc] overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-900 mb-8 flex items-center gap-2 font-medium transition-colors">
              &larr; Back to products
            </button>
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/3">
                <ProductImage category={selectedProduct.category} className="h-[400px]" />
                <div className="mt-12">
                  <h3 className="text-2xl font-serif font-bold text-[#0a192f] mb-4">Overview</h3>
                  <p className="text-gray-600 mb-6 text-lg">A practical guide to modern {selectedProduct.category} with real-world patterns.</p>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✓</span> Lifetime updates</li>
                    <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✓</span> Commercial license included</li>
                  </ul>
                </div>
              </div>
              <div className="lg:w-1/3">
                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-10">
                  <span className="bg-pink-50 text-pink-500 text-xs font-bold px-4 py-1.5 rounded-full">{selectedProduct.category}</span>
                  <h1 className="text-3xl font-serif font-bold text-[#0a192f] mt-5 mb-3">{selectedProduct.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span className="text-gray-900 font-bold">★ {selectedProduct.rating}</span>
                    <span>· {selectedProduct.reviews_count.toLocaleString()} reviews</span>
                  </div>
                  <div className="text-4xl font-bold text-[#0a192f] mb-8">${selectedProduct.price === 0 ? 'Free' : selectedProduct.price}</div>
                  
                  <button 
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); setIsCartOpen(true); }} 
                    className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl shadow-md transition-all mb-4 transform hover:-translate-y-0.5"
                  >
                    Add to cart
                  </button>
                  <button 
                    onClick={() => { addToCart(selectedProduct); handleCheckout(); }} 
                    className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 text-[#0a192f] font-bold py-4 rounded-2xl transition-all mb-6"
                  >
                    Buy now
                  </button>
                  <p className="text-center text-xs text-gray-400">Instant download · 30-day refund</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Navbar */}
      <nav className="px-6 py-6 max-w-7xl mx-auto flex justify-between items-center relative z-40">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-md">
             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L22 20H2L12 2z"/></svg>
          </div>
          <span className="text-xl font-bold text-[#0a192f] tracking-tight">Digital Store</span>
        </div>

        {/* เมนูตรงกลาง (เอา Admin Panel ออกแล้ว) */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[#0a192f] hover:text-purple-600 transition">Home</button>
          <button onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-500 hover:text-purple-600 transition">Products</button>
          <button onClick={() => setIsCartOpen(true)} className="text-gray-500 hover:text-purple-600 transition">Checkout</button>
          <Link href="/library" className="text-pink-500 hover:text-pink-600 font-bold transition">My Library 🎒</Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm border border-purple-100" onClick={handleLogout} title="Logout">
                {user.email.charAt(0).toUpperCase()}
            </div>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition mr-2">Log in</Link>
          )}
          <button onClick={() => setIsCartOpen(true)} className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 text-sm font-semibold hover:shadow-md transition text-[#0a192f]">
            <span className="text-blue-500 text-lg">🛍️</span>
            <span>Cart ({cart.length})</span>
          </button>
        </div>
      </nav>

      {/* 3. ตะกร้าสินค้า (Cart Sidebar) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-serif font-bold text-[#0a192f]">Cart & checkout</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-xl">✨</div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0a192f]">{item.title}</h3>
                      <p className="text-gray-400 text-xs mt-0.5">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-[#0a192f]">${item.price}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 text-lg">✕</button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <div className="text-center text-gray-400 mt-10">Your cart is empty.</div>}
            </div>

            <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-bold text-lg">Total</span>
                <span className="text-2xl font-bold text-[#0a192f]">${totalPrice}</span>
              </div>
              <button 
                onClick={handleCheckout} 
                disabled={cart.length === 0 || loadingCheckout} 
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
              >
                {loadingCheckout ? 'Processing securely...' : 'Pay securely'}
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">🔒 Instant download after payment · 30-day refund</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. หน้าหลัก */}
      <main className="max-w-7xl mx-auto px-6">
        
        {activeCategory === 'All' && (
          <div className="flex flex-col lg:flex-row pt-12 pb-16 relative z-10">
            <div className="lg:w-[45%] pr-8 pt-10">
              <div className="inline-flex items-center space-x-2 text-pink-500 font-medium text-sm mb-6">
                <span className="text-lg">✿</span>
                <span>New arrivals every week</span>
              </div>
              
              <h1 className="text-5xl md:text-[64px] font-serif font-bold text-[#0a192f] mb-6 leading-[1.1] tracking-tight">
                Premium digital <br/> products <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">for devs</span>
              </h1>
              
              <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">
                Templates, source code, e-books and courses crafted by professionals. Ship faster, learn deeper.
              </p>
              
              <div className="flex items-center space-x-4 mb-16">
                <button onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-purple-400 to-pink-400 hover:shadow-lg text-white font-bold py-3.5 px-8 rounded-full transition-all transform hover:-translate-y-0.5">
                  Shop now
                </button>
                <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-8 rounded-full shadow-sm transition-all">
                  Browse free
                </button>
              </div>
              
              <div className="flex items-center space-x-10">
                <div><div className="text-2xl font-bold text-[#0a192f]">10K+</div><div className="text-sm text-gray-500 mt-1">Customers</div></div>
                <div><div className="text-2xl font-bold text-[#0a192f]">148</div><div className="text-sm text-gray-500 mt-1">Products</div></div>
                <div>
                  <div className="text-2xl font-bold text-[#0a192f] flex items-center">4.9<span className="text-[#0a192f] ml-1 text-lg">★</span></div>
                  <div className="text-sm text-gray-500 mt-1">Avg rating</div>
                </div>
              </div>
            </div>

            <div className="lg:w-[55%] grid grid-cols-2 gap-6 mt-16 lg:mt-0">
              {heroProducts.map((p) => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <ProductImage category={p.category} className="h-40" />
                  <div className="px-2 pb-2">
                    <p className="text-gray-400 text-xs font-medium mb-1">{p.category}</p>
                    <h3 className="text-[#0a192f] font-bold text-sm mb-1 line-clamp-1">{p.title}</h3>
                    <p className="text-pink-500 font-bold text-sm">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div id="products-section" className="pt-16">
          <h2 className="text-3xl font-serif font-bold text-[#0a192f] mb-8">
            {activeCategory === 'All' ? 'Featured' : 'All products'}
          </h2>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${
                activeCategory === 'All' ? 'bg-pink-50 text-pink-500 border border-pink-100' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            
            {[
              { name: 'Templates', icon: '🎨' },
              { name: 'Source Code', icon: '💻' },
              { name: 'E-Books', icon: '📖' },
              { name: 'Courses', icon: '🎓' }
            ].map(cat => (
              <button 
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center space-x-3 px-8 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${
                  activeCategory === cat.name ? 'bg-white text-[#0a192f] border-2 border-purple-400 shadow-md' : 'bg-white text-gray-600 border border-transparent hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
            {filteredProducts.map((p) => (
              <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group relative cursor-pointer">
                
                {p.badge && (
                  <span className="absolute top-6 right-6 z-10 px-3 py-1 text-[10px] font-bold rounded-full bg-white text-pink-500 shadow-sm border border-pink-50">
                    {p.badge}
                  </span>
                )}
                
                <ProductImage category={p.category} />
                
                <div className="px-2 pt-2 flex-1 flex flex-col">
                  <p className="text-gray-400 text-xs font-medium mb-1">{p.category}</p>
                  <h2 className="text-base font-bold text-[#0a192f] mb-4 line-clamp-1 group-hover:text-purple-600 transition-colors">{p.title}</h2>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-lg font-bold text-pink-500">${p.price === 0 ? 'Free' : p.price}</span>
                    <button 
                      onClick={(e) => addToCart(p, e)}
                      className="bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-600 font-bold py-2 px-4 rounded-full text-sm transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200/60 mt-10 py-8 text-center text-sm text-gray-400">
        © 2026 DigitalStore · Built for developers
      </footer>
    </div>
  );
}