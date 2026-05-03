import { useAuth } from '../context/AuthContext';
import { saveDetection } from '../firebase/detections';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, ScanLine, RotateCcw, CheckCircle2, WifiOff, Cpu, Terminal, Fingerprint, Activity } from 'lucide-react';
import { detectPlate } from '../utils/api';
import { mockDetect } from '../utils/mockDetect';

const STEPS = [
  'Initializing neural pipeline...',
  'Applying CLAHE low-light enhancement...',
  'Running YOLO11 object localization...',
  'Extracting characters via EasyOCR...',
  'Validating state codes & finalizing...',
];

export default function Demo() {
  const { user } = useAuth();
  const [stage, setStage] = useState('idle');
  const [imgSrc, setImgSrc] = useState(null);
  const [result, setResult] = useState(null);
  const [stepText, setStepText] = useState('');
  const [mock, setMock] = useState(false);
  const fileRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      setImgSrc(e.target.result);
      setStage('preview');
      setResult(null);
      setMock(false);
    };
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (!fileRef.current?.files?.[0]) return;
    const file = fileRef.current.files[0];

    setStage('processing');
    setStepText(STEPS[0]);

    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < STEPS.length) setStepText(STEPS[i]);
      else clearInterval(iv);
    }, 600);

    try {
      const data = await detectPlate(file);
      clearInterval(iv);

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

      setResult(data);
      setStage('result');
      setMock(false);
    } catch {
      try {
        const data = await mockDetect(file);
        clearInterval(iv);
        setResult({ ...data, _mock: true });
        setStage('result');
        setMock(true);
      } catch {
        clearInterval(iv);
        setStage('idle');
        setStepText('');
      }
    }
  }

  function reset() {
    setStage('idle');
    setImgSrc(null);
    setResult(null);
    setMock(false);
    setStepText('');
    if (fileRef.current) fileRef.current.value = '';
  }

  // Mac-style window header for the UI panels
  const WindowHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-white/[0.01]">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
      </div>
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
        <Icon size={12} /> {title}
      </div>
      <div className="w-10" /> {/* Spacer for centering */}
    </div>
  );

  return (
    <section id="demo" className="py-24 px-4 md:px-8 bg-[#09090b] relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Immersive Ambient Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[150px] bg-indigo-600 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[150px] bg-cyan-600 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
              <Activity size={12} className="animate-pulse" /> Live Inference Engine
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Test the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Architecture</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Upload a vehicle image below to initialize the neural pipeline. Watch as YOLO11 localizes the plate and EasyOCR decodes it in real-time.
            </p>
          </motion.div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[600px]">
          
          {/* ================= LEFT PANEL: INPUT STREAM ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:col-span-5 rounded-[2rem] overflow-hidden border border-white/[0.05] bg-white/[0.01] backdrop-blur-xl flex flex-col shadow-2xl"
          >
            <WindowHeader title="input_stream.tsx" icon={ImagePlus} />
            
            <div className="flex-1 p-6 flex flex-col relative">
              <AnimatePresence mode="wait">
                
                {/* IDLE: Upload Zone */}
                {stage === 'idle' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => fileRef.current.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                    className="flex-1 border-2 border-dashed border-indigo-500/20 hover:border-indigo-400/50 bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05] rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group"
                  >
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <ImagePlus size={32} className="text-indigo-400" />
                    </div>
                    <p className="text-xl text-white font-bold mb-2">Drop image to scan</p>
                    <p className="text-slate-500 text-sm mb-6 max-w-[250px]">Accepts high-resolution JPG, PNG, or WEBP formats.</p>
                    <button className="px-6 py-2.5 rounded-full bg-white/[0.05] border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                      Browse Files
                    </button>
                  </motion.div>
                )}

                {/* PREVIEW / PROCESSING: Image Display */}
                {stage !== 'idle' && imgSrc && (
                  <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col">
                    <div className="relative rounded-2xl overflow-hidden bg-black/50 flex-1 border border-white/5 min-h-[300px]">
                      <img src={imgSrc} alt="Target" className={`w-full h-full object-contain transition-all duration-700 ${stage === 'processing' ? 'grayscale opacity-50 blur-[2px]' : ''}`} />
                      
                      {/* Laser Scanner Effect */}
                      {stage === 'processing' && (
                        <motion.div
                          className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-400/10 to-cyan-400/40 border-b-2 border-cyan-400 z-10"
                          style={{ boxShadow: '0 10px 30px rgba(34,211,238,0.3)' }}
                          animate={{ top: ['-20%', '100%', '-20%'] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                        />
                      )}
                    </div>

                    {stage === 'preview' && (
                      <button
                        onClick={analyze}
                        className="mt-6 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]"
                      >
                        <Cpu size={20} /> Execute Neural Pipeline
                      </button>
                    )}

                    {stage === 'processing' && (
                      <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                            <ScanLine size={20} className="text-indigo-400 animate-pulse" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">System Active</p>
                            <p className="text-sm text-slate-300 font-mono truncate">{stepText}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            </div>
          </motion.div>

          {/* ================= RIGHT PANEL: INFERENCE OUTPUT ================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 rounded-[2rem] overflow-hidden border border-white/[0.05] bg-[#0a0a10] flex flex-col shadow-2xl relative"
          >
            <WindowHeader title="terminal_output.json" icon={Terminal} />
            
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative">
              
              {/* IDLE STATE */}
              {stage === 'idle' && (
                <div className="flex flex-col items-center justify-center text-slate-600 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 border border-white/10 rounded-full animate-ping opacity-20" />
                    <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                      <Terminal size={32} />
                    </div>
                  </div>
                  <p className="text-sm font-mono tracking-widest uppercase">Awaiting Feed...</p>
                </div>
              )}

              {/* PROCESSING STATE */}
              {stage === 'processing' && (
                <div className="flex flex-col justify-center space-y-8 max-w-md mx-auto w-full">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />
                        <div className="w-12 h-4 bg-white/5 rounded animate-pulse" />
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500/50 w-full animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RESULT STATE */}
              {stage === 'result' && result && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl mx-auto space-y-6">
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 size={14} /> Extraction Complete
                    </div>
                    {mock && (
                      <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <WifiOff size={14} /> Offline Demo
                      </div>
                    )}
                  </div>

                  {/* Massive License Plate Display */}
                  <div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-gradient-to-b from-[#1a1a24] to-[#0d0d14] p-8 shadow-2xl flex items-center justify-center">
                    {/* Abstract Blue IND strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-blue-600/20 border-r border-blue-500/30 flex flex-col justify-end items-center pb-4">
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 mb-1" />
                      <span className="text-[8px] font-bold text-white/50 transform -rotate-90">IND</span>
                    </div>
                    
                    <p className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[0.2em] pl-6 text-center" style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
                      {result.plate_text}
                    </p>
                  </div>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: 'State Region', value: result.state || 'Unknown', icon: Fingerprint },
                      { label: 'Vehicle Type', value: result.plate_type || 'Standard', icon: Car },
                      { label: 'Confidence', value: `${(result.detection_confidence ?? 0).toFixed(1)}%`, icon: Target, isBar: true, fill: result.detection_confidence },
                      { label: 'OCR Engine', value: 'EasyOCR v1.7', icon: Terminal },
                      { label: 'File Hash', value: result.filename ? result.filename.substring(0,8) + '...' : 'demo_img', icon: FileDigit },
                      { label: 'OCR Conf', value: `${(result.ocr_confidence ?? 0).toFixed(1)}%`, icon: Activity, isBar: true, fill: result.ocr_confidence },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
                          <item.icon size={12} /> {item.label}
                        </div>
                        {item.isBar ? (
                          <div>
                            <p className="text-white font-mono font-bold text-lg mb-1">{item.value}</p>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${item.fill || 0}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-indigo-400 rounded-full" />
                            </div>
                          </div>
                        ) : (
                          <p className="text-white font-semibold text-sm truncate">{item.value}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Reset Action */}
                  <button onClick={reset} className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-slate-300 hover:text-white font-medium transition-all group">
                    <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" /> Process Next Target
                  </button>
                  
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Quick fallback icons for the grid mapped above
function Car(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>; }
function Target(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>; }
function FileDigit(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><rect width="4" height="6" x="2" y="12" rx="2"/><path d="M10 12h2v6"/><path d="M10 18h4"/></svg>; }