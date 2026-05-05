import React, { useState } from 'react';
import { Clock, User, Mail, MapPin, Activity, ArrowRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

export default function TrialPage() {
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
    <div className="min-h-screen bg-[#0B0E14] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-white">
            START YOUR <span className="text-rose-600">JOURNEY</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            Register for a complimentary introductory session
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Info */}
          <div className="bg-[#151921] rounded-[2.5rem] p-8 md:p-12 border border-white/5 text-white">
            <h3 className="text-3xl font-black uppercase italic tracking-tight mb-8 text-left">Intro Classes</h3>
            <div className="space-y-6">
              <ClassCard day="Mondays" title="Youth Trial (6-12)" time="17:00 - 18:00" />
              <ClassCard day="Wednesdays" title="Adult Trial (13+)" time="18:30 - 19:30" />
            </div>
          </div>

          {/* Right Column: The Form (image_1d9edd.png Style) */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-slate-900 shadow-2xl">
            <h3 className="text-3xl font-black uppercase italic tracking-tight mb-8 text-left">Registration Form</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input required type="text" value={formData.childName} onChange={e => setFormData({...formData, childName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-xl outline-none focus:border-rose-600 transition-all text-sm font-medium" placeholder="Learner's Name" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Age</label>
                  <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-rose-600 transition-all text-sm font-medium" placeholder="18" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Guardian Name</label>
                  <input required type="text" value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-rose-600 transition-all text-sm font-medium" placeholder="Parent/Guardian" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-xl outline-none focus:border-rose-600 transition-all text-sm font-medium" placeholder="contact@dojo.com" />
                  </div>
                </div>
              </div>

              <div className="text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-xl outline-none focus:border-rose-600 transition-all text-sm font-medium" placeholder="Baliwag, Bulacan" />
                </div>
              </div>

              <div className="text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Health Condition</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-4 text-slate-300" size={18} />
                  <textarea value={formData.healthCondition} onChange={e => setFormData({...formData, healthCondition: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-xl outline-none focus:border-rose-600 transition-all text-sm font-medium h-20 resize-none" placeholder="Any medical concerns?"></textarea>
                </div>
              </div>

              <div className="text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Liability Waiver</label>
                <div className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl h-24 overflow-y-scroll text-[11px] text-slate-500 leading-relaxed mb-4">
                  I hereby authorize the learner to participate in the trial session. I release the center from any liability for accidental injuries and confirm the learner is fit to train.
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input required type="checkbox" checked={formData.waiverAccepted} onChange={e => setFormData({...formData, waiverAccepted: e.target.checked})} className="w-5 h-5 accent-rose-600" />
                  <span className="text-[13px] font-bold text-slate-600 group-hover:text-black">I accept the terms and waiver.</span>
                </label>
              </div>

              <button disabled={status === 'loading'} className="w-full bg-[#0B0E14] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl flex items-center justify-center gap-3 mt-4">
                {status === 'loading' ? 'Processing...' : 'RESERVE TRIAL SLOT'} <ArrowRight size={20} />
              </button>
              
              {status === 'success' && <p className="text-green-600 text-xs font-black mt-2">Reservation Sent!</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassCard({ day, title, time }: { day: string, title: string, time: string }) {
  return (
    <div className="bg-[#1C222D] p-6 rounded-2xl flex items-center gap-6 border border-white/5 text-left">
      <div className="bg-rose-600/10 p-4 rounded-xl text-rose-500"><Clock size={28} /></div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{day}</p>
        <h4 className="text-xl font-bold italic">{title}</h4>
        <p className="text-slate-400 text-sm font-medium">{time}</p>
      </div>
    </div>
  );
}
