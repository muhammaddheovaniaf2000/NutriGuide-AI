import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Heart, ChevronLeft, Flame } from 'lucide-react';
import http from '../api/http';
import Swal from 'sweetalert2';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // 1. Ambil detail resep
    http.get(`/recipes/${id}`)
      .then(({ data }) => setRecipe(data))
      .catch(err => console.error(err));

    // 2. CEK STATUS FAVORIT (Agar tombol tetap merah jika sudah pernah di-save)
    checkIfFavorite();
  }, [id]);

  const checkIfFavorite = async () => {
    try {
      const { data } = await http.get('/favorites');
      // Pastikan tipe data id disamakan (string vs number)
      const found = data.find(fav => String(fav.RecipeId) === String(id));
      if (found) setIsFavorite(true);
    } catch (err) {
      console.error("Gagal mengecek status favorit:", err);
    }
  };

  const handleAddToFavorite = async () => {
    try {
      // Jika sudah favorit, jangan kirim request lagi (atau buat fungsi delete)
      if (isFavorite) {
        return Swal.fire('Info', 'Resep ini sudah ada di favorit Anda.', 'info');
      }

      await http.post('/favorites', { RecipeId: id });
      setIsFavorite(true);
      Swal.fire({
        icon: 'success',
        title: 'Tersimpan!',
        text: 'Resep berhasil ditambahkan ke favorit.',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Gagal menambahkan favorit',
      });
    }
  };

  if (!recipe) return <div className="text-center p-20 font-bold">Memuat Resep...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-semibold transition-colors"
        >
          <ChevronLeft size={20} /> Kembali
        </button>
        
        <button 
          onClick={handleAddToFavorite}
          disabled={isFavorite} // Nonaktifkan jika sudah favorit
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-md ${
            isFavorite 
            ? 'bg-red-50 text-red-500 border border-red-100 cursor-default' 
            : 'bg-white text-gray-600 hover:text-red-500 border border-gray-100 active:scale-95'
          }`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          {isFavorite ? "Sudah di Favorit" : "Tambah ke Favorit"}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
        <img 
          src={recipe.imageUrl || recipe.image} // Antisipasi perbedaan nama field image
          alt={recipe.title} 
          className="w-full h-80 object-cover" 
        />
        <div className="p-10">
          <h1 className="text-4xl font-black text-gray-800 mb-4">{recipe.title}</h1>
          <p className="text-gray-500 leading-relaxed mb-8">{recipe.description}</p>
          
          <div className="flex gap-6 mb-10">
             <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-3">
                <Flame className="text-orange-500" />
                <div>
                  <p className="text-xs text-orange-600 font-bold uppercase">Kalori</p>
                  <p className="font-black text-orange-900">{recipe.calories} kkal</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}