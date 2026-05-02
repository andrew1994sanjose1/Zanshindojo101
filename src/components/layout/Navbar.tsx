import { Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { Menu, X, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, userData, signIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-100 h-20 flex items-center px-6 md:px-12 justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-rose-200">
          <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1 h-3 bg-white rotate-45"></div>
          </div>
        </div>
        <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
          Zanshin<span className="text-rose-600">Dojo</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 uppercase tracking-widest">
        <Link to="/" className="hover:text-rose-600 transition-colors">Home</Link>
        <Link to="/trials" className="hover:text-rose-600 transition-colors text-rose-600">Trials</Link>
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
          <button onClick={signIn} disabled className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 cursor-pointer">
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-6 md:hidden shadow-xl"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-rose-600">Home</Link>
            <Link to="/trials" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-rose-600">Trials</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-rose-600">Portal</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="text-sm font-bold text-left uppercase tracking-widest text-slate-600 hover:text-rose-600">Sign Out</button>
              </>
            ) : (
              <button onClick={() => { signIn(); setIsOpen(false); }} disabled className="bg-slate-100 text-slate-400 px-6 py-3 rounded-full font-bold tracking-widest opacity-60 cursor-not-allowed">Sign In</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

