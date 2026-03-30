import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-[#0F1111]">
        <Routes>
          {/* Admin routes without main navbar */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
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
