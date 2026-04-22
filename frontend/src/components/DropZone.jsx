import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DropZone({ onFile, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    disabled,
    onDrop: (accepted) => accepted[0] && onFile(accepted[0])
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative overflow-hidden border-2 border-dashed rounded-[2rem] p-10 md:p-14 text-center cursor-pointer transition-all duration-300 group ${
        isDragActive 
          ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/[0.08] shadow-[0_0_40px_rgba(99,102,241,0.15)] scale-[1.02]' 
          : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 dark:bg-white/[0.01] dark:border-white/[0.08] dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/[0.02]'
      } ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}
    >
      <input {...getInputProps()} />
      
      {/* Subtle Background Glow on Hover (Dark Mode mostly) */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        
        {/* Animated Icon Container */}
        <div className="relative">
          {/* Active Ring Glow */}
          <AnimatePresence>
            {isDragActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-[-15px] rounded-full border-2 border-indigo-400/30 animate-[spin_4s_linear_infinite]"
              />
            )}
          </AnimatePresence>

          <motion.div 
            animate={{ 
              scale: isDragActive ? 1.1 : 1,
              y: isDragActive ? -5 : 0 
            }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-sm ${
              isDragActive 
                ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-indigo-500/20' 
                : 'bg-white dark:bg-[#161625] border border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 group-hover:shadow-lg'
            }`}
          >
            {isDragActive ? (
              <ImageIcon size={36} className="animate-pulse" />
            ) : (
              <UploadCloud size={36} className="transition-transform duration-500 group-hover:-translate-y-1" />
            )}
          </motion.div>
        </div>

        {/* Text Content */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 transition-colors">
            {isDragActive ? 'Release to initiate scan!' : 'Drag & drop vehicle image'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
            {isDragActive 
              ? 'Target acquired. Processing will begin immediately.' 
              : <>or <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">browse your computer</span> to upload a file manually.</>}
          </p>
          
          {/* Format Pills */}
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {['High-Res JPG', 'PNG', 'WEBP'].map(ext => (
              <span 
                key={ext}
                className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-slate-200/50 text-slate-500 dark:bg-white/[0.04] dark:border dark:border-white/[0.05] dark:text-slate-500 transition-colors"
              >
                {ext}
              </span>
            ))}
            {/* Fancy spark pill to show it's AI powered */}
            <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:border dark:border-cyan-500/20 dark:text-cyan-400 ml-1">
              <Sparkles size={10} /> AI Ready
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}