import { useState, useCallback } from 'react';
import { ScanLine, RefreshCw, WifiOff, Activity, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DropZone from '../components/DropZone';
import ResultCard from '../components/ResultCard';
import { detectPlate } from '../utils/api';
import { mockDetect } from '../utils/mockDetect';
import { useAuth } from '../context/AuthContext';
import { saveDetection } from '../firebase/detections';

const STEPS = [
  { label: 'Reading & preprocessing image' },
  { label: 'CLAHE enhancement' },
  { label: 'YOLO11 plate detection' },
  { label: 'EasyOCR text recognition' },
  { label: 'Post-processing & state lookup' },
];

export default function DetectPage() {
  const { user } = useAuth();
  const [state, setState] = useState('idle');
  const [result, setResult] = useState(null);
  const [url, setUrl] = useState(null);
  const [step, setStep] = useState(0);
  const [mock, setMock] = useState(false);

  const handleFile = useCallback(async (file) => {
    setState('loading'); 
    setResult(null); 
    setStep(0); 
    setUrl(URL.createObjectURL(file));
    
    // Simulate pipeline steps for UI UX
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 400)); 
      setStep(i + 1);
    }
    
    let data, m = false;
    try {
      data = await detectPlate(file);
      // ✅ Save real detections only
      if (user) {
        await saveDetection(user.uid, {
          plateText: data.plate_text,
          state: data.state,
          plateType: data.plate_type,
          detectionConfidence: data.detection_confidence,
          ocrConfidence: data.ocr_confidence,
          filename: data.filename,
        });
      }
    } catch {
      data = await mockDetect(file); 
      m = true;
    }
    setMock(m); 
    setResult(data); 
    setState('success');
  }, [user]);

  const reset = () => { 
    setState('idle'); 
    setResult(null); 
    setUrl(null); 
    setStep(0); 
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-300 font-sans overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 py-8 md:p-8 lg:p-12 relative z-10 h-full min-h-screen flex flex-col">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          
          {/* ================= LEFT COLUMN: CONTEXT & INPUT ================= */}
          <div className="lg:col-span-4 flex flex-col space-y-6 lg:sticky lg:top-12 h-fit">
            
            {/* Header */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Live Workspace
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                Plate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Scanner</span>
              </h1>
              <p className="text-sm text-slate-400">Secure, high-speed vehicle identification using YOLO11 and OCR.</p>
            </motion.div>

            {/* Quick Stats Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Zap size={16} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Speed</p>
                  <p className="text-sm font-semibold text-white">&lt;100ms</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><ShieldCheck size={16} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Accuracy</p>
                  <p className="text-sm font-semibold text-white">~94% mAP</p>
                </div>
              </div>
            </motion.div>

            {/* Main Input Area */}
            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  className="w-full"
                >
                  <DropZone onFile={handleFile} disabled={false} />
                </motion.div>
              )}

              {state === 'success' && (
                <motion.div
                  key="success-thumb"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-4 backdrop-blur-xl space-y-4"
                >
                  <div className="flex items-center justify-between px-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Image</p>
                    <button 
                      onClick={reset}
                      className="group flex items-center gap-2 text-xs font-medium text-white px-3 py-1.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 transition-all"
                    >
                      <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" /> 
                      New Scan
                    </button>
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-[#0f0f13] border border-white/5 relative group">
                    <img src={url} alt="Source" className="w-full object-contain max-h-64 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Offline Mock Notice */}
            {mock && state === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] backdrop-blur-md"
              >
                <div className="mt-0.5 text-amber-400"><WifiOff size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-amber-300 mb-1">Backend Offline</p>
                  <p className="text-xs text-amber-400/80 leading-relaxed">
                    Displaying cached demo results. To process real images, start your FastAPI server: 
                    <code className="block mt-2 px-2 py-1 rounded bg-amber-500/10 font-mono text-[10px] text-amber-200 w-fit border border-amber-500/20">
                      uvicorn main:app --reload
                    </code>
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: OUTPUT TERMINAL ================= */}
          <div className="lg:col-span-8 h-full min-h-[500px] lg:min-h-[700px] rounded-[2.5rem] border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl relative overflow-hidden flex flex-col shadow-2xl">
            
            {/* Terminal Header */}
            <div className="h-14 border-b border-white/[0.05] flex items-center justify-between px-6 bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Activity size={14} className={state === 'loading' ? 'text-indigo-400 animate-pulse' : 'text-slate-600'} />
                <span className="text-xs font-mono tracking-widest text-slate-500 uppercase">
                  {state === 'idle' ? 'System_Ready' : state === 'loading' ? 'Processing_Pipeline...' : 'Output_Result'}
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/[0.05]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.05]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.05]" />
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-6 md:p-10 flex flex-col relative">
              
              {/* IDLE STATE */}
              {state === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
                    <div className="w-24 h-24 rounded-full bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-400/50">
                      <ScanLine size={40} />
                    </div>
                  </div>
                  <p className="mt-6 text-sm font-medium tracking-widest text-slate-500 uppercase">Awaiting Image Input</p>
                </div>
              )}

              {/* LOADING STATE */}
              {state === 'loading' && (
                <div className="max-w-2xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
                  {/* Image Scanner Preview */}
                  <div className="relative h-64 rounded-2xl bg-[#0a0a14] border border-white/10 overflow-hidden shadow-2xl">
                    <img src={url} alt="processing" className="w-full h-full object-contain opacity-40 grayscale" />
                    {/* Laser Scanner Effect */}
                    <motion.div 
                      className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-indigo-500/20 to-cyan-400/40 border-b-2 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.4)]"
                      animate={{ top: ['-20%', '100%', '-20%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    />
                  </div>

                  {/* Pipeline Status */}
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 md:p-8">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                      <span>Neural Pipeline</span>
                      <span className="text-indigo-400">{Math.round((step / STEPS.length) * 100)}%</span>
                    </div>
                    
                    <div className="space-y-4 relative">
                      {/* Vertical line connector */}
                      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/[0.05]" />
                      
                      {STEPS.map((s, i) => {
                        const done = i < step;
                        const active = i === step - 1;
                        return (
                          <div key={i} className={`relative flex items-center gap-4 transition-all duration-300 ${active ? 'opacity-100 scale-105 ml-2' : done ? 'opacity-50' : 'opacity-20'}`}>
                            
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 relative z-10 transition-colors duration-500 ${
                              done ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
                              active ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)]' :
                              'bg-[#161625] border border-white/20 text-slate-500'
                            }`}>
                              {done ? '✓' : active ? <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" /> : i + 1}
                            </div>
                            
                            <span className={`text-sm font-medium ${active ? 'text-indigo-300 shadow-indigo-500' : done ? 'text-slate-300' : 'text-slate-500'}`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUCCESS STATE */}
              {state === 'success' && result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                  className="flex-1 flex flex-col justify-center"
                >
                  {/* Render the actual ResultCard Component here. 
                      Assuming it's styled nicely, it will fill this space beautifully. */}
                  <ResultCard result={result} originalUrl={url} />
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}