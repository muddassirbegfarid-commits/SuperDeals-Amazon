import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, MapPin, ChevronDown, User, Heart, Bell } from 'lucide-react';
import { CATEGORIES } from '../types';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search logic would go here, for now just UI
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'shadow-md bg-white' : 'bg-white'}`}>
      {/* Top Bar */}
      <div className="max-w-[1500px] mx-auto px-4 h-16 md:h-20 flex items-center gap-4 md:gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 min-w-fit group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
            <ShoppingCart className="text-white" size={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl md:text-2xl font-black text-secondary tracking-tighter">SuperDeals</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Expert Picks 2026</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 hidden md:flex relative group">
          <form onSubmit={handleSearch} className="w-full relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search best products, deals, and more..." 
              className="w-full bg-gray-100 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-3 pl-12 pr-4 text-sm transition-all outline-none"
            />
            <div className="absolute right-2 inset-y-2">
              <button type="submit" className="bg-primary hover:bg-[#e68a00] text-white px-6 rounded-xl text-sm font-bold h-full transition-colors shadow-sm">
                Search
              </button>
            </div>
          </form>

          {/* Search Suggestions (Mocked) */}
          {searchQuery.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Trending Searches</p>
                <div className="space-y-3">
                  {['Best Mobiles under 20000', 'Laptops for Students', 'Noise Cancelling Headphones'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group">
                      <Search size={14} className="text-gray-300 group-hover:text-primary" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Top Categories</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.slice(0, 4).map((cat) => (
                    <Link key={cat} to={`/category/${cat}`} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold hover:border-primary hover:text-primary transition-all">
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nav Actions */}
        <div className="flex items-center gap-2 md:gap-6 ml-auto">
          <div className="hidden lg:flex flex-col items-end cursor-pointer hover:text-primary transition-colors">
            <span className="text-[10px] uppercase font-bold text-gray-400">Deliver to</span>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-primary" />
              <span className="text-sm font-bold">India</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors relative">
              <Bell size={22} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
              <Heart size={22} className="text-gray-600" />
            </div>
            <Link to="/admin" className="flex items-center gap-2 p-1.5 md:p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              <User size={20} className="text-gray-600" />
              <span className="hidden md:inline text-sm font-bold text-gray-700">Account</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar / Categories */}
      <div className="border-t border-gray-100 bg-white overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-4 py-2 flex items-center gap-6 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex items-center gap-1 font-bold cursor-pointer text-secondary hover:text-primary transition-colors">
            <Menu size={18} />
            <span>All Categories</span>
          </div>
          <div className="h-4 w-px bg-gray-200"></div>
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat} 
              to={`/category/${encodeURIComponent(cat)}`}
              className="text-gray-600 font-medium hover:text-primary transition-colors"
            >
              {cat}
            </Link>
          ))}
          <Link to="/blog/best-wireless-earbuds-under-2000-india-2026" className="text-primary font-bold hover:underline">
            🔥 Best Earbuds 2026
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden lg:inline text-xs font-bold text-gray-400 uppercase tracking-widest">Trending Now:</span>
            <Link to="/category/Mobiles" className="text-xs font-bold hover:text-primary transition-colors">iPhone 15 Pro</Link>
            <Link to="/category/Laptops" className="text-xs font-bold hover:text-primary transition-colors">MacBook Air M3</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
