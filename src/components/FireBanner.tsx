import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Flame, ExternalLink, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import { trackClick } from '../services/productService';

interface FireBannerProps {
  products: Product[];
}

export default function FireBanner({ products }: FireBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (products.length === 0) return null;

  const handleViewOnAmazon = async (product: Product) => {
    if (product.id) {
      await trackClick(product.id);
    }
    window.open(product.affiliateLink, '_blank');
  };

  const next = () => setCurrent((prev) => (prev + 1) % products.length);
  const prev = () => setCurrent((prev) => (prev - 1 + products.length) % products.length);

  return (
    <div className="relative w-full h-auto md:h-[400px] overflow-hidden bg-white group border-b border-gray-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={products[current].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full flex flex-col md:flex-row items-center bg-white">
            <div className="w-full md:w-1/2 h-[200px] md:h-full flex items-center justify-center p-4 md:p-8">
              <img 
                src={products[current].image} 
                alt={products[current].name} 
                className="w-full max-h-[180px] md:max-h-[250px] object-cover rounded-lg shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-6 md:py-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black mb-4 shadow-lg self-start"
              >
                <Flame size={14} className="animate-pulse fill-yellow-300 text-yellow-300" />
                🔥 FIRE DEAL OF THE DAY
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-3xl font-black text-gray-900 mb-3 leading-tight"
              >
                {products[current].name}
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="bg-red-600 text-white px-3 py-1.5 rounded-md font-black text-xl">
                  -{products[current].discount}%
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 line-through text-sm">₹{products[current].price.toLocaleString()}</span>
                  <span className="text-2xl font-black text-gray-900">
                    ₹{Math.floor(products[current].price * (1 - products[current].discount / 100)).toLocaleString()}
                  </span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4"
              >
                <button 
                  onClick={() => handleViewOnAmazon(products[current])}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-md border border-[#FCD200] transition-all active:scale-95"
                >
                  Grab This Deal <ExternalLink size={16} />
                </button>
                <div className="flex items-center gap-2 text-orange-600 font-bold text-xs">
                  <TrendingUp size={16} />
                  {products[current].clicks} views
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'bg-red-600 w-8' : 'bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}
