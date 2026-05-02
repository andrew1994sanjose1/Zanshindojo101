import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface EnrollmentModalProps {
  onClose: () => void;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ onClose }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEnroll = async () => {
    if (!code) return setError("Pakilagay ang iyong code, Tol.");
    
    setLoading(true);
    setError("");

    try {
      // Hahanapin natin sa Firestore ang member na may ganitong enrollmentCode
      const membersRef = collection(db, "members");
      const q = query(membersRef, where("enrollmentCode", "==", code.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const memberData = querySnapshot.docs[0].id;
        // Pag tama ang code, ididirekta natin sa personal profile link nila
        window.location.href = `/member/${memberData}`;
      } else {
        setError("Invalid Code. I-check ang email mula kay Admin.");
      }
    } catch (err) {
      setError("May error sa system. Pakisubukang muli.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 pt-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl mb-6">
            <ShieldCheck size={32} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Member Access</h2>
          <p className="text-slate-500 text-sm mb-8">
            Ilagay ang **Enrollment Code** na natanggap mo sa email para makita ang iyong schedule at dashboard.
          </p>

          <div className="space-y-4">
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Hal: ZAN-2026-XXXX"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center font-mono text-lg uppercase focus:border-rose-500 focus:outline-none transition-all"
            />

            {error && <p className="text-rose-600 text-sm font-medium">{error}</p>}

            <button 
              onClick={handleEnroll}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? "Checking..." : (
                <>Access Dashboard <ArrowRight size={18} /></>
              )}
            </button>
          </div>

          <p className="mt-8 text-xs text-slate-400">
            Wala pang code? Mag-register muna sa **Trials** section.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
