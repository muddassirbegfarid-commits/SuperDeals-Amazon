import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Hero from '../components/Hero';
import FireBanner from '../components/FireBanner';
import SuperHotDeals from '../components/SuperHotDeals';
import ProductCard from '../components/ProductCard';
import TrendingCard from '../components/TrendingCard';
import AdPlaceholder from '../components/AdPlaceholder';
import { subscribeToProducts, updateLastShownDates } from '../services/productService';
import { Product, CATEGORIES } from '../types';
import { Loader2, TrendingUp, Sparkles, Flame, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fireDeals, setFireDeals] = useState<Product[]>([]);
  const [weeklyTrending, setWeeklyTrending] = useState<Product[]>([]);
  const rotationProcessed = React.useRef(false);
  const bannerLoaded = React.useRef(false);

  useEffect(() => {
    if (bannerLoaded.current) return;
    
    const bannerId = 'adsterra-native-banner';
    const bannerSrc = 'https://pl29019241.profitablecpmratenetwork.com/97063c5d2bee1dc6de0c0cacfe758e79/invoke.js';

    if (!document.getElementById(bannerId)) {
      console.log("Adsterra: Injecting native banner script...");
      const script = document.createElement('script');
      script.src = bannerSrc;
      script.id = bannerId;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      
      script.onload = () => console.log("Adsterra: Native banner script loaded successfully");
      script.onerror = () => console.error("Adsterra: Native banner script failed to load");
      
      document.body.appendChild(script);
    }

    bannerLoaded.current = true;
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
    }, category);

    return () => unsubscribe();
  }, [category]);

  // Advanced Rotation Logic for Fire Banner (Daily)
  useEffect(() => {
    if (products.length === 0 || category || rotationProcessed.current) return;

    const selectFireDeals = async () => {
      const now = Date.now();
      const lastUpdate = localStorage.getItem('fire_deals_last_update');
      const cachedDeals = localStorage.getItem('fire_deals_ids');
      const targetCount = Math.min(5, products.length);

      // Check if 24 hours have passed
      if (lastUpdate && cachedDeals && (now - parseInt(lastUpdate)) < 24 * 60 * 60 * 1000) {
        const ids = JSON.parse(cachedDeals);
        const selected = products.filter(p => ids.includes(p.id));
        if (selected.length >= targetCount) {
          setFireDeals(selected);
          rotationProcessed.current = true;
          return;
        }
      }

      // Selection Logic: Top products by clicks, excluding recently shown
      const sortedByClicks = [...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      
      // Exclude products shown in last 24h (if possible)
      let available = sortedByClicks.filter(p => {
        if (!p.lastShownDate) return true;
        const lastShown = p.lastShownDate.toMillis ? p.lastShownDate.toMillis() : new Date(p.lastShownDate).getTime();
        return (now - lastShown) > 24 * 60 * 60 * 1000;
      });

      // Fallback if not enough available
      if (available.length < targetCount) {
        available = sortedByClicks;
      }

      // Take top 10 and shuffle to pick 5
      const top10 = available.slice(0, 10);
      const shuffled = top10.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, targetCount);

      setFireDeals(selected);
      localStorage.setItem('fire_deals_last_update', now.toString());
      localStorage.setItem('fire_deals_ids', JSON.stringify(selected.map(p => p.id)));
      
      // Update lastShownDate in Firebase
      rotationProcessed.current = true;
      if (selected.length > 0) {
        await updateLastShownDates(selected.map(p => p.id as string));
      }
    };

    selectFireDeals();
  }, [products, category]);

  // Trending This Week Logic (3-Day Rotation)
  useEffect(() => {
    if (products.length === 0 || category) return;

    const selectWeeklyTrending = () => {
      const now = Date.now();
      const lastUpdate = localStorage.getItem('weekly_trending_last_update');
      const cachedIds = localStorage.getItem('weekly_trending_ids');

      if (lastUpdate && cachedIds && (now - parseInt(lastUpdate)) < 3 * 24 * 60 * 60 * 1000) {
        const ids = JSON.parse(cachedIds);
        const selected = products.filter(p => ids.includes(p.id));
        if (selected.length > 0) {
          // Only update state if it's different to avoid re-render loop
          setWeeklyTrending(prev => {
            const prevIds = prev.map(p => p.id).sort().join(',');
            const nextIds = selected.map(p => p.id).sort().join(',');
            return prevIds === nextIds ? prev : selected;
          });
          return;
        }
      }

      // Calculate Trending Score: clicks + weight for recent clicks
      const scored = products.map(p => {
        let score = p.clicks || 0;
        if (p.lastClickedAt) {
          const lastClicked = p.lastClickedAt.toMillis ? p.lastClickedAt.toMillis() : new Date(p.lastClickedAt).getTime();
          const hoursSinceClick = (now - lastClicked) / (1000 * 60 * 60);
          if (hoursSinceClick < 72) {
            score += (72 - hoursSinceClick) * 0.5; // Weight recent clicks
          }
        }
        return { ...p, trendingScore: score };
      });

      const sorted = scored.sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 10);
      setWeeklyTrending(sorted);
      localStorage.setItem('weekly_trending_last_update', now.toString());
      localStorage.setItem('weekly_trending_ids', JSON.stringify(sorted.map(p => p.id)));
    };

    selectWeeklyTrending();
  }, [products, category]);

  // Category Trending Logic
  const trendingByCategory = useMemo(() => {
    if (category) return [];
    const topPerCategory: Product[] = [];
    CATEGORIES.forEach(cat => {
      const catProducts = products.filter(p => p.category === cat);
      if (catProducts.length > 0) {
        const sorted = [...catProducts].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
        topPerCategory.push(sorted[0]);
      }
    });
    return topPerCategory.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  }, [products, category]);

  return (
    <div className="bg-[#eaeded] min-h-screen pb-12">
      {!category && (
        <>
          <SuperHotDeals products={products} />
          {fireDeals.length > 0 ? <FireBanner products={fireDeals} /> : <Hero />}
        </>
      )}
      
      <div className="max-w-[1500px] mx-auto px-4 -mt-20 relative z-10">
        <div className="my-8">
          <div id="container-97063c5d2bee1dc6de0c0cacfe758e79"></div>
        </div>

        {/* Trending This Week Section */}
        {!category && weeklyTrending.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-600">
              <div className="bg-blue-100 p-2 rounded-full">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">🔥 Trending This Week</h2>
                <p className="text-sm text-gray-500 font-medium">Updated every 72 hours based on user activity</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Clock size={14} />
                NEXT UPDATE IN {Math.max(0, Math.ceil((3 * 24 * 60 * 60 * 1000 - (Date.now() - parseInt(localStorage.getItem('weekly_trending_last_update') || '0'))) / (1000 * 60 * 60)))} HOURS
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Highlight Top Product */}
              <div className="md:col-span-2 lg:col-span-2">
                <ProductCard product={weeklyTrending[0]} isTrending />
              </div>
              {weeklyTrending.slice(1, 5).map((product) => (
                <ProductCard key={`weekly-${product.id}`} product={product} isTrending />
              ))}
            </div>
          </section>
        )}

        {/* Category Trending Section */}
        {!category && trendingByCategory.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
              <div className="bg-orange-100 p-2 rounded-full">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Top Picks by Category</h2>
                <p className="text-sm text-gray-500 font-medium">The most popular deal in every department</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingByCategory.slice(0, 8).map((product, index) => (
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
