import { useAuth } from '../App';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Trophy, Book, Calendar, Settings, ChevronRight, Zap, Target, CreditCard, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DojoClass, UserProgress } from '../types';
import { useSearchParams } from 'react-router-dom';

export function MemberDashboard() {
  const { userData, user } = useAuth();
  const [classes, setClasses] = useState<DojoClass[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  // 1. Logic para sa User Progress at Classes (Async Fix)
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        // Fetch user progress
        const progressRef = doc(db, 'progress', user.uid);
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists()) {
          setProgress(progressSnap.data() as UserProgress);
        }

        // Fetch dojo classes (Ito yung Line 87 error fix)
        const q = query(collection(db, 'classes'));
        const querySnapshot = await getDocs(q);
        setClasses(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as DojoClass)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user, db]);

  // 2. Logic para sa PayMongo Payment
  const handlePayment = async () => {
    setIsPaying(true);
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + btoa('sk_test_PYGoLvTtaMmAQtvf1htbPEua:')
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description: 'Zenith Dojo Monthly Membership Fee',
            line_items: [
              {
                amount: 5000,
                currency: 'USD',
                name: 'Monthly membership fee',
                quantity: 1
              }
            ],
            payment_method_allowed: ['card'],
            success_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=success',
            cancel_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=cancelled'
          }
        }
      })
    };

    try {
      const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options);
      const result = await response.json();
      if (result.data?.attributes?.checkout_url) {
        window.location.href = result.data.attributes.checkout_url;
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsPaying(false);
    }
  };
  return (
    <div className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen bg-slate-50">
      {paymentStatus === 'success' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold"
        >
          <CheckCircle2 size={20} />
          Payment successful! Your membership has been updated.
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar / Profile Info */}
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] text-center relative overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="absolute top-0 left-0 w-full h-2 bg-rose-600" />
            <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-rose-200">
              {userData.displayName?.[0] || 'U'}
            </div>
            <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight mb-1">{userData.displayName}</h2>
            <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black mb-4">{userData.role}</p>
            <div className="flex justify-center gap-2 mb-6">
               <span className="bg-rose-50 text-rose-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
                 {userData.rank || 'White Belt'}
               </span>
            </div>
            <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xl font-black text-slate-900">{progress?.totalXP || 0}</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Total XP</div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900">{progress?.completedTutorials.length || 0}</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Lessons</div>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20">
             <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-rose-500" size={20} />
                <h3 className="text-xs font-black uppercase tracking-widest">Active Membership</h3>
             </div>
             <p className="text-slate-400 text-[10px] uppercase font-bold mb-6">Next renewal: May 2024</p>
             <button 
                onClick={handlePayment}
                disabled={isPaying}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-rose-900/40 cursor-pointer"
             >
                {isPaying ? 'Processing...' : 'Pay Monthly Fees'}
             </button>
          </div>

          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <Calendar size={14} className="text-rose-600" /> Attendance QR
             </h3>
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 inline-block mx-auto">
               <QRCodeSVG value={JSON.stringify({ uid: user?.uid, action: 'attendance' })} size={160} fgColor="#0f172a" />
             </div>
             <p className="text-slate-400 text-[10px] mt-6 uppercase tracking-widest text-center font-bold">Show this code to Sensei</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-8">
          
          {/* Progress Overview */}
          <section className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-3 tracking-tighter">
                  <Target className="text-rose-600" /> Mastery Path
                </h2>
                <div className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase font-black tracking-widest">Level {(Math.floor((progress?.totalXP || 0) / 100)) + 1}</div>
             </div>
             <div className="bg-slate-100 h-3 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress?.totalXP || 0) % 100}%` }}
                  className="h-full bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.4)]" 
                />
             </div>
             <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{(progress?.totalXP || 0) % 100} / 100 XP to next belt tier</p>
          </section>

          {/* Quick Actions / Stats */}
          <div className="grid lg:grid-cols-2 gap-8">
             <section className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-450 mb-6 border-b border-slate-50 pb-4">Schedule</h3>
                <div className="space-y-4">
                   {classes.length > 0 ? classes.map(c => (
                     <div key={c.id} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-4 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                        <div>
                           <div className="font-black text-sm uppercase text-slate-900">{c.title}</div>
                           <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">{c.dayOfWeek} • {c.startTime}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                           <ChevronRight size={16} className="text-slate-300 group-hover:text-rose-600" />
                        </div>
                     </div>
                   )) : (
                     <p className="text-slate-400 text-xs italic font-medium">No sessions currently scheduled.</p>
                   )}
                </div>
             </section>

             <section className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-50 pb-4">Activity</h3>
                <div className="space-y-6">
                   <LessonItem title="Heian Shodan Fundamentals" xp={20} status="In Progress" color="bg-indigo-500" />
                   <LessonItem title="Basic Punching (Tsuki)" xp={10} status="Completed" color="bg-rose-600" />
                   <LessonItem title="Dojo Etiquette" xp={5} status="Completed" color="bg-rose-600" />
                </div>
             </section>
          </div>

          {/* Shop / Orders Quick Access */}
          <section className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
             <div className="relative z-10">
                <h3 className="text-3xl font-black text-white uppercase mb-2 tracking-tighter">Pro Equipment</h3>
                <p className="text-slate-400 text-sm font-medium">Get certified gi and sparring gear from our world-wide store.</p>
             </div>
             <button className="relative z-10 bg-rose-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-700 hover:scale-105 transition-all text-xs shadow-xl shadow-rose-900/40 cursor-pointer">
               Explore Shop
             </button>
          </section>

        </main>
      </div>
    </div>
  );
}

function LessonItem({ title, xp, status, color }: { title: string, xp: number, status: string, color: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className={`w-3 h-3 rounded-full ${color} shadow-lg shadow-${color.replace('bg-', '')}/30`} />
      <div className="flex-1">
        <div className="font-black text-xs uppercase tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">{title}</div>
        <div className="flex items-center gap-2 mt-1">
           <Zap size={10} className="text-indigo-500" />
           <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">{xp} XP REWARD</span>
        </div>
      </div>
      <div className={`text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded-md ${status === 'Completed' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
        {status}
      </div>
    </div>
  );
}
