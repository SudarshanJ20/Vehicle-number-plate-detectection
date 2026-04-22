import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserCircle2, Mail, Calendar, Target, LogOut, ShieldCheck, Fingerprint, Award } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useAuth } from '../context/AuthContext'
import { logOut } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      if (snap.exists()) setProfile(snap.data())
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const handleLogout = async () => {
    await logOut()
    navigate('/')
  }

  const joinedDate = profile?.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) || '—'

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 transition-colors duration-500">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-xs font-bold tracking-widest uppercase text-slate-500 animate-pulse">Syncing Profile</p>
    </div>
  )

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-10 md:py-16 relative transition-colors duration-500">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="space-y-8 relative z-10">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Fingerprint size={12} /> Account Identity
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">Personal Dashboard</h1>
        </motion.div>

        {/* Main Profile Card (Centered Avatar) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-[2.5rem] border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#161625] p-8 md:p-12 shadow-sm dark:shadow-none transition-all duration-500 flex flex-col items-center text-center"
        >
          <div className="relative mb-6">
             <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/30 blur-2xl rounded-full" />
             <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-50 dark:bg-[#0a0a12] border-4 border-white dark:border-white/5 flex items-center justify-center shrink-0 relative overflow-hidden shadow-xl">
               {user?.photoURL ? (
                 <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
               ) : (
                 <UserCircle2 size={64} className="text-indigo-500 dark:text-indigo-400 opacity-80" />
               )}
             </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white transition-colors">
            {profile?.name || user?.displayName || 'User'}
          </h2>
          
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest transition-colors">
            <Award size={14} /> {profile?.plan || 'Standard'} Tier
          </div>
        </motion.div>

        {/* Stats & Info Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* Email Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="rounded-3xl border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.01] p-6 flex items-center gap-5 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 transition-colors">
              <Mail size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Authenticated Email</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{profile?.email || user?.email || '—'}</p>
            </div>
          </motion.div>

          {/* Joined Date */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="rounded-3xl border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.01] p-6 flex items-center gap-5 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 transition-colors">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Member Since</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{joinedDate}</p>
            </div>
          </motion.div>

          {/* Activity Stat */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-3xl border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.01] p-6 flex items-center gap-5 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 transition-colors">
              <Target size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Plate Extractions</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums transition-colors">{profile?.totalDetections ?? 0}</p>
            </div>
          </motion.div>

          {/* Provider Type */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-3xl border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.01] p-6 flex items-center gap-5 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 transition-colors">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Auth Strategy</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google SSO' : 'Cloud Password'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] border border-rose-200 dark:border-rose-500/20 bg-white dark:bg-rose-500/[0.03] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-300 dark:hover:border-rose-500/40 font-bold text-sm transition-all duration-300 shadow-sm dark:shadow-none"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out from Infrastructure
          </button>
        </motion.div>

      </div>
    </div>
  )
}