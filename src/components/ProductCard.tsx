import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Trash2, Edit2, Star, Zap, ShieldCheck, Award, TrendingUp, Sparkles } from 'lucide-react';
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
    if (product.clicks > 20) return { text: '🔥 Burning', color: 'bg-red-500', icon: <Zap size={10} /> };
    if (product.clicks > 10) return { text: '🔥 Hot', color: 'bg-orange-500', icon: <Zap size={10} /> };
    if (isTrending) return { text: '📈 Trending', color: 'bg-blue-600', icon: <TrendingUp size={10} /> };
    if (isNew) return { text: '🆕 New', color: 'bg-green-600', icon: <Sparkles size={10} /> };
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group bg-white flex flex-col rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 h-full border border-gray-100 relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {badge && (
          <div className={`${badge.color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
            {badge.icon} {badge.text}
          </div>
        )}
        {product.discount > 20 && (
          <div className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            🔥 Deal: {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="relative h-56 flex items-center justify-center overflow-hidden bg-white p-6 product-card-zoom">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 pt-2">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full">
            <Star size={10} className="text-orange-500 fill-orange-500" />
            <span className="text-[10px] font-bold text-orange-700">4.8</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-secondary text-sm md:text-base font-bold line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary transition-colors cursor-pointer leading-tight">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Features / Best For */}
        <div className="mb-4 space-y-2">
          {product.features && product.features.length > 0 && (
            <div className="space-y-1">
              {product.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] text-gray-600">
                  <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
            <ShieldCheck size={12} className="text-green-500" />
            <span className="font-medium italic">Trusted Review</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <Award size={12} className="text-blue-500" />
            <span className="font-medium">Best for: <span className="text-secondary font-bold">{product.category === 'Mobiles' ? 'Performance' : 'Value'}</span></span>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through font-medium">₹{product.price.toLocaleString()}</span>
              <span className="text-xl font-black text-secondary">₹{Math.floor(discountedPrice).toLocaleString()}</span>
            </div>
            {product.discount > 0 && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                Save ₹{(product.price - discountedPrice).toLocaleString()}
              </span>
            )}
          </div>

          <button 
            onClick={handleViewOnAmazon}
            className="w-full btn-amazon flex items-center justify-center gap-2 text-sm"
          >
            Check on Amazon <ExternalLink size={16} />
          </button>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <button 
              onClick={handleEdit}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-xl transition-colors flex justify-center"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            {!showDeleteConfirm ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-colors flex justify-center"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <div className="flex-1 flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }}
                  className="flex-1 bg-gray-200 text-gray-600 p-1 rounded-lg text-[10px] font-bold"
                >
                  No
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white p-1 rounded-lg text-[10px] font-bold"
                >
                  Yes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
