import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle2, Trophy } from 'lucide-react';

export function TrialsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    preferredDate: '',
    experience: 'none'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'trials'), {
        ...formData,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
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
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Start Your <span className="text-rose-600">Journey</span></h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Register for a complimentary introductory session</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Information & Schedule */}
          <div className="space-y-12">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
               <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-600 rounded-full blur-3xl opacity-20"></div>
               <h2 className="text-3xl font-black uppercase mb-8 relative z-10">Intro Classes</h2>
               <div className="space-y-6 relative z-10">
                  {schedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-6 p-4 border border-white/5 rounded-2xl bg-white/5">
                       <div className="w-12 h-12 bg-rose-600/20 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                          <Calendar size={24} />
                       </div>
                       <div>
                          <p className="text-stone-400 text-[10px] uppercase font-black tracking-widest">{item.day}</p>
                          <h4 className="font-bold text-lg">{item.type}</h4>
                          <div className="flex items-center gap-2 text-stone-500 text-xs mt-1">
                             <Clock size={12} /> {item.time}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-10 p-6 bg-rose-600 rounded-2xl flex items-center gap-4">
                  <Trophy size={32} />
                  <div>
                    <h5 className="font-black uppercase text-xs">No Gear Needed</h5>
                    <p className="text-rose-100 text-[10px]">Just wear comfortable athletic clothing for your first session.</p>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-100/50">
               <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-4">Why Book a Trial?</h3>
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

          {/* Form */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 relative">
             {submitted ? (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase mb-4 tracking-tight">Booking Received!</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                    A Dojo administrator will contact you within 24 hours to confirm your introductory slot.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-12 text-rose-600 font-black uppercase text-[10px] tracking-widest hover:underline">Book another session</button>
               </motion.div>
             ) : (
               <>
                 <h2 className="text-3xl font-black text-slate-900 uppercase mb-10 tracking-tight">Registration Form</h2>
                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                          <div className="relative">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                             <input 
                                required
                                className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="Musashi Miyamoto"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Age</label>
                          <input 
                            required
                            type="number"
                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                            value={formData.age}
                            onChange={e => setFormData({...formData, age: e.target.value})}
                            placeholder="18"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                          <input 
                            required
                            type="email"
                            className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            placeholder="contact@dojo.com"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number</label>
                       <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                          <input 
                            required
                            className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            placeholder="+1 (555) 000-0000"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Preferred Class Day</label>
                       <select 
                         className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-rose-600 transition-colors"
                         value={formData.preferredDate}
                         onChange={e => setFormData({...formData, preferredDate: e.target.value})}
                         required
                       >
                          <option value="">Select a day</option>
                          <option value="Monday">Monday (Youth)</option>
                          <option value="Wednesday">Wednesday (Adult)</option>
                          <option value="Saturday">Saturday (Intro)</option>
                       </select>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                    >
                       {loading ? 'Processing...' : 'Reserve Trial Slot'}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">No commitment required for first session</p>
                 </form>
               </>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}

