import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; 
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Kirim data ke backend
      await api.post('/register', { username, email, password });
      
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'You can now login with your new account.',
        confirmButtonColor: '#16a34a'
      });
      navigate('/login');
    } catch (error) {
      // PENTING: Ambil message dari response backend
      // Jika dimasmail.com dikirim, backend akan balas { message: "Invalid email format" }
      const serverMessage = error.response?.data?.message || 'Register failed';
      
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: serverMessage, // Ini yang akan menampilkan "Invalid email format"
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Latar Belakang */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1200&auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)',
          transform: 'scale(1.05)'
        }}
      />
      <div className="absolute inset-0 bg-black/45 z-10" />

      <div className="relative z-20 max-w-md w-full mx-4 bg-white/95 p-10 rounded-3xl shadow-2xl border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-green-700 font-serif tracking-tight">Join Us</h2>
          <p className="text-gray-600 mt-2 font-medium">Create your NutriGuide AI account</p>
        </div>

        {/* noValidate WAJIB ADA agar browser tidak sok tahu memvalidasi email */}
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
            <input
              type="text"
              placeholder="Your username"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <input
              type="text" // UBAH KE TEXT agar dimasmail.com bisa lolos ke backend
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] mt-2">
            Create Account
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-green-700 font-bold hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;