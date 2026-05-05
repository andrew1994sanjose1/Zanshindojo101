import { motion } from 'motion/react';
import React from 'react';
import { useAuth } from '../App';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import bannerImg from '../assets/banner.jpg';
import { Play, Shield, Target, ArrowRight, Clock } from 'lucide-react';

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
    <div className="pt-20">
      {/* Hero Section */}
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
          <div className="md:col-span-5 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-900 rounded-full w-fit"
            >
              <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider">Enrolling for 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl font-black leading-[1.1] text-slate-900 tracking-tight"
            >
              Master the Way of the <span className="text-black underline underline-offset-4">Warrior.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-slate-600 leading-relaxed max-w-md font-medium"
            >
              The world's most advanced karate learning platform. Combining ancient tradition with modern progress tracking and master-grade HD video tutorials.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-4"
            >
              <button 
                onClick={() => signIn()}
                className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-2xl text-lg font-bold shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                Member Login <ArrowRight size={20} />
              </button>

              <a 
                href="#trials"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all text-center"
              >
                Book a Trial
              </a>
            </motion.div>

            <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-slate-200">
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">150+</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Video Katas</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">12k</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Students</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">9</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Belt Levels</span>
               </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 hidden md:block"
          >
            <div className="h-[540px] bg-slate-200 rounded-[3.5rem] p-6 shadow-inner relative border-4 border-white overflow-hidden group">
               <div className="w-full h-full bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden transition-transform duration-700 group-hover:scale-105">
                  <img src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop" className="w-full h-full object-cover" alt="Dojo preview" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                     <p className="text-rose-400 font-black uppercase text-xs tracking-widest mb-1">Featured Lesson</p>
                     <h3 className="text-2xl font-black uppercase">Heian Nidan Mastery</h3>
                     <p className="opacity-70 text-sm">Advanced kata breakdown with Sensei Ryu</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="py-32 bg-white border-y border-slate-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
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

      {/* Instructors Section */}
      <section id="instructors" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-20">Master Instructors</h2>
           <div className="grid md:grid-cols-3 gap-12">
              <InstructorCard 
                name="Sensei Ryu Tanaka"
                role="7th Dan Master"
                desc="Head instructor with specialized expertise in Shito-ryu Katas."
                img="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop"
              />
              <InstructorCard 
                name="Sensei Hana Mori"
                role="5th Dan Specialist"
                desc="World championship medalist focusing on competitive Kumite."
                img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
              />
              <InstructorCard 
                name="Sensei Kenji Sato"
                role="4th Dan Instructor"
                desc="Expert in youth development and physical coordination drills."
                img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
              />
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 md:px-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Play className="text-rose-600" />}
              title="Curated Video Library"
              description="Access 4K katas and technical drills broken down for every skill level."
            />
            <FeatureCard 
              icon={<Target className="text-rose-600" />}
              title="Interactive Practice"
              description="Daily routines designed by masters to maintain form outside the dojo."
            />
            <FeatureCard 
              icon={<Shield className="text-rose-600" />}
              title="Secure Progress"
              description="Your training data is encrypted and validated by our certified instructors."
            />
          </div>
        </div>
      </section>

      {/* Trial Form Section */}
      <section id="trials" className="py-32 px-6 md:px-24 bg-slate-50">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
            <Clock className="mx-auto mb-4 text-rose-600" size={32} />
            <h2 className="text-3xl font-black text-slate-900 uppercase mb-2">Book Your Trial</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Start your journey today.</p>
          </div>
          
          <form onSubmit={handleTrialSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={trialForm.name}
                  onChange={(e) => setTrialForm({...trialForm, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-black transition-all" 
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Email</label>
                <input 
                  required
                  type="email" 
                  value={trialForm.email}
                  onChange={(e) => setTrialForm({...trialForm, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-black transition-all" 
                  placeholder="juan@email.com"
                />
              </div>
            </div>
            <button className="w-full bg-black text-white p-5 rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg cursor-pointer">
              Submit Reservation
            </button>
            {formStatus === 'success' && (
              <p className="text-green-600 font-bold text-center">Registration sent! We'll contact you shortly.</p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 md:px-24 bg-white border-t border-slate-100 text-slate-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-black rounded-lg" />
              <span className="text-2xl font-black tracking-tighter uppercase">Zanshin Dojo</span>
            </div>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
              Preserving traditional martial arts through digital excellence.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-black mb-6">Osaka HQ</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-bold">
              <li>Chuo-ku, Osaka, Japan</li>
              <li>hq@zanshindojo.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 border-t border-slate-100 mt-12">
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">© 2026 ZANSHIN DOJO. BUILT FOR MASTERS.</div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 bg-slate-50 border border-slate-100 rounded-3xl hover:border-rose-200 hover:shadow-xl transition-all duration-300"
    >
      <div className="mb-6 p-4 bg-white inline-block rounded-2xl shadow-sm">{icon}</div>
      <h3 className="text-xl font-black text-slate-900 uppercase mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed text-sm">{description}</p>
    </motion.div>
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
  )
}
