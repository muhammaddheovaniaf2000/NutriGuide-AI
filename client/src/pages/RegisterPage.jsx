import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import http from '../api/http';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  // URL Unsplash dengan tema 'healthy lifestyle' agar sesuai dengan NutriGuide
  const backgroundUrl = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await http.post('/register', form);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Akun Anda telah dibuat. Silakan login.',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/login');
    } catch (err) { 
      Swal.fire('Error', err.response?.data?.message || 'Registrasi gagal', 'error'); 
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4"
      style={{ backgroundImage: `url('${backgroundUrl}')` }}
    >
      {/* Overlay Gelap & Blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-[3rem] shadow-2xl p-10 relative z-10 border border-white/20">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-emerald-100 rounded-2xl mb-4 text-emerald-600">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Daftar Akun</h2>
          <p className="text-gray-500 mt-2 text-sm">Mulai perjalanan sehatmu hari ini</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Username" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              onChange={e => setForm({...form, username: e.target.value})} 
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="Alamat Email" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Kata Sandi" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <button className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
            Buat Akun Sekarang
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Sudah punya akun? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}