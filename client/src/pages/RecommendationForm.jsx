import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import http from '../api/http';
import { setLoading, setAIResult } from '../features/aiSlice';

export default function RecommendationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.ai);
  const [form, setForm] = useState({ 
    weight: '', 
    height: '', 
    age: '', 
    gender: 'Male', 
    goal: 'Weight Loss' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const { data } = await http.post('/ai/recommendation', form);
      dispatch(setAIResult(data));
      navigate('/');
    } catch (err) { 
      console.error(err); 
      dispatch(setLoading(false)); 
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-800">Profil Fisik</h2>
        <p className="text-gray-500 mt-2">Isi data di bawah untuk mendapatkan rencana nutrisi yang tepat.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">Berat Badan</label>
            <input 
              type="number" 
              placeholder="kg" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
              onChange={e => setForm({...form, weight: e.target.value})} 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">Tinggi Badan</label>
            <input 
              type="number" 
              placeholder="cm" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
              onChange={e => setForm({...form, height: e.target.value})} 
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-2">Usia</label>
          <input 
            type="number" 
            placeholder="Masukkan usia Anda" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
            onChange={e => setForm({...form, age: e.target.value})} 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-2">Tujuan Kesehatan</label>
          <select 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none" 
            onChange={e => setForm({...form, goal: e.target.value})}
          >
            <option value="Weight Loss">Turunkan Berat Badan</option>
            <option value="Weight Gain">Naikkan Berat Badan</option>
            <option value="Maintenance">Jaga Berat Badan</option>
          </select>
        </div>

        <button 
          disabled={loading} 
          className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses Data...</span>
            </>
          ) : (
            "Dapatkan Rekomendasi"
          )}
        </button>
      </form>
    </div>
  );
}