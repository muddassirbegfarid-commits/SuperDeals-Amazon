import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import TrendingCard from '../components/TrendingCard';
import AdPlaceholder from '../components/AdPlaceholder';
import { subscribeToProducts } from '../services/productService';
import { Product, CATEGORIES } from '../types';
import { Loader2, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
    }, category);

    return () => unsubscribe();
  }, [category]);

  // Trending Logic: Top product from each category based on clicks
  const trendingProducts = useMemo(() => {
    if (category) return []; // Don't show trending on category pages
    
    const topPerCategory: Product[] = [];
    
    CATEGORIES.forEach(cat => {
      const catProducts = products.filter(p => p.category === cat);
      if (catProducts.length > 0) {
        // Sort by clicks descending
        const sorted = [...catProducts].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
        // If top product has 0 clicks, it's still "trending" as a new arrival fallback
        topPerCategory.push(sorted[0]);
      }
    });

    // Sort the final trending list by clicks to show the absolute best first
    return topPerCategory.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  }, [products, category]);

  return (
    <div className="bg-[#eaeded] min-h-screen pb-12">
      {!category && <Hero />}
      
      <div className="max-w-[1500px] mx-auto px-4 -mt-20 relative z-10">
        <AdPlaceholder type="banner" />

        {/* Trending Section */}
        {!category && trendingProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
              <div className="bg-orange-100 p-2 rounded-full">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trending Now</h2>
                <p className="text-sm text-gray-500 font-medium">Top picks based on popularity across categories</p>
              </div>
              <div className="ml-auto hidden md:flex items-center gap-2 text-orange-600 font-bold text-sm animate-pulse">
                <Sparkles size={16} />
                LIVE UPDATES
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingProducts.slice(0, 8).map((product, index) => (
                <TrendingCard 
                  key={`trending-${product.id}`} 
                  product={product} 
                  rank={index + 1}
                />
              ))}
            </div>
          </section>
        )}

        {category && (
          <div className="bg-white p-4 mb-6 shadow-sm border-l-4 border-blue-500 rounded-r-lg">
            <h1 className="text-2xl font-bold">Results for "{category}"</h1>
            <p className="text-sm text-gray-600">Check each product page for other buying options.</p>
          </div>
        )}

        {/* Main Product Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {category ? `All ${category}` : "Explore All Deals"}
            </h2>
            <div className="h-px flex-1 bg-gray-300 mx-4 hidden md:block"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id || product.name} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center shadow-sm rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-2">No products available. Please check back later.</h2>
              <p className="text-gray-600">We are adding new deals every day. Stay tuned!</p>
            </div>
          )}
        </div>

        <AdPlaceholder type="footer" />
      </div>

      {/* Earning Strategy Documentation (Hidden in UI, visible in code) */}
      {/* 
        EARNING STRATEGY:
        1. Traffic Strategy:
           - Focus on SEO for keywords like "Best [Category] under [Price]"
           - Create "Deal of the Day" pages to leverage urgency.
           - Use social media (Instagram/TikTok) to showcase "Amazon Must-Haves".
        
        2. Conversion Strategy:
           - Use high-quality images and clear discount badges.
           - The "View on Amazon" button is styled to match Amazon's own CTA for trust.
           - Real-time click tracking helps identify what's trending.

        3. Scaling Plan:
           - Start with 10-20 high-margin products.
           - Scale to 100+ products per week using bulk CSV imports (admin feature).
           - Automate via Amazon PA-API once eligible.

        4. Revenue Targets:
           - 500-1000 visitors/day -> ₹1,000/month
           - 5,000+ visitors/day -> ₹10,000/month
           - Viral traffic + SEO -> ₹1,00,000/month
      */}
    </div>
  );
}
