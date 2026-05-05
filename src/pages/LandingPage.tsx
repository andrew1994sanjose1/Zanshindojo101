import { motion } from 'motion/react';
import React from 'react';
import { useAuth } from '../App';
import { Play, Shield, Target, Users, ArrowRight, Calendar, Info } from 'lucide-react';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import bannerImg from '../assets/banner.jpg';
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
      {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={bannerImg}
  className="w-full h-full object-cover opacity-300"
  alt="New Website Banner"
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
              <span className="w-2 h-2 text-black rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider">Enrolling for 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl font-black leading-[1.1] text-slate-900 tracking-tight"
            >
              Master the Way of the <span className="text-black underline text-black underline-offset-4">Warrior.</span>
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
                disabled            
                className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-2xl text-lg font-bold shadow-xl shadow-rose-200 hover:bg-black hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                Member Login <ArrowRight size={20} />
              </button>

              <a 
                href="#trials"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all text-center"
              >
                Book Your Reservation Now!
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

        {/* Decorative Blurs */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </section>

      {/* History & Philosophy Section */}
      <section id="history" className="py-32 bg-white border-y border-slate-100 overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50"></div>
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
              Founded in Osaka in 1994, Zanshin Dojo has preserved the authentic Shitoryu style while embracing modern pedagogical techniques. Our lineage traces back through generations of masters, ensuring that every punch, kick, and kata taught today remains true to the original essence of karate.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
               <div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter">30+</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Years Experience</p>
               </div>
               <div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter">15k</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Graduated Black Belts</p>
               </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1549413204-637dc4a36224?q=80&w=2074&auto=format&fit=crop" className="rounded-3xl shadow-xl" alt="Karate training" />
                <img src="https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?q=80&w=2069&auto=format&fit=crop" className="rounded-3xl shadow-xl" alt="Dojo atmosphere" />
             </div>
             <div className="pt-12">
                <img src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop" className="rounded-3xl shadow-xl h-full object-cover" alt="Sensei demonstration" />
             </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructors" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Master Instructors</h2>
              <p className="text-slate-500 font-medium">Guided by world-class Senseis with decades of expertise.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-12">
              <InstructorCard 
                name="Sensei Ryu Tanaka"
                role="7th Dan Master"
                desc="Head instructor with specialize expertise in Shito-ryu Katas."
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

      {/* Events & Achievements */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
              <div className="max-w-md">
                 <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Upcoming Events</h2>
                 <p className="text-slate-500 font-medium">Tournament dates, belt testing, and world seminars.</p>
              </div>
              <button className="px-8 py-3 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
                Full 2024 Calendar
              </button>
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              <EventCard 
                date="MAY 15"
                title="Spring Belt Grading"
                desc="Open for Kyu ranks 9 through 1. Requirements must be signed by Sensei."
              />
              <EventCard 
                date="JUN 02"
                title="National Kumite Seminar"
                desc="A deep dive into advanced sparring tactics for national level competitors."
              />
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 md:px-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Elite Training Tools</h2>
             <p className="text-slate-500 font-medium">Harness technology to accelerate your belt progress.</p>
          </div>
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
      <section id="trials" className="py-32 px-6 md:px-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 uppercase mb-4">Book Your Trial</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Start your journey with a personal assessment.</p>
          </div>
          
          <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative z-10">
            <form onSubmit={handleTrialSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={trialForm.name}
                    onChange={(e) => setTrialForm({...trialForm, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-slate-400 outline-none transition-all placeholder:text-slate-400" 
                    placeholder="Kenji Sato"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</label>
                  <input 
                    required
                    type="email" 
                    value={trialForm.email}
                    onChange={(e) => setTrialForm({...trialForm, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-slate-400 outline-none transition-all placeholder:text-slate-400" 
                    placeholder="kenji@training.com"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</label>
                  <input 
                    required
                    type="tel" 
                    value={trialForm.phone}
                    onChange={(e) => setTrialForm({...trialForm, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-slate-400 outline-none transition-all placeholder:text-slate-400" 
                    placeholder="+81 90-1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Date</label>
                  <input 
                    required
                    type="date" 
                    value={trialForm.preferredDate}
                    onChange={(e) => setTrialForm({...trialForm, preferredDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-rose-500 outline-none transition-all" 
                  />
                </div>
              </div>
              <button className="w-full text-black text-black p-5 rounded-2xl font-bold uppercase tracking-widest hover:text-black transition-all shadow-lg shadow-black-100 cursor-pointer">
                Submit Reservation
              </button>
              
              {formStatus === 'success' && (
                <p className="text-rose-600 font-bold text-center">Registration sent. We'll contact you shortly.</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 md:px-24 bg-white border-t border-slate-100 text-slate-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-rose-600 rounded-lg" />
              <span className="text-2xl font-black tracking-tighter uppercase">Taekwondo School</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-8 font-medium leading-relaxed">
              Preserving traditional Japanese martial arts through digital excellence. Join our global dojo today and master your empty hand techniques.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-black text-slate-900 mb-6">Navigation</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-bold">
              <li><a href="#" className="hover:text-rose-600 transition-colors">Senseis</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Philosophy</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Shop</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-black text-slate-900 mb-6">Osaka HQ</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-bold">
              <li>Chuo-ku, Osaka, Japan</li>
              <li>hq@zanshindojo.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 border-t border-slate-100 flex justify-between items-center mt-12">
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">© 2024 ZANSHIN DOJO. BUILT FOR MASTERS.</div>
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
    <div className="group">
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

function EventCard({ date, title, desc }: { date: string, title: string, desc: string }) {
  return (
    <div className="flex gap-8 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-rose-200 transition-all group">
       <div className="shrink-0 w-24 h-24 bg-white rounded-3xl flex flex-col items-center justify-center border border-slate-100 shadow-sm">
          <span className="text-2xl font-black text-rose-600 leading-none">{date.split(' ')[1]}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{date.split(' ')[0]}</span>
       </div>
       <div>
          <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-rose-600 transition-colors">{title}</h4>
          <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}
