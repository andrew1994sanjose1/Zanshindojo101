import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  CheckCircle2, 
  Trophy, 
  MapPin, 
  Activity, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export function TrialsPage() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    guardianName: '',
    email: '',
    address: '',
    healthCondition: '',
    preferredDate: '',
    waiverAccepted: false
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.waiverAccepted) {
      alert("Please accept the liability waiver to continue.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'trials'), {
        ...formData,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const schedule = [
    { day: 'Mondays', time: '17:00 - 18:00', type: 'Youth Trial (6-12)' },
    { day: 'Wednesdays', time: '18:30 - 19:30', type: 'Adult Trial (13+)' },
    { day: 'Saturdays', time: '10:00 - 11:30', type: 'Intro General Session' }
  ];

  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4"
          >
            Start Your <span className="text-rose-600">Journey</span>
          </motion.h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
            Register for a complimentary introductory session
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Info & Schedule */}
          <div className="space-y-12">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden text-left">
               <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-600 rounded-full blur-3xl opacity-20"></div>
               
               <h2 className="text-3xl font-black uppercase mb-8 relative z-10 italic">Intro Classes</h2>
               
               <div className="space-y-6 relative z-10">
                  {schedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-6 p-5 border border-white/5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                       <div className="w-12 h-12 bg-rose-600/20 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                          <Calendar size={24} />
                       </div>
                       <div>
                          <p className="text-stone-400 text-[10px] uppercase font-black tracking-widest">{item.day}</p>
                          <h4 className="font-bold text-lg italic">{item.type}</h4>
                          <div className="flex items-center gap-2 text-stone-500 text-xs mt-1">
                             <Clock size={12} /> {item.time}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-10 p-6 bg-rose-600 rounded-2xl flex items-center gap-4">
                  <Trophy size={32} className="shrink-0" />
                  <div>
                    <h5 className="font-black uppercase text-xs">No Gear Needed</h5>
                    <p className="text-rose-100 text-[10px]">Just wear comfortable athletic clothing for your first session.</p>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-100/50 text-left">
               <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-6">Why Book a Trial?</h3>
               <ul className="space-y-4">
                  {[
                    'One-on-one introduction with a Black Belt instructor',
                    'Direct assessment of current fitness and coordination',
                    'Full tour of our professional facility and equipment',
                    'Detailed roadmap of the grading syllabus'
                  ].map((text, i) => (
                    <li key={i} className="flex gap-4 text-slate-500 text-sm font-medium">
                       <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                       {text}
                    </li>
                  ))}
               </ul>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 relative">
             {submitted ? (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase mb-4 tracking-tight">Booking Received!</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                    A Dojo administrator will contact you within 24 hours to confirm your introductory slot.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="mt-12 text-rose-600 font-black uppercase text-[10px] tracking-widest hover:underline"
                  >
                    Book another session
                  </button>
               </motion.div>
             ) : (
               <>
                 <h2 className="text-3xl font-black text-slate-900 uppercase mb-10 tracking-tight text-left italic">Registration Form</h2>
                 <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    
                    {/* Row: Student Name & Age */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Learner's Full Name</label>
                          <div className="relative">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                             <input required type="text" className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Age</label>
                          <input required type="number" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                            value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="18" />
                       </div>
                    </div>

                    {/* Row: Guardian & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name of Guardian</label>
                          <input required type="text" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                             value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} placeholder="Parent/Guardian Name" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</label>
                          <div className="relative">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                             <input required type="email" className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contact@email.com" />
                          </div>
                       </div>
                    </div>

                    {/* Full Width: Address */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Address</label>
                       <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                          <input required type="text" className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                             value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street, Barangay, City" />
                       </div>
                    </div>

                    {/* Full Width: Health Condition */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Learner's Health Condition</label>
                       <div className="relative">
                          <Activity className="absolute left-4 top-4 text-slate-300" size={16} />
                          <textarea className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:border-rose-600 transition-colors h-24 resize-none"
                             value={formData.healthCondition} onChange={e => setFormData({...formData, healthCondition: e.target.value})} placeholder="List any medical concerns or allergies..." />
                       </div>
                    </div>

                    {/* Preferred Day & Waiver Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Preferred Class Day</label>
                          <select required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-rose-600 transition-colors appearance-none"
                             value={formData.preferredDate} onChange={e => setFormData({...formData, preferredDate: e.target.value})}>
                             <option value="">Select a day</option>
                             <option value="Monday">Monday (Youth)</option>
                             <option value="Wednesday">Wednesday (Adult)</option>
                             <option value="Saturday">Saturday (Intro)</option>
                          </select>
                       </div>
                       
                       <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                          <label className="flex items-start gap-3 cursor-pointer">
                             <input type="checkbox" required checked={formData.waiverAccepted} onChange={e => setFormData({...formData, waiverAccepted: e.target.checked})} 
                                className="mt-1 w-4 h-4 accent-rose-600 shrink-0" />
                             <span className="text-[11px] font-bold text-slate-600 leading-tight">
                                I accept the <span className="text-rose-600">Liability Waiver</span> & confirm the learner is fit for training.
                             </span>
                          </label>
                       </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                       {loading ? 'Processing...' : (
                         <>Reserve Trial Slot <ArrowRight size={20} /></>
                       )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                       <ShieldCheck size={14} />
                       <p className="text-[10px] font-bold uppercase tracking-widest">No commitment required for first session</p>
                    </div>
                 </form>
               </>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
