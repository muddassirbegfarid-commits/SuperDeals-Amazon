import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, Chrome } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email === 'muddassirbegfarid@gmail.com') {
        navigate('/admin/dashboard');
      } else {
        await signOut(auth);
        throw new Error('Unauthorized: This account is not an admin.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === 'muddassirbegfarid@gmail.com') {
        navigate('/admin/dashboard');
      } else {
        throw new Error('Unauthorized: This account is not an admin.');
      }
    } catch (err: any) {
      setError(err.message || 'Google Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 flex items-center gap-1">
        <span className="text-3xl font-bold text-gray-900">SuperDeals</span>
        <span className="text-orange-500 font-bold text-3xl">.amazon</span>
      </Link>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black py-2 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-gray-400">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Chrome size={18} /> Sign in with Google
        </button>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Secure Admin Access Only</p>
          <p className="mt-2">Use your Firebase credentials to log in.</p>
        </div>
      </div>
    </div>
  );
}
