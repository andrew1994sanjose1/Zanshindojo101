import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Play, CheckCircle, Lock, Filter, Search, BookOpen, Star } from 'lucide-react';
import { collection, query, getDocs, doc, updateDoc, arrayUnion, increment, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Tutorial, UserProgress } from '../types';
import { motion } from 'motion/react';

const MOCK_TUTORIALS: Tutorial[] = [
  { id: '1', title: 'Heian Shodan: Step by Step', description: 'The first kata of the Shotokan style.', videoUrl: 'https://www.youtube.com/embed/9lS-fB8Y2mU', category: 'Kata', level: 'White Belt', xpReward: 50 },
  { id: '2', title: 'Basic Stances (Tachi Waza)', description: 'Mastering Zenkutsu-dachi and Kokutsu-dachi.', videoUrl: 'https://www.youtube.com/embed/3n0K-Y4P3RE', category: 'Basics', level: 'White Belt', xpReward: 30 },
  { id: '3', title: 'Front Kick (Mae Geri) Power', description: 'Generating explosive power from the hips.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'Kumite', level: 'Yellow Belt', xpReward: 40 },
];

export function TutorialsPage() {
  const { user, userData } = useAuth();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tutorials'));
        const docs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Tutorial));
        setTutorials(docs.length > 0 ? docs : MOCK_TUTORIALS);

        if (user) {
          const progressRef = doc(db, 'progress', user.uid);
          const progressSnap = await getDoc(progressRef);
          if (progressSnap.exists()) {
            setProgress(progressSnap.data() as UserProgress);
          } else {
            const initialProgress = { userId: user.uid, completedTutorials: [], totalXP: 0 };
            await setDoc(progressRef, initialProgress);
            setProgress(initialProgress);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleComplete = async (tutorial: Tutorial) => {
    if (!user || !progress || progress.completedTutorials.includes(tutorial.id!)) return;

    try {
      const progressRef = doc(db, 'progress', user.uid);
      await updateDoc(progressRef, {
        completedTutorials: arrayUnion(tutorial.id),
        totalXP: increment(tutorial.xpReward)
      });
      
      setProgress(prev => prev ? ({
        ...prev,
        completedTutorials: [...prev.completedTutorials, tutorial.id!],
        totalXP: prev.totalXP + tutorial.xpReward
      }) : null);
    } catch (err) {
      handleFirestoreError(err, 'WRITE' as any, 'progress');
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Technique Library</h1>
              <p className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Modern curriculum. Ancient discipline.</p>
           </div>
           <div className="flex bg-white border border-slate-100 rounded-2xl px-6 py-3 items-center gap-4 w-full md:w-auto shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search Masterclass..." className="bg-transparent border-none outline-none text-sm w-full md:w-64 placeholder:text-slate-300 font-medium" />
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Video Overlay */}
          <div className="lg:col-span-2 space-y-8">
             {selectedTutorial ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative group border-8 border-white">
                     <iframe 
                        className="w-full h-full"
                        src={selectedTutorial.videoUrl} 
                        title={selectedTutorial.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                     />
                  </div>
                  <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl shadow-slate-100/50 flex flex-col md:flex-row justify-between items-start gap-8">
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                           <span className="text-[10px] bg-rose-600 text-white px-3 py-1 rounded-md uppercase font-black tracking-widest">{selectedTutorial.category}</span>
                           <span className="text-[10px] border border-slate-100 bg-slate-50 px-3 py-1 rounded-md uppercase font-black tracking-widest text-slate-500">{selectedTutorial.level}</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase mb-4 tracking-tight">{selectedTutorial.title}</h2>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-xl">{selectedTutorial.description}</p>
                     </div>
                     <div className="shrink-0 flex flex-col items-end">
                        {progress?.completedTutorials.includes(selectedTutorial.id!) ? (
                          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-rose-100">
                             <CheckCircle size={18} /> Lesson Mastered
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleComplete(selectedTutorial)}
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-600 transition-all text-xs shadow-xl shadow-slate-200 cursor-pointer"
                          >
                            Claim Experience
                          </button>
                        )}
                        <p className="mt-4 text-[10px] text-slate-300 font-black uppercase tracking-widest">+ {selectedTutorial.xpReward} XP REWARD</p>
                     </div>
                  </div>
               </motion.div>
             ) : (
               <div className="aspect-video bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <BookOpen size={40} />
                  </div>
                  <p className="uppercase tracking-[0.3em] text-[10px] font-black">Select a scroll to begin study</p>
               </div>
             )}
          </div>

          {/* Tutorial List */}
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center justify-between px-2">
                Dojo Syllabus <Filter size={14} className="text-rose-600" />
             </h3>
             <div className="space-y-4">
                {tutorials.map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => setSelectedTutorial(t)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 group border ${
                      selectedTutorial?.id === t.id 
                      ? 'bg-rose-50 border-rose-100' 
                      : 'bg-slate-50 border-transparent hover:border-slate-100 hover:bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                       <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedTutorial?.id === t.id ? 'bg-rose-600 text-white' : 'bg-white text-slate-300 group-hover:text-rose-600'}`}>
                            <Play size={14} fill="currentColor" />
                          </div>
                          <span className="text-[9px] uppercase tracking-widest font-black text-slate-400">{t.category}</span>
                       </div>
                       {progress?.completedTutorials.includes(t.id!) && <CheckCircle size={14} className="text-rose-600" />}
                    </div>
                    <h4 className={`font-bold uppercase tracking-tight text-sm mb-3 transition-colors ${selectedTutorial?.id === t.id ? 'text-rose-700' : 'text-slate-800'}`}>{t.title}</h4>
                    <div className="flex items-center justify-between border-t border-slate-100/10 pt-3">
                       <span className="text-[10px] text-slate-400 font-bold uppercase">{t.level}</span>
                       <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded ${selectedTutorial?.id === t.id ? 'text-rose-600' : 'text-indigo-600 bg-indigo-50'}`}>
                          <Star size={10} /> {t.xpReward} XP
                       </span>
                    </div>
                  </button>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
