import { Link, useLocation } from 'react-router-dom';
import { Home, Search, TrendingUp, User, Menu } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}>
        <Home size={20} />
        <span className="text-[10px] font-bold">Home</span>
      </Link>
      <div className="flex flex-col items-center gap-1 text-gray-400">
        <Search size={20} />
        <span className="text-[10px] font-bold">Search</span>
      </div>
      <div className="flex flex-col items-center gap-1 text-gray-400">
        <TrendingUp size={20} />
        <span className="text-[10px] font-bold">Trending</span>
      </div>
      <Link to="/admin" className={`flex flex-col items-center gap-1 ${isActive('/admin') ? 'text-primary' : 'text-gray-400'}`}>
        <User size={20} />
        <span className="text-[10px] font-bold">Account</span>
      </Link>
      <div className="flex flex-col items-center gap-1 text-gray-400">
        <Menu size={20} />
        <span className="text-[10px] font-bold">Menu</span>
      </div>
    </div>
  );
}
