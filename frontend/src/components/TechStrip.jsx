import { Cpu, Layers, Zap, Eye, Server, Code2, Database, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

// Updated to match your actual application stack!
const techs = [
  { icon: <Cpu size={18} />, label: 'YOLO11 Vision' },
  { icon: <Layers size={18} />, label: 'OpenCV Preprocessing' },
  { icon: <Eye size={18} />, label: 'EasyOCR Extraction' },
  { icon: <Server size={18} />, label: 'FastAPI Backend' },
  { icon: <Code2 size={18} />, label: 'React.js' },
  { icon: <Zap size={18} />, label: 'Vite Tooling' },
  { icon: <Database size={18} />, label: 'Firebase Database' },
  { icon: <Wind size={18} />, label: 'Tailwind CSS' },
];

// Duplicate the array multiple times to ensure the screen is filled 
// regardless of monitor size, preventing the marquee from "snapping".
const doubled = [...techs, ...techs, ...techs, ...techs];

export default function TechStrip() {
  return (
    <div className="relative bg-white dark:bg-[#09090b] border-y border-slate-200 dark:border-white/[0.05] py-5 overflow-hidden transition-colors duration-500">
      
      {/* Gradient Edge Masks 
        Fades the text out at the edges of the screen for a premium look 
      */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-white dark:from-[#09090b] to-transparent z-10 pointer-events-none transition-colors duration-500" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white dark:from-[#09090b] to-transparent z-10 pointer-events-none transition-colors duration-500" />

      {/* Framer Motion Marquee Container */}
      <div className="flex overflow-hidden">
        <motion.div
          animate={{ x: [0, -1035] }} // Translates left. Adjust the second number if you add/remove items.
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30, // Adjust this number to make it faster/slower
          }}
          className="flex gap-12 w-max items-center pr-12"
        >
          {doubled.map((t, i) => (
            <div 
              key={i} 
              className="group flex items-center gap-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm font-bold tracking-wider uppercase transition-colors"
            >
              <span className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
                {t.icon}
              </span>
              <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                {t.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}