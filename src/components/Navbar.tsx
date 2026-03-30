import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, MapPin, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../types';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex flex-col w-full">
      {/* Top Bar */}
      <div className="bg-[#131921] text-white px-4 py-2 flex items-center gap-4 h-14">
        <Link to="/" className="flex items-center gap-1 hover:outline outline-1 outline-white p-1">
          <span className="text-2xl font-bold text-white tracking-tighter">SuperDeals</span>
          <span className="text-orange-400 font-bold text-lg mt-1">.amazon</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 hover:outline outline-1 outline-white p-1 cursor-pointer">
          <MapPin size={18} className="mt-2" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-300">Deliver to</span>
            <span className="text-sm font-bold">India</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex h-10">
          <div className="bg-gray-100 text-gray-700 px-3 flex items-center gap-1 rounded-l-md border-r border-gray-300 cursor-pointer hover:bg-gray-200">
            <span className="text-xs">All</span>
            <ChevronDown size={14} />
          </div>
          <input 
            type="text" 
            placeholder="Search SuperDeals" 
            className="flex-1 px-3 outline-none text-black"
          />
          <button className="bg-[#febd69] hover:bg-[#f3a847] text-[#131921] px-4 rounded-r-md">
            <Search size={22} />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1 hover:outline outline-1 outline-white p-1 cursor-pointer">
          <div className="flex flex-col">
            <span className="text-xs">Hello, sign in</span>
            <span className="text-sm font-bold flex items-center">Account & Lists <ChevronDown size={14} /></span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col hover:outline outline-1 outline-white p-1 cursor-pointer">
          <span className="text-xs">Returns</span>
          <span className="text-sm font-bold">& Orders</span>
        </div>

        <div className="flex items-center gap-1 hover:outline outline-1 outline-white p-1 cursor-pointer relative">
          <div className="relative">
            <ShoppingCart size={32} />
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-orange-400 font-bold text-sm">0</span>
          </div>
          <span className="text-sm font-bold mt-3">Cart</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#232f3e] text-white px-4 py-1 flex items-center gap-4 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex items-center gap-1 font-bold cursor-pointer hover:outline outline-1 outline-white p-1">
          <Menu size={20} />
          <span>All</span>
        </div>
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat} 
            to={`/category/${encodeURIComponent(cat)}`}
            className="hover:outline outline-1 outline-white p-1"
          >
            {cat}
          </Link>
        ))}
        <Link to="/admin" className="ml-auto hover:outline outline-1 outline-white p-1 text-orange-400 font-bold">
          Admin Panel
        </Link>
      </div>
    </nav>
  );
}
