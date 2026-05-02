import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { DojoUser, UserRole } from './types';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { TrialsPage } from './pages/TrialsPage';

interface AuthContextType {
  user: User | null;
  userData: DojoUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signIn: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DojoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
       if (usersSnap.exists()) {
      const data = usersSnap.data() as DojoUser;
      
      if (data.status === 'approved') {
        setUserData(data);
      } else {
        // Kung hindi approved, i-sign out natin agad
        await auth.signOut();
        setUserData(null);
        alert("Member Access Not Approved. Ask School Admin.");
      }
    } else {
      // Kung wala sa database ang email, i-reject ang login
      await auth.signOut();
      setUserData(null);
      alert("Member Not Registered.");
   } // Closing ng if (usersSnap.exists())
    
    setLoading(false);
  }; // Closing ng onAuthStateChanged

  return () => unsubscribe();
}, [auth]); // Closing ng useEffect

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-mono">
        <div className="animate-pulse tracking-widest text-2xl font-black text-rose-600">LOADING DOJO...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, logout }}>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-600 selection:text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/trials" 
              element={<TrialsPage />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <MemberDashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/instructor" 
              element={userData?.role === 'instructor' || userData?.role === 'admin' ? <InstructorDashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/admin" 
              element={userData?.role === 'staff' || userData?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
