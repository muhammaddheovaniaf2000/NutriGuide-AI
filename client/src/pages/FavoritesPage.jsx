import { useEffect, useState } from 'react';
import { Heart, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router';
import http from '../api/http';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await http.get('/favorites');
      setFavorites(data);
    } catch (err) { console.error(err); }
  };

  if (favorites.length === 0) return (
    <div className="text-center py-20">
      <Heart size={48} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-xl font-bold text-gray-500">Belum ada resep favorit.</h2>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in">
      {favorites.map(fav => (
        <div key={fav.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <img src={fav.Recipe.image} className="w-full h-40 object-cover" alt="" />
          <div className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 line-clamp-1">{fav.Recipe.title}</h3>
            <Link to={`/recipe/${fav.RecipeId}`} className="block text-center py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all">
              Lihat Resep
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}