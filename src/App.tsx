import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { ShoppingCart, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';

function App() {
  const globalScriptsLoaded = useRef(false);

  useEffect(() => {
    if (globalScriptsLoaded.current) return;
    
    console.log("Adsterra: Injecting global popunder scripts...");
    
    const globalScripts = [
      { src: 'https://pl29019240.profitablecpmratenetwork.com/26/6d/c7/266dc76d142cf5055f43c70df7afb905.js', id: 'adsterra-popunder-2' }
    ];

    globalScripts.forEach(s => {
      if (!document.getElementById(s.id)) {
        const script = document.createElement('script');
        script.src = s.src;
        script.id = s.id;
        script.async = true;
        
        script.onload = () => console.log(`Adsterra: Global script loaded: ${s.id}`);
        script.onerror = () => console.error(`Adsterra: Global script failed: ${s.id}`);
        
        document.body.appendChild(script);
      }
    });

    globalScriptsLoaded.current = true;
  }, []);

  const bannerInjected = useRef(false);

  useEffect(() => {
    if (bannerInjected.current) return;
    
    const bannerContainer = document.getElementById('adsterra-bottom-banner');
    if (bannerContainer) {
      // @ts-ignore
      window.atOptions = {
        'key' : '4f6fd1f0acd9796b4c47c9c4972bf5e8',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
      
      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/4f6fd1f0acd9796b4c47c9c4972bf5e8/invoke.js';
      script.async = true;
      bannerContainer.appendChild(script);
      bannerInjected.current = true;
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-secondary bg-background">
        <Routes>
          {/* Admin routes without main navbar */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Public routes with main navbar */}
          <Route 
            path="*" 
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:category" element={<Home />} />
                    <Route path="/blog/best-wireless-earbuds-under-2000-india-2026" element={<BlogPost />} />
                  </Routes>
                </main>
                
                <footer className="bg-secondary text-white pt-20 pb-10">
                  <div className="max-w-[1500px] mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                      <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-1 group">
                          <div className="bg-primary p-1.5 rounded-lg">
                            <ShoppingCart className="text-white" size={24} />
                          </div>
                          <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black text-white tracking-tighter">SuperDeals</span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Expert Picks 2026</span>
                          </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Your trusted source for the best product deals and expert reviews in India. We help you make smarter buying decisions with real-time price tracking and expert analysis.
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg cursor-pointer"><Facebook size={18} /></div>
                          <div className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg cursor-pointer"><Twitter size={18} /></div>
                          <div className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg cursor-pointer"><Instagram size={18} /></div>
                          <div className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg cursor-pointer"><Youtube size={18} /></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                          <li className="hover:text-primary transition-colors cursor-pointer">About SuperDeals</li>
                          <li className="hover:text-primary transition-colors cursor-pointer">Expert Reviews</li>
                          <li className="hover:text-primary transition-colors cursor-pointer">Buying Guides</li>
                          <li className="hover:text-primary transition-colors cursor-pointer">Latest Deals</li>
                          <li className="hover:text-primary transition-colors cursor-pointer">Trending Now</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                          <li className="hover:text-primary transition-colors cursor-pointer">Contact Us</li>
                          <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
                          <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
                          <li className="hover:text-primary transition-colors cursor-pointer">Affiliate Disclaimer</li>
                          <li className="hover:text-primary transition-colors cursor-pointer">Cookie Policy</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold mb-6">Contact Info</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                          <li className="flex items-center gap-3"><MapPin size={18} className="text-primary" /> New Delhi, India</li>
                          <li className="flex items-center gap-3"><Phone size={18} className="text-primary" /> +91 98765 43210</li>
                          <li className="flex items-center gap-3"><Mail size={18} className="text-primary" /> contact@superdeals.com</li>
                        </ul>
                        <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Newsletter</p>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Email" className="bg-transparent border-none focus:ring-0 text-xs flex-1" />
                            <button className="bg-primary p-2 rounded-lg"><Mail size={14} /></button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <p className="text-xs text-gray-500 mb-2">
                          © 2026 SuperDeals India. All rights reserved. 
                        </p>
                        <p className="text-[10px] text-gray-600 max-w-2xl italic">
                          Disclaimer: As an Amazon Associate, we earn from qualifying purchases. This means we may earn a small commission if you buy through our links, at no extra cost to you.
                        </p>
                      </div>
                      <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="p-4 bg-primary hover:bg-[#e68a00] text-white rounded-2xl shadow-lg transition-all active:scale-90"
                      >
                        <ArrowUp size={24} />
                      </button>
                    </div>

                    <div className="mt-12 flex justify-center overflow-hidden">
                      <div id="adsterra-bottom-banner"></div>
                    </div>
                  </div>
                </footer>
                
                <BottomNav />
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
