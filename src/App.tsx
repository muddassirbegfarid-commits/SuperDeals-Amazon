import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const globalScriptsLoaded = useRef(false);

  useEffect(() => {
    if (globalScriptsLoaded.current) return;
    
    console.log("Adsterra: Injecting global popunder scripts...");
    
    const globalScripts = [
      { src: 'https://pl29019239.profitablecpmratenetwork.com/31/89/e6/3189e6b29da819c917ece2ba815c49b5.js', id: 'adsterra-popunder-1' },
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

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-[#0F1111]">
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
                  </Routes>
                </main>
                <footer className="bg-[#232f3e] text-white">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full bg-[#37475a] hover:bg-[#485769] py-4 text-sm font-medium transition-colors"
                  >
                    Back to top
                  </button>
                  <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h4 className="font-bold mb-4">Get to Know Us</h4>
                      <ul className="text-sm space-y-2 text-gray-300">
                        <li className="hover:underline cursor-pointer">About Us</li>
                        <li className="hover:underline cursor-pointer">Careers</li>
                        <li className="hover:underline cursor-pointer">Press Releases</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Connect with Us</h4>
                      <ul className="text-sm space-y-2 text-gray-300">
                        <li className="hover:underline cursor-pointer">Facebook</li>
                        <li className="hover:underline cursor-pointer">Twitter</li>
                        <li className="hover:underline cursor-pointer">Instagram</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Make Money with Us</h4>
                      <ul className="text-sm space-y-2 text-gray-300">
                        <li className="hover:underline cursor-pointer">Sell on Amazon</li>
                        <li className="hover:underline cursor-pointer">Become an Affiliate</li>
                        <li className="hover:underline cursor-pointer">Advertise Your Products</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4">Let Us Help You</h4>
                      <ul className="text-sm space-y-2 text-gray-300">
                        <li className="hover:underline cursor-pointer">COVID-19 and Amazon</li>
                        <li className="hover:underline cursor-pointer">Your Account</li>
                        <li className="hover:underline cursor-pointer">Help</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-gray-700 text-center text-xs text-gray-400">
                    <p>© 2026 SuperDeals on Amazon. All rights reserved. This site is an affiliate store.</p>
                  </div>
                </footer>
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
