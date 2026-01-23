import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { Flame, Activity } from 'lucide-react';

export default function Dashboard() {
  const { analysis, recipes, loading } = useSelector((state) => state.ai);

  if (!analysis && !loading) return (
    <div className="text-center py-20">
      <Activity size={48} className="mx-auto text-emerald-600 mb-4" />
      <h2 className="text-2xl font-bold">Belum ada analisis</h2>
      <Link to="/recommend" className="mt-4 inline-block px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold">Mulai Analisis</Link>
    </div>
  );

  return (
    <div className="space-y-8">
      <section className="bg-emerald-600 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-4xl font-black">{analysis.health_metrics.bmi_category}</h2>
          <p className="mt-2 opacity-80">BMI: {analysis.health_metrics.bmi}</p>
        </div>
        <div className="bg-white/20 p-6 rounded-3xl text-center backdrop-blur-md border border-white/30">
          <Flame className="mx-auto mb-1" size={24} />
          <p className="text-2xl font-black">{analysis.health_metrics.daily_calories_target} kcal</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
            <img src={recipe.image} className="w-full h-48 object-cover" alt={recipe.title} />
            <div className="p-6">
              <h3 className="font-bold text-gray-800 line-clamp-1 mb-4">{recipe.title}</h3>
              <Link to={`/recipe/${recipe.id}`} className="block text-center py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all">Detail Resep</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}