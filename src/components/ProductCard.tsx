import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, TrendingUp, Trash2, Edit2 } from 'lucide-react';
import { Product } from '../types';
import { trackClick, deleteProduct } from '../services/productService';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  isTrending?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isTrending }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const isNew = useMemo(() => {
    if (!product.createdAt) return false;
    const now = Date.now();
    const createdAt = product.createdAt.toMillis ? product.createdAt.toMillis() : new Date(product.createdAt).getTime();
    const diff = now - createdAt;
    return diff < 2 * 24 * 60 * 60 * 1000; // 2 days
  }, [product.createdAt]);

  const badge = useMemo(() => {
    if (product.clicks > 20) return { text: '🔥 Burning', color: 'bg-red-600' };
    if (product.clicks > 10) return { text: '🔥 Hot', color: 'bg-orange-500' };
    if (isTrending) return { text: '📈 Trending', color: 'bg-blue-600' };
    if (isNew) return { text: '🆕 New', color: 'bg-green-600' };
    return null;
  }, [product.clicks, isTrending, isNew]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user && user.email === 'muddassirbegfarid@gmail.com');
    });
    return () => unsubscribe();
  }, []);

  const handleViewOnAmazon = async () => {
    if (product.id) {
      await trackClick(product.id);
    }
    window.open(product.affiliateLink, '_blank');
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.id) {
      await deleteProduct(product.id);
      // No reload needed, onSnapshot handles it
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.id) {
      navigate(`/admin/dashboard?edit=${product.id}`);
    }
  };

  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white p-4 flex flex-col border border-gray-200 rounded-sm hover:shadow-lg transition-shadow h-full"
    >
      <div className="relative h-48 flex items-center justify-center overflow-hidden bg-gray-50 rounded-sm">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain p-2"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {badge && (
          <div className={`absolute top-0 left-0 ${badge.color} text-white text-[10px] font-bold px-2 py-1 rounded-br-md z-10 shadow-sm`}>
            {badge.text}
          </div>
        )}
        {product.discount > 0 && !badge && (
          <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-br-md">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 mt-[10px]">
        <h3 className="text-[#007185] text-sm font-medium line-clamp-2 mb-1 min-h-[2.5rem] hover:text-[#C7511F] hover:underline cursor-pointer overflow-hidden">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-orange-400 text-xs">
            {"★".repeat(4)}{"☆".repeat(1)}
          </div>
          <span className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">
            {product.clicks > 0 ? `${product.clicks} views` : 'New Arrival'}
          </span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-lg font-bold">₹{Math.floor(discountedPrice).toLocaleString()}<sup>00</sup></span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          
          <p className="text-xs text-gray-600 mb-4 line-clamp-2 h-8 overflow-hidden">
            {product.description}
          </p>

          <button 
            onClick={handleViewOnAmazon}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 shadow-sm border border-[#FCD200]"
          >
            View on Amazon <ExternalLink size={14} />
          </button>
        </div>

        {isAdmin && (
          <div className="mt-2 flex flex-col gap-2">
            <button 
              onClick={handleEdit}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-2 border border-blue-200 transition-colors"
            >
              <Edit2 size={12} /> Edit Product (Admin)
            </button>

            {!showDeleteConfirm ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-2 border border-red-200 transition-colors"
              >
                <Trash2 size={12} /> Delete Product (Admin)
              </button>
            ) : (
              <div className="flex flex-col gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                <p className="text-[10px] text-red-700 font-bold text-center">Confirm Delete?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }}
                    className="flex-1 bg-white text-gray-600 py-1 rounded text-[10px] font-bold border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white py-1 rounded text-[10px] font-bold"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
