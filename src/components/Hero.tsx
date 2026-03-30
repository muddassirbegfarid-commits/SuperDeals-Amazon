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
