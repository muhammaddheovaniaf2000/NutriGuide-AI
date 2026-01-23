import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, LogIn } from 'lucide-react';
import http from '../api/http';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  // URL Unsplash dengan query 'healthy food' untuk estetika yang sesuai
  const backgroundUrl = "https://images.unsplash.com/photo-1543353071-10c8ba85a904?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await http.post('/login', form);
      localStorage.setItem('access_token', data.accessToken);
      navigate('/');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Login failed', 'error');
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      const { data } = await http.post('/google-login', { google_token: res.credential });
      localStorage.setItem('access_token', data.accessToken);
      navigate('/');
    } catch (err) { 
      console.error(err); 
      Swal.fire('Error', 'Google Login gagal', 'error');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4"
      style={{ backgroundImage: `url('${backgroundUrl}')` }}
    >
      {/* Overlay Gelap agar form lebih menonjol */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-[3rem] shadow-2xl p-10 relative z-10 border border-white/20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-emerald-600 tracking-tight">NutriGuide AI</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Smart Meal Planning with Gemini</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all">
            <LogIn size={18}/> Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-gray-400 text-xs font-bold uppercase tracking-widest">Or login with</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            theme="filled_blue" 
            shape="pill" 
            width="100%"
          />
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Belum punya akun? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}