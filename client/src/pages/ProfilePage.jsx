import { useState, useEffect } from 'react';
import { User, Mail, Save, ChevronLeft, personStanding, Hash } from 'lucide-react';
import { useNavigate } from 'react-router';
import http from '../api/http';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    gender: '', // Tambahkan field sesuai backend
    age: ''     // Tambahkan field sesuai backend
  });

  const fetchProfile = async () => {
    try {
      const { data } = await http.get('/users/me');
      setUser({
        username: data.username || '',
        email: data.email || '',
        gender: data.gender || 'Male',
        age: data.age || ''
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Gagal memuat data profil', 'error');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim seluruh data yang diminta oleh destructuring di backend
      const payload = {
        username: user.username,
        email: user.email,
        gender: user.gender,
        age: Number(user.age) // Pastikan age berupa angka
      };

      // Gunakan PUT/PATCH sesuai router backend Anda
      await http.put('/users/me', payload); 
      
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil Anda telah diperbarui.',
        timer: 1500,
        showConfirmButton: false
      });

      fetchProfile();
    } catch (err) {
      console.error("Update Error:", err.response);
      Swal.fire('Gagal', err.response?.data?.message || 'Gagal memperbarui profil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-6 font-semibold transition-all">
        <ChevronLeft size={20} /> Kembali
      </button>

      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
        <header className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">Pengaturan Profil</h1>
            <p className="text-gray-500">Kelola informasi akun Anda</p>
          </div>
        </header>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
              <input 
                type="text" 
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>
          </div>

          {/* Gender & Age Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">Gender</label>
              <select 
                value={user.gender}
                onChange={(e) => setUser({...user, gender: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
              >
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">Usia</label>
              <input 
                type="number" 
                value={user.age}
                onChange={(e) => setUser({...user, age: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Thn"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-2 opacity-60">
            <label className="text-sm font-bold text-gray-700 ml-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="email" value={user.email} readOnly className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-100 rounded-2xl cursor-not-allowed" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}