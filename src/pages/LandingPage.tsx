import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useAuth } from '../App';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import bannerImg from '../assets/banner.jpg';
import { Play, Shield, Target, ArrowRight, Clock, MapPin } from 'lucide-react';

export function LandingPage() {
  const { signIn } = useAuth();
  const [trialForm, setTrialForm] = useState({ name: '', email: '', phone: '', preferredDate: '' });
  const [formStatus, setFormStatus] = useState<null | 'success' | 'error'>(null);

  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'trials'), {
        ...trialForm,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setFormStatus('success');
      setTrialForm({ name: '', email: '', phone: '', preferredDate: '' });
    } catch (err) {
      setFormStatus('error');
    }
  };

  return (
    <div className="pt-20 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-24 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <img 
            src={bannerImg}
            className="w-full h-full object-cover opacity-30"
            alt="Dojo Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/20 to-transparent"></div>
        </div>
        
        <div className="grid md:grid-cols-12 items-center gap-12 max-w-7xl mx-auto z-10 w-full">
          <div className="md:col-span-6 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl w-fit shadow-sm border border-slate-100"
            >
              <div className="bg-black p-2 rounded-xl text-white">
                <Clock size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1 text-left">Open Today</span>
                <span className="text-sm font-bold text-slate-900">8:00 AM - 6:00 PM</span>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl font-black leading-[1.1] text-slate-900 tracking-tight text-left"
            >
              Master the Way of the <span className="text-black underline underline-offset-4">Warrior.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-slate-600 leading-relaxed max-w-md font-medium text-left"
            >
              Join the most advanced training center in Baliwag. Ancient tradition meets modern discipline.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-4"
            >
              <button 
                onClick={() => signIn()}
                className="w-full sm:w-auto px-10 py-5 bg-black text-white rounded-2xl text-lg font-bold shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                Enroll Now <ArrowRight size={20} />
              </button>
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                <MapPin size={14} className="text-rose-600" /> Baliwag, Bulacan
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-6 hidden md:block relative">
             <div className="relative z-10 rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=2070&auto=format&fit=crop" alt="Training" />
             </div>
             <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 max-w-[200px]">
                <p className="text-xs font-black uppercase text-slate-400 mb-2">Next Session</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">Advanced Kata Practice</p>
                <p className="text-rose-600 font-black text-xs mt-2">Starts in 15 mins</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. HISTORY SECTION */}
      <section id="history" className="py-32 bg-white border-y border-slate-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center text-left">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="text-[12rem] font-black text-slate-50 absolute -top-20 -left-10 select-none">1994</div>
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none relative z-10">
              A Legacy of <span className="text-black">Discipline.</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-8 relative z-10">
              Founded in Osaka in 1994, Zanshin Dojo has preserved the authentic Shitoryu style while embracing modern pedagogical techniques.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
               <div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter">30+</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Years Experience</p>
               </div>
               <div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter">15k+</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Graduates</p>
               </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1549413204-637dc4a36224?q=80&w=2074&auto=format&fit=crop" className="rounded-3xl shadow-xl" alt="Training" />
                <img src="https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?q=80&w=2069&auto=format&fit=crop" className="rounded-3xl shadow-xl" alt="Atmosphere" />
             </div>
             <div className="pt-12">
                <img src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop" className="rounded-3xl shadow-xl h-full object-cover" alt="Sensei" />
             </div>
          </div>
        </div>
      </section>

      {/* 3. SCHEDULE SECTION (GITNA) */}
      <section id="schedule" className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-left">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-rose-600" size={20} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Weekly Timetable</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Training <span className="text-slate-400">Schedules.</span>
              </h2>
            </div>
            <p className="text-slate-500 font-medium text-sm max-w-xs md:text-right">
              We offer flexible hours for kids, teens, and adults. Check our seasonal slots below.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Class Type</th>
                  <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Mon - Wed</th>
                  <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Thu - Fri</th>
                  <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Saturday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <ScheduleRow type="Kids Karate (Ages 5-12)" mw="4:00 PM - 5:00 PM" tf="4:00 PM - 5:00 PM" sat="9:00 AM - 10:30 AM" />
                <ScheduleRow type="Teens & Adults (Beginner)" mw="5:30 PM - 7:00 PM" tf="5:30 PM - 7:00 PM" sat="11:00 AM - 12:30 PM" />
                <ScheduleRow type="Advanced Kata & Kumite" mw="7:30 PM - 9:00 PM" tf="7:30 PM - 9:00 PM" sat="2:00 PM - 4:00 PM" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. INSTRUCTORS SECTION */}
      <section id="instructors" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-20">Master Instructors</h2>
           <div className="grid md:grid-cols-3 gap-12">
              <InstructorCard name="Sensei Ryu Tanaka" role="7th Dan Master" desc="Head instructor with specialized expertise in Shito-ryu Katas." img="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop" />
              <InstructorCard name="Sensei Hana Mori" role="5th Dan Specialist" desc="World championship medalist focusing on competitive Kumite." img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" />
              <InstructorCard name="Sensei Kenji Sato" role="4th Dan Instructor" desc="Expert in youth development and physical coordination drills." img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" />
           </div>
        </div>
      </section>

      {/* 5. TRIAL FORM SECTION */}
      <section id="trials" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white shadow-3xl text-left">
          <div>
            <h2 className="text-4xl font-black uppercase leading-none mb-4">Start your 1-week <span className="text-rose-500">Free</span> Trial.</h2>
            <p className="text-slate-400 font-medium">Limited slots available for this month's intake. Reserve your spot today.</p>
          </div>
          <form onSubmit={handleTrialSubmit} className="space-y-4">
            <input required type="text" placeholder="Your Name" value={trialForm.name} onChange={(e) => setTrialForm({...trialForm, name: e.target.value})} className="w-full bg-white/10 border border-white/20 p-4 rounded-xl outline-none focus:border-rose-500 transition-all text-white" />
            <input required type="email" placeholder="Email Address" value={trialForm.email} onChange={(e) => setTrialForm({...trialForm, email: e.target.value})} className="w-full bg-white/10 border border-white/20 p-4 rounded-xl outline-none focus:border-rose-500 transition-all text-white" />
            <button className="w-full bg-rose-600 text-white p-4 rounded-xl font-black uppercase tracking-widest hover:bg-rose-700 transition-all cursor-pointer">Get Started</button>
            {formStatus === 'success' && <p className="text-green-400 text-xs font-bold text-center">Success! We'll call you.</p>}
          </form>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-24 px-6 md:px-24 bg-white border-t border-slate-100 text-slate-900 text-left">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-black rounded-lg" />
              <span className="text-2xl font-black tracking-tighter uppercase">Zanshin Dojo</span>
            </div>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">Preserving traditional martial arts through digital excellence.</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-black mb-6 text-left">Location</h4>
            <p className="text-slate-500 text-sm font-bold">Baliwag, Bulacan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function ScheduleRow({ type, mw, tf, sat }: { type: string, mw: string, tf: string, sat: string }) {
  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="py-8">
        <span className="text-lg font-bold text-slate-900 block text-left">{type}</span>
        <span className="text-[10px] text-rose-600 font-black uppercase tracking-widest text-left block">Active Enrollment</span>
      </td>
      <td className="py-8 text-sm font-medium text-slate-600">{mw}</td>
      <td className="py-8 text-sm font-medium text-slate-600">{tf}</td>
      <td className="py-8"><span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-900">{sat}</span></td>
    </tr>
  );
}

function InstructorCard({ name, role, desc, img }: { name: string, role: string, desc: string, img: string }) {
  return (
    <div className="group text-left">
       <div className="aspect-[4/5] bg-slate-200 rounded-[3rem] overflow-hidden mb-6 relative border-4 border-white shadow-xl">
          <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={name} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
             <span className="text-rose-400 font-black uppercase text-[10px] tracking-widest mb-1">{role}</span>
             <h4 className="text-2xl font-black uppercase tracking-tight">{name}</h4>
          </div>
       </div>
       <p className="text-slate-500 text-sm leading-relaxed px-4">{desc}</p>
    </div>
  );
}
