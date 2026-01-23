import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Utensils, LogOut, HeartPulse, User, Heart } from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path 
    ? "bg-emerald-50 text-emerald-600 shadow-sm" 
    : "text-gray-500 hover:bg-gray-50 hover:text-emerald-500";

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 p-6 z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-emerald-600 p-2 rounded-xl text-white">
            <HeartPulse size={24} />
          </div>
          <span className="text-xl font-black text-gray-800 tracking-tight">NutriGuide</span>
        </div>

        <nav className="space-y-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all ${isActive('/')}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/recommend" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all ${isActive('/recommend')}`}>
            <Utensils size={20} /> Rekomendasi
          </Link>
          {/* Menu Favorite */}
          <Link to="/favorites" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all ${isActive('/favorites')}`}>
            <Heart size={20} /> Favorites
          </Link>
        </nav>

        <button onClick={handleLogout} className="absolute bottom-8 left-6 right-6 flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-semibold transition-all">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="ml-64 flex-1">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="font-bold text-gray-800">NutriGuide AI</h2>
          {/* Logo Profile bisa diklik */}
          <Link 
            to="/profile" 
            className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold hover:ring-2 hover:ring-emerald-500 transition-all cursor-pointer"
          >
            <User size={20}/>
          </Link>
        </header>
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}