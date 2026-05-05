import { Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import academyLogo from '../../assets/logoo.png';

export function Navbar() {
  const { user, userData, signIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Helper function para sa smooth scroll at pagsara ng mobile menu
  const handleScroll = (e, id) => {
    setIsOpen(false);
    // Kung nasa ibang page (e.g. /trials), hahayaan nating gumana ang default anchor behavior
    // Pero kung nasa Home lang, pwede itong i-animate via CSS (scroll-behavior: smooth)
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-100 h-20 flex items-center px-6 md:px-12 justify-between">
      
      {/* LOGO + TITLE */}
      <Link to="/" className="flex items-center gap-4 group">
        <img src={academyLogo} alt="Logo" className="h-12 md:h-14 w-auto" />
        <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 uppercase leading-tight">
          Taekwondo Academy
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 uppercase tracking-widest">
        <Link to="/" className="text-black hover:text-rose-600 transition-colors">Home</Link>
        
        {/* --- MGA BAGONG LINKS --- */}
        <a href="#history" className="text-black hover:text-rose-600 transition-colors">History</a>
        <a href="#trainers" className="text-black hover:text-rose-600 transition-colors">Trainers</a>
        <a href="#schedules" className="text-black hover:text-rose-600 transition-colors">Schedules</a>
        {/* ------------------------ */}

        <Link to="/trials" className="text-black hover:text-rose-600 transition-colors">Trials</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-rose-600 transition-colors">Portal</Link>

            {(userData?.role === 'staff' || userData?.role === 'admin') && (
              <Link to="/admin" className="text-slate-900 hover:text-rose-600">Admin</Link>
            )}

            <button onClick={logout} className="flex items-center gap-2 hover:text-rose-600 transition-colors cursor-pointer">
              <LogOut size={16} />
              Sign Out
            </button>
          </>
        ) : (
          <button onClick={signIn} className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 cursor-pointer">
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-6 md:hidden shadow-xl"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-rose-600">Home</Link>
            
            {/* --- MOBILE LINKS --- */}
            <a href="#history" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-rose-600">History</a>
            <a href="#trainers" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-rose-600">Trainers</a>
            <a href="#schedules" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-rose-600">Schedules</a>
            {/* -------------------- */}

            <Link to="/trials" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-rose-600">Trials</Link>

            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-rose-600">Portal</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="text-sm font-bold text-left uppercase tracking-widest text-slate-600 hover:text-rose-600">
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => { signIn(); setIsOpen(false); }} className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold tracking-widest">
                Sign In
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
