import { useState, useEffect } from 'react';
import React from 'react';
import { useAuth } from '../App';
import { Users, ShoppingBag, Calendar, Mail, Check, X, Shield, Plus, MoreVertical, Edit2, Trash2, Clock } from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DojoTrial, DojoUser, DojoClass } from '../types';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'members' | 'trials' | 'schedule' | 'shop' | 'events' | 'instructors';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('members');
  const [members, setMembers] = useState<DojoUser[]>([]);
  const [trials, setTrials] = useState<DojoTrial[]>([]);
  const [classes, setClasses] = useState<DojoClass[]>([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClass, setNewClass] = useState<Partial<DojoClass>>({
    title: '',
    dayOfWeek: 'Monday',
    startTime: '18:00',
    endTime: '19:30',
    capacity: 20,
    instructorId: 'Sensei Ryu'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (activeTab === 'members') {
      const snap = await getDocs(collection(db, 'users'));
      setMembers(snap.docs.map(d => d.data() as DojoUser));
    } else if (activeTab === 'trials') {
      const snap = await getDocs(query(collection(db, 'trials'), orderBy('createdAt', 'desc')));
      setTrials(snap.docs.map(d => ({id: d.id, ...d.data()} as DojoTrial)));
    } else if (activeTab === 'schedule') {
      const snap = await getDocs(collection(db, 'classes'));
      setClasses(snap.docs.map(d => ({id: d.id, ...d.data()} as DojoClass)));
    }
  };

  const handleUpdateTrial = async (id: string, status: string) => {
    await updateDoc(doc(db, 'trials', id), { status });
    fetchData();
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'classes'), newClass);
    setShowAddClass(false);
    fetchData();
  };

  const handleDeleteClass = async (id: string) => {
    if (confirm('Delete this class?')) {
      await deleteDoc(doc(db, 'classes', id));
      fetchData();
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Central Command</h1>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <p className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Systems Operational • Elite Access</p>
          </div>
        </div>
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-x-auto whitespace-nowrap">
          <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users size={16}/>} label="Members" />
          <TabButton active={activeTab === 'trials'} onClick={() => setActiveTab('trials')} icon={<Mail size={16}/>} label="Trials" />
          <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={<Calendar size={16}/>} label="Schedule" />
          <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Plus size={16}/>} label="Events" />
          <TabButton active={activeTab === 'instructors'} onClick={() => setActiveTab('instructors')} icon={<Shield size={16}/>} label="Staff" />
          <TabButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<ShoppingBag size={16}/>} label="Inventory" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 min-h-[60vh]"
        >
          {activeTab === 'members' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-50">
                    <th className="pb-4 font-black">Practitioner</th>
                    <th className="pb-4 font-black">Rank</th>
                    <th className="pb-4 font-black">Role</th>
                    <th className="pb-4 font-black">Email</th>
                    <th className="pb-4 text-right font-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {members.map((m) => (
                    <tr key={m.uid} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-6 font-black uppercase tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">{m.displayName}</td>
                      <td className="py-6">
                        <span className="bg-slate-100 px-4 py-1 rounded-full text-[10px] uppercase font-black text-slate-500 border border-slate-200">
                          {m.rank || 'White Belt'}
                        </span>
                      </td>
                      <td className="py-6">
                         <span className={`text-[10px] uppercase font-black ${m.role === 'admin' ? 'text-rose-600' : 'text-indigo-600'}`}>{m.role}</span>
                      </td>
                      <td className="py-6 text-slate-400 font-bold text-xs">{m.email}</td>
                      <td className="py-6 text-right">
                        <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Edit2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'trials' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trials.map((t) => (
                <div key={t.id} className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] group relative overflow-hidden hover:border-rose-200 hover:shadow-xl transition-all">
                   <div className={`absolute top-0 left-0 w-full h-1.5 ${t.status === 'pending' ? 'bg-amber-500' : 'bg-rose-600'}`} />
                   <div className="flex justify-between items-start mb-8">
                      <div>
                         <h4 className="font-black uppercase text-xl text-slate-900 group-hover:text-rose-600 transition-colors leading-none mb-2">{t.name}</h4>
                         <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={12} />
                            <p className="text-[10px] uppercase tracking-widest font-black">{t.preferredDate}</p>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-3 mb-10">
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-bold border-b border-slate-200/50 pb-3">
                        <Mail size={14} className="text-rose-600" /> {t.email}
                      </div>
                   </div>
                   <div className="flex gap-4">
                     <button onClick={() => handleUpdateTrial(t.id!, 'confirmed')} className="flex-1 bg-slate-900 text-white rounded-xl text-[10px] py-3 uppercase font-black tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-slate-200 cursor-pointer">Enroll</button>
                     <button onClick={() => handleUpdateTrial(t.id!, 'completed')} className="flex-1 border border-slate-200 text-slate-400 hover:text-rose-600 rounded-xl text-[10px] py-3 uppercase font-black tracking-widest transition-all cursor-pointer">Archive</button>
                   </div>
                </div>
              ))}
              {trials.length === 0 && (
                <div className="col-span-full py-32 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Check size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm font-black uppercase tracking-widest">Inbox Zero Reached</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-10">
               <div className="flex justify-between items-center px-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <Calendar className="text-rose-600" /> Class Schedule
                  </h3>
                  <button 
                    onClick={() => setShowAddClass(true)}
                    className="bg-rose-600 text-white px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest flex items-center gap-2 hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 cursor-pointer"
                  >
                    <Plus size={16} /> New Session
                  </button>
               </div>

               {showAddClass && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl relative">
                       <button onClick={() => setShowAddClass(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X /></button>
                       <h3 className="text-2xl font-black uppercase text-slate-900 mb-8 tracking-tight">Create Session</h3>
                       <form onSubmit={handleAddClass} className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Session Title</label>
                             <input 
                                required
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-rose-600"
                                value={newClass.title}
                                onChange={e => setNewClass({...newClass, title: e.target.value})}
                                placeholder="e.g. Advanced Kumite"
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Day</label>
                                <select 
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none"
                                  value={newClass.dayOfWeek}
                                  onChange={e => setNewClass({...newClass, dayOfWeek: e.target.value})}
                                >
                                   {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d}>{d}</option>)}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Instructor</label>
                                <input 
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none"
                                  value={newClass.instructorId}
                                  onChange={e => setNewClass({...newClass, instructorId: e.target.value})}
                                />
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Start Time</label>
                                <input 
                                  type="time"
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none"
                                  value={newClass.startTime}
                                  onChange={e => setNewClass({...newClass, startTime: e.target.value})}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">End Time</label>
                                <input 
                                  type="time"
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none"
                                  value={newClass.endTime}
                                  onChange={e => setNewClass({...newClass, endTime: e.target.value})}
                                />
                             </div>
                          </div>
                          <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200">
                             Launch Session
                          </button>
                       </form>
                    </div>
                 </motion.div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {classes.map(c => (
                    <div key={c.id} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-rose-200 transition-all group relative">
                       <button 
                         onClick={() => handleDeleteClass(c.id!)}
                         className="absolute top-6 right-6 p-2 text-slate-200 hover:text-rose-600 transition-colors"
                       >
                          <Trash2 size={16} />
                       </button>
                       <h4 className="font-black uppercase text-xl text-slate-900 mb-4 group-hover:text-rose-600 transition-colors">{c.title}</h4>
                       <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-8 bg-white border border-slate-100 rounded-lg p-3 flex items-center gap-2">
                         <Clock size={12} className="text-rose-600" />
                         {c.dayOfWeek} • {c.startTime} – {c.endTime}
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-[10px] font-black text-rose-600">ID</div>
                          <span className="text-[10px] font-bold text-slate-400 truncate">{c.instructorId}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'events' && (
             <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <Plus className="text-rose-600" /> Event Planner
                  </h3>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200">
                    Host New Event
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                      <div className="flex justify-between items-start mb-6">
                         <span className="bg-rose-50 text-rose-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">Testing</span>
                         <div className="flex gap-2">
                            <button className="p-2 text-slate-300 hover:text-slate-900"><Edit2 size={16}/></button>
                            <button className="p-2 text-slate-300 hover:text-rose-600"><Trash2 size={16}/></button>
                         </div>
                      </div>
                      <h4 className="text-xl font-black uppercase text-slate-900 mb-2">Spring Grading 2024</h4>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">May 15 • 10:00 AM</p>
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                         <Users size={12} /> 45 Registered Participants
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'instructors' && (
             <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <Shield className="text-rose-600" /> Staff Roster
                  </h3>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200">
                    Onboard Staff
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                      { name: 'Ryu Tanaka', role: 'Head Sensei', rank: '7th Dan' },
                      { name: 'Hana Mori', role: 'Kumite Coach', rank: '5th Dan' },
                      { name: 'Kenji Sato', role: 'Junior Instructor', rank: '4th Dan' }
                   ].map(staff => (
                      <div key={staff.name} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-center hover:shadow-xl transition-all group">
                         <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center border border-slate-100 shadow-sm text-2xl font-black text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                            {staff.name[0]}
                         </div>
                         <h4 className="text-lg font-black uppercase text-slate-900 mb-1">{staff.name}</h4>
                         <p className="text-rose-600 text-[10px] uppercase font-black tracking-widest mb-4">{staff.role}</p>
                         <span className="bg-slate-200 text-slate-500 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{staff.rank}</span>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'shop' && (
             <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <ShoppingBag className="text-rose-600" /> Equipment & Inventory
                  </h3>
                  <button 
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 cursor-pointer"
                  >
                    <Plus size={16} /> Add Product
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <ProductItem 
                    name="Tokyodo Pro Gi"
                    price={129}
                    category="Apparel"
                    stock={12}
                    img="https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=2070&auto=format&fit=crop"
                  />
                  <ProductItem 
                    name="Master Sparring Pads"
                    price={85}
                    category="Protection"
                    stock={8}
                    img="https://images.unsplash.com/photo-1599058917233-3583604bc615?q=80&w=2069&auto=format&fit=crop"
                  />
                  <ProductItem 
                    name="Black Belt (Cotton)"
                    price={25}
                    category="Accessories"
                    stock={45}
                    img="https://images.unsplash.com/photo-1549413204-637dc4a36224?q=80&w=2074&auto=format&fit=crop"
                  />
               </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-8 py-3 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest cursor-pointer ${
        active ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ProductItem({ name, price, category, stock, img }: { name: string, price: number, category: string, stock: number, img: string }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all">
       <div className="h-48 relative overflow-hidden">
          <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={name} />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900">
             ${price}
          </div>
       </div>
       <div className="p-6">
          <div className="flex justify-between items-start mb-2">
             <h4 className="font-black uppercase text-slate-900 group-hover:text-rose-600 transition-colors">{name}</h4>
             <span className="text-[8px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-black uppercase">{category}</span>
          </div>
          <div className="flex justify-between items-center mt-6">
             <span className="text-[10px] text-slate-400 font-bold uppercase">Stock: {stock} units</span>
             <div className="flex gap-2">
                <button className="p-2 bg-white text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-slate-100"><Edit2 size={12} /></button>
                <button className="p-2 bg-white text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-slate-100"><Trash2 size={12} /></button>
             </div>
          </div>
       </div>
    </div>
  )
}
