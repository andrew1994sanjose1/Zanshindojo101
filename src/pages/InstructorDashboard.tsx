import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../App';
import { Camera, CheckCircle2, AlertCircle, History, Clock } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function InstructorDashboard() {
  const { userData } = useAuth();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render(async (decodedText) => {
      try {
        const data = JSON.parse(decodedText);
        if (data.action === 'attendance' && data.uid) {
          await logAttendance(data.uid);
          setScanResult(`Check-in successful for User ID: ${data.uid.slice(0, 8)}...`);
          setStatus('success');
        }
      } catch (e) {
        setScanResult("Invalid QR Code Header");
        setStatus('error');
      }
    }, (error) => {
      // Common error handling
    });

    fetchRecent();

    return () => {
      scannerRef.current?.clear().catch(e => console.error(e));
    };
  }, []);

  const logAttendance = async (uid: string) => {
    await addDoc(collection(db, 'attendance'), {
      userId: uid,
      instructorId: userData?.uid,
      timestamp: serverTimestamp(),
      status: 'present'
    });
    fetchRecent();
  };

  const fetchRecent = async () => {
    const q = query(collection(db, 'attendance'), orderBy('timestamp', 'desc'), limit(5));
    const snap = await getDocs(q);
    setRecentAttendance(snap.docs.map(d => ({id: d.id, ...d.data()})));
  };

  return (
    <div className="pt-24 pb-12 px-6 md:px-12 max-w-5xl mx-auto min-h-screen bg-slate-50">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Staff Terminal</h1>
          <p className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Attendance Management • Floor Ops</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] uppercase font-black text-rose-600 tracking-widest">Scanner Active</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
                <Camera size={18} className="text-rose-600" /> Active Scanner
              </h3>
              <div id="reader" className="overflow-hidden rounded-[2rem] bg-slate-900 border-4 border-white shadow-inner shadow-black/20"></div>
              
              <div className={`mt-10 p-6 rounded-2xl border flex items-center gap-4 transition-all duration-500 shadow-sm ${
                status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                status === 'error' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                'bg-slate-50 border-slate-100 text-slate-400'
              }`}>
                {status === 'success' ? <CheckCircle2 size={24} /> : status === 'error' ? <AlertCircle size={24} /> : <Clock size={24} />}
                <p className="font-black text-xs uppercase tracking-tight">{scanResult || "Waiting for signal..."}</p>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
                <History size={18} className="text-rose-600" /> Entry Logs
              </h3>
              <div className="space-y-6">
                {recentAttendance.length > 0 ? recentAttendance.map((log) => (
                  <div key={log.id} className="flex items-center justify-between border-b border-slate-50 pb-6 group cursor-pointer">
                     <div>
                        <div className="text-xs font-black uppercase text-slate-900 mb-1 group-hover:text-rose-600 transition-colors">Practitioner ID: {log.userId.slice(0, 10)}...</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                          {log.timestamp?.toDate() ? new Date(log.timestamp.toDate()).toLocaleTimeString() : 'Processing...'}
                        </div>
                     </div>
                     <span className="text-[9px] bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-100 shadow-sm">Verified</span>
                  </div>
                )) : (
                  <div className="py-20 text-center text-slate-200 uppercase font-black tracking-widest text-[10px]">
                     No check-ins logged today
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
