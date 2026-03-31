import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import TrendingCard from '../components/TrendingCard';
import AdPlaceholder from '../components/AdPlaceholder';
import { subscribeToProducts } from '../services/productService';
import { Product, CATEGORIES } from '../types';
import { Loader2, TrendingUp, Clock, ArrowRight, Smartphone, Laptop, Headphones, Gamepad2, Home as HomeIcon, CheckCircle2, Star, ShieldCheck, Sparkles, Zap, Shirt, Utensils, Flower2, Watch } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORY_CONFIG = {
  'Electronics': { 
    icon: <Zap size={24} />, 
    color: 'bg-blue-50 text-blue-600',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800'
  },
  'Fashion': { 
    icon: <Shirt size={24} />, 
    color: 'bg-pink-50 text-pink-600',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800'
  },
  'Mobiles': { 
    icon: <Smartphone size={24} />, 
    color: 'bg-indigo-50 text-indigo-600',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'
  },
  'Laptops': { 
    icon: <Laptop size={24} />, 
    color: 'bg-purple-50 text-purple-600',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800'
  },
  'Home & Kitchen': { 
    icon: <Utensils size={24} />, 
    color: 'bg-green-50 text-green-600',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800'
  },
  'Beauty': { 
    icon: <Flower2 size={24} />, 
    color: 'bg-rose-50 text-rose-600',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  },
  'Accessories': { 
    icon: <Watch size={24} />, 
    color: 'bg-amber-50 text-amber-600',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
  },
};

export default function Home() {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyTrending, setWeeklyTrending] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
    }, category);

    return () => unsubscribe();
  }, [category]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All') return products;
    return products.filter(p => p.category === activeFilter);
  }, [products, activeFilter]);

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
          setWeeklyTrending(selected);
          return;
        }
      }

      const sorted = [...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 10);
      setWeeklyTrending(sorted);
      localStorage.setItem('weekly_trending_last_update', now.toString());
      localStorage.setItem('weekly_trending_ids', JSON.stringify(sorted.map(p => p.id)));
    };

    selectWeeklyTrending();
  }, [products, category]);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Section */}
      {!category && (
        <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-secondary">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Banner" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="max-w-[1500px] mx-auto px-4 h-full flex flex-col justify-center relative z-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">Limited Time Offers</span>
                <div className="flex items-center gap-1 text-primary">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-white">Top Rated Store 2026</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Best Deals & <span className="text-primary italic">Top Products</span> 2026
              </h1>
              <p className="text-lg text-gray-300 mb-8 font-medium">
                We handpick the best-selling products with the highest ratings and deepest discounts. Updated daily by our experts.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="btn-amazon px-8 py-4 text-base">Shop Now</button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-8 rounded-lg transition-all border border-white/20">
                  Explore Categories
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <div className="max-w-[1500px] mx-auto px-4">
        {/* Trust Bar */}
        {!category && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-10 relative z-30 mb-12">
            {[
              { icon: <CheckCircle2 className="text-green-500" />, title: "Trusted Reviews", desc: "100% verified expert opinions" },
              { icon: <Clock className="text-blue-500" />, title: "Updated 2026", desc: "Latest prices and availability" },
              { icon: <ShieldCheck className="text-primary" />, title: "Top Picks by Experts", desc: "Handpicked for quality & value" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-soft flex items-center gap-4 border border-gray-100">
                <div className="bg-gray-50 p-3 rounded-xl">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-secondary">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Grid */}
        {!category && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-secondary">Shop by Category</h2>
              <Link to="/" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {CATEGORIES.map((cat) => {
                const config = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG] || { 
                  icon: <Sparkles size={24} />, 
                  color: 'bg-gray-50 text-gray-600',
                  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
                };
                return (
                  <Link 
                    key={cat} 
                    to={`/category/${encodeURIComponent(cat)}`}
                    className="group relative h-48 rounded-3xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-500"
                  >
                    <img 
                      src={config.image} 
                      alt={cat} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center mb-3 shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300`}>
                        {config.icon}
                      </div>
                      <h3 className="text-white font-black text-lg leading-tight group-hover:text-primary transition-colors">{cat}</h3>
                      <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                        Shop Now <ArrowRight size={10} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Featured Guide Banner */}
        {!category && (
          <section className="mb-16">
            <Link to="/blog/best-wireless-earbuds-under-2000-india-2026" className="block relative h-64 md:h-80 rounded-[2rem] overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/60 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80&w=2000" 
                alt="Best Earbuds 2026" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-center max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Editor's Choice</span>
                  <span className="text-white/80 text-xs font-bold">12 Min Read</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  🔥 Best Wireless Earbuds <br /> <span className="text-primary italic">Under ₹2000</span> in India
                </h2>
                <p className="text-gray-300 text-sm md:text-base font-medium mb-6 line-clamp-2">
                  We tested 50+ earbuds to find the ultimate winners. See which boAt, Noise, and Realme buds made the cut for 2026.
                </p>
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                  Read Full Guide <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Trending Section */}
        {!category && weeklyTrending.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-xl">
                  <TrendingUp className="text-red-600" size={24} />
                </div>
                <h2 className="text-2xl font-black text-secondary">Trending Now</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Clock size={14} />
                Updated 1 hour ago
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {weeklyTrending.slice(0, 4).map((product) => (
                <ProductCard key={`trending-${product.id}`} product={product} isTrending />
              ))}
            </div>
          </section>
        )}

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black text-secondary">
                  {category ? `Best ${category} 2026` : "Featured Deals Today"}
                </h2>
                {category && (
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Expert-reviewed {category.toLowerCase()} with top ratings and best value for money.
                  </p>
                )}
              </div>
              
              {/* Simple Filter System */}
              {!category && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  {['All', 'Mobiles', 'Laptops', 'Headphones'].map((filter) => (
                    <button 
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                        activeFilter === filter 
                          ? 'bg-primary border-primary text-white shadow-md' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {category && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-secondary mb-2 flex items-center gap-2">
                  <ShieldCheck className="text-primary" size={20} />
                  Why trust our {category} picks?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our team spends hundreds of hours testing and comparing the latest {category.toLowerCase()} in the Indian market. We analyze real user reviews, technical specifications, and long-term reliability to bring you only the best options available on Amazon.
                </p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id || product.name} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center shadow-soft rounded-2xl border border-gray-100">
                <h2 className="text-xl font-bold mb-2">No products available.</h2>
                <p className="text-gray-600">We are adding new deals every day. Stay tuned!</p>
              </div>
            )}
          </div>
        </div>

        {/* Blog / Guides Section */}
        {!category && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-secondary">Buying Guides & Tips</h2>
              <Link to="/blog/best-wireless-earbuds-under-2000-india-2026" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                Read All Guides <ArrowRight size={16} />
              </Link>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "Best Wireless Earbuds Under ₹2000 in India (2026)", 
                excerpt: "Looking for the best audio experience on a budget? Here are our top picks for 2026.",
                image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
                link: "/blog/best-wireless-earbuds-under-2000-india-2026"
              },
              { 
                title: "Top 5 Smartphones for Photography 2026", 
                excerpt: "Capture every moment with these top-rated camera phones selected by our experts.",
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
                link: "/"
              },
              { 
                title: "Essential Gaming Gear for Pro Players", 
                excerpt: "Level up your gaming setup with these must-have accessories and peripherals.",
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
                link: "/"
              }
            ].map((post, i) => (
                <Link key={i} to={post.link} className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 border border-gray-100">
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Read More</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdPlaceholder type="footer" />
      </div>
    </div>
  );
}
