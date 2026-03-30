import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const BANNERS = [
  "https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg", // Kitchen banner
  "https://m.media-amazon.com/images/I/61Pdr7GIZpL._SX3000_.jpg",
  "https://m.media-amazon.com/images/I/61zAjw4bqPL._SX3000_.jpg"
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group bg-[#eaeded]">
      {BANNERS.map((banner, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: idx === current ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={banner} 
            alt="Banner" 
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#eaeded] pointer-events-none" />
          
          {/* Promotional Overlay from Image */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 pointer-events-none text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-1">Up to 60% off</h2>
            <p className="text-xl text-gray-800 mb-6">Smart Cooking Alternatives for Your Kitchen</p>
            
            <div className="flex justify-center items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded flex flex-col items-center">
                  <span className="text-[10px] font-bold text-white uppercase">GST</span>
                  <span className="text-xs font-black text-white">SAVINGS</span>
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white uppercase">FREE</span>
                  <span className="text-xs font-black text-white">DELIVERY</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <button 
        onClick={() => setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
        className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center hover:bg-black/5 transition-colors z-20"
      >
        <ChevronLeft size={60} strokeWidth={1} className="text-gray-800" />
      </button>

      <button 
        onClick={() => setCurrent((prev) => (prev + 1) % BANNERS.length)}
        className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center hover:bg-black/5 transition-colors z-20"
      >
        <ChevronRight size={60} strokeWidth={1} className="text-gray-800" />
      </button>
    </div>
  );
}
