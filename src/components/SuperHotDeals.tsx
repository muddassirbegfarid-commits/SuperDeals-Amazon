import React from 'react';
import { motion } from 'motion/react';
import { Flame, TrendingUp, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface SuperHotDealsProps {
  products: Product[];
}

export default function SuperHotDeals({ products }: SuperHotDealsProps) {
  const navigate = useNavigate();
  
  // Get top 5 most clicked products
  const hotDeals = [...products]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 5);

  if (hotDeals.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 py-2 relative overflow-hidden shadow-lg border-b border-orange-400">
      {/* Animated Fire Background Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 10, -10, 0],
            y: [0, -5, 5, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-64 h-full bg-yellow-400 blur-3xl rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -15, 15, 0],
            y: [0, 5, -5, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute top-0 right-1/4 w-64 h-full bg-orange-300 blur-3xl rounded-full"
        />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 shrink-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Flame className="text-yellow-300 fill-yellow-300" size={20} />
          </motion.div>
          <span className="text-white font-black text-xs md:text-sm tracking-tighter italic">SUPER HOT DEALS</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
            {hotDeals.map((product) => (
              <div 
                key={`hot-${product.id}`}
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => navigate(`/category/${encodeURIComponent(product.category)}`)}
              >
                <div className="w-8 h-8 bg-white rounded-full p-1 shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <img 
                    src={product.image} 
                    alt="" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[10px] md:text-xs font-bold line-clamp-1 max-w-[150px] md:max-w-[250px] group-hover:underline">
                    {product.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-300 font-black text-[10px] md:text-xs">₹{product.price.toLocaleString()}</span>
                    <span className="text-white/80 text-[10px] flex items-center gap-0.5">
                      <TrendingUp size={10} /> {product.clicks} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop if needed, but marquee usually handles it with CSS */}
            {hotDeals.map((product) => (
              <div 
                key={`hot-dup-${product.id}`}
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => navigate(`/category/${encodeURIComponent(product.category)}`)}
              >
                <div className="w-8 h-8 bg-white rounded-full p-1 shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <img 
                    src={product.image} 
                    alt="" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[10px] md:text-xs font-bold line-clamp-1 max-w-[150px] md:max-w-[250px] group-hover:underline">
                    {product.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-300 font-black text-[10px] md:text-xs">₹{product.price.toLocaleString()}</span>
                    <span className="text-white/80 text-[10px] flex items-center gap-0.5">
                      <TrendingUp size={10} /> {product.clicks} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="hidden md:flex items-center gap-1 text-white font-bold text-xs hover:underline shrink-0"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
