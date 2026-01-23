import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/index';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('access_token', data.access_token);
      Swal.fire('Welcome!', 'Login successful', 'success');
      navigate('/');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Login failed', 'error');
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const { data } = await api.post('/google-login', { 
        googleToken: response.credential 
      });
      localStorage.setItem('access_token', data.access_token);
      navigate('/');
    } catch (error) {
      Swal.fire('Error', 'Google Login failed', 'error');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image dengan Soft Blur */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=1200&auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)', // Nilai blur dikurangi agar lebih jelas
          transform: 'scale(1.05)' // Sedikit zoom untuk menghilangkan garis putih di pinggir
        }}
      />
      
      {/* Overlay Gelap (Sedikit lebih tebal untuk mengimbangi blur yang tipis) */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Login Card */}
      <div className="relative z-20 max-w-md w-full mx-4 bg-white/95 p-10 rounded-3xl shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-green-700 font-serif tracking-tight">
            NutriGuide AI
          </h2>
          <p className="text-gray-600 mt-2 font-medium">Your journey to healthy eating starts here</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-50"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-50"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-green-100 transition-all active:scale-[0.98]">
            Sign In
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <span className="relative bg-white px-4 text-sm text-gray-400 font-medium">
            Or continue with
          </span>
        </div>

        {/* Google Login Button Container */}
        <div className="flex justify-center w-full">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => console.log('Login Failed')}
            theme="outline"
            shape="pill"
            width="320px"
          />
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? {' '}
          <Link to="/register" className="text-green-700 font-bold hover:text-green-800 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;