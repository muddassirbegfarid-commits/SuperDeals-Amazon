import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, TrendingUp, Award, Star } from 'lucide-react';
import { Product } from '../types';
import { trackClick } from '../services/productService';

interface TrendingCardProps {
  product: Product;
  rank: number;
}

const TrendingCard: React.FC<TrendingCardProps> = ({ product, rank }) => {
  const handleViewOnAmazon = async () => {
    if (product.id) {
      await trackClick(product.id);
    }
    window.open(product.affiliateLink, '_blank');
  };

  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      className="bg-white p-5 flex flex-col border-2 border-orange-100 rounded-lg shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
    >
      {/* Trending Badge */}
      <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-lg flex items-center gap-1 z-10 shadow-sm">
        <TrendingUp size={12} className="animate-pulse" />
        TRENDING NOW
      </div>

      {/* Rank Badge */}
      <div className="absolute top-0 left-0 bg-[#232f3e] text-white text-[10px] font-bold px-3 py-1.5 rounded-br-lg flex items-center gap-1 z-10 shadow-sm">
        <Award size={12} className="text-yellow-400" />
        #{rank} in {product.category}
      </div>

      <div className="relative h-56 mb-4 flex items-center justify-center overflow-hidden mt-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {product.discount > 0 && (
          <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 mb-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />
          ))}
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.clicks > 0 ? 'text-orange-600 bg-orange-50' : 'text-blue-600 bg-blue-50'}`}>
          {product.clicks > 0 ? `${product.clicks} views` : 'New Arrival'}
        </span>
      </div>

      <h3 className="text-[#007185] text-base font-bold line-clamp-2 mb-2 min-h-[3rem] group-hover:text-[#C7511F] group-hover:underline cursor-pointer leading-tight">
        {product.name}
      </h3>

      <div className="mt-auto">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-black text-gray-900">₹{Math.floor(discountedPrice).toLocaleString()}</span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
          )}
        </div>
        
        <button 
          onClick={handleViewOnAmazon}
          className="w-full bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d181] hover:to-[#eeb933] text-black py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm border border-[#a88734] transition-all active:scale-95"
        >
          View on Amazon <ExternalLink size={16} />
        </button>
        
        <p className="text-[10px] text-center text-gray-500 mt-2 font-medium">
          Top Pick for {product.category}
        </p>
      </div>
    </motion.div>
  );
};

export default TrendingCard;
