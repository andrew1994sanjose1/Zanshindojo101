import { motion } from 'motion/react';
import React, { useState } from 'react';
import bannerImg from '../assets/banner.jpg';
import { Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import karateKidImg from '../assets/karatekid.png';
import kid1Img from '../assets/kid1.png';
import { db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

export function LandingPage() {
  const [formData, setFormData] = useState({
    childName: '',
    age: '',
    guardianName: '',
    email: '',
    address: '',
    healthCondition: '',
    waiverAccepted: false
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.waiverAccepted) return;
    
    setStatus('loading');
    try {
      await addDoc(collection(db, 'trial_registrations'), {
        ...formData,
        submittedAt: new Date().toISOString()
      });
      setStatus('success');
      setFormData({ childName: '', age: '', guardianName: '', email: '', address: '', healthCondition: '', waiverAccepted: false });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="pt-20 font-sans">
      {/* HERO SECTION - (Naka-保留 base sa previous code) */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-24 overflow-hidden bg-slate-50">
        {/* ... (Hero content stays the same) */}
      </section>

      {/* HISTORY & SCHEDULE SECTIONS - (Naka-保留 base sa previous code) */}

      {/* NEW TRIAL REGISTRATION FORM */}
      <section id="trials" className="py-32 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-16 items-start">
          
          <div className="md:col-span-5 text-left">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
              Reserve a <span className="text-rose-500">Trial Slot</span> for your Child.
            </h2>
            <p className="text-slate-400 font-medium mb-8">
              Let your child experience the discipline and fun of martial arts. Fill out the form to secure a spot in our next session in Baliwag.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <ShieldCheck className="text-rose-500" />
                <span className="text-sm font-bold uppercase tracking-widest">Safe & Supervised Environment</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-8 md:p-12 text-slate-900 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Child's Full Name</label>
                  <input required type="text" value={formData.childName} onChange={e => setFormData({...formData, childName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-black transition-all" placeholder="Juan Dela Cruz" />
                </div>
                <div className="text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Age</label>
                  <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-black transition-all" placeholder="e.g. 8" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Guardian Name</label>
                  <input required type="text" value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-black transition-all" placeholder="Parent/Guardian Name" />
                </div>
                <div className="text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-black transition-all" placeholder="email@example.com" />
                </div>
              </div>

              <div className="text-left mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Home Address</label>
                <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-black transition-all" placeholder="Baliwag, Bulacan" />
              </div>

              <div className="text-left mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Learner's Health Condition (Optional)</label>
                <textarea value={formData.healthCondition} onChange={e => setFormData({...formData, healthCondition: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-black transition-all h-24 resize-none" placeholder="Allergies, asthma, or any physical conditions..."></textarea>
              </div>

              <div className="text-left mb-8">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Waiver & Terms</label>
                <div className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl h-32 overflow-y-scroll text-xs text-slate-500 leading-relaxed mb-4">
                  <p className="font-bold mb-2">Liability Waiver:</p>
                  I, as the parent/guardian, understand that martial arts involve physical activity. I hereby release Zanshin Dojo from any liability for injuries that may occur during the trial session. I confirm that my child is physically fit to participate. We follow strict safety protocols, but acknowledge inherent risks in sports training.
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input required type="checkbox" checked={formData.waiverAccepted} onChange={e => setFormData({...formData, waiverAccepted: e.target.checked})} className="w-5 h-5 accent-rose-600" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-black">I accept the waiver and terms.</span>
                </label>
              </div>

              <button 
                disabled={status === 'loading'}
                className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl disabled:bg-slate-300 flex items-center justify-center gap-3 cursor-pointer"
              >
                {status === 'loading' ? 'Processing...' : 'Reserve Trial Slot'} <ArrowRight size={20} />
              </button>

              {status === 'success' && <p className="mt-4 text-green-600 font-bold text-center">Reservation successful! We will contact you soon.</p>}
              {status === 'error' && <p className="mt-4 text-rose-600 font-bold text-center">Something went wrong. Please try again.</p>}
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER - (Naka-保留 base sa previous code) */}
    </div>
  );
}

// Sub-components like ScheduleRow and InstructorCard stay the same...
