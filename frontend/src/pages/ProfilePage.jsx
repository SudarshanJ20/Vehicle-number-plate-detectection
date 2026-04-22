import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserCircle2, Mail, Calendar, Target, LogOut, ShieldCheck } from 'lucide-react'
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
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0f0f1a] px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-bold tracking-[0.1em] uppercase text-indigo-400 mb-2">▶ Account</p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Your account details and stats</p>
        </motion.div>

        {/* Avatar + Name card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.10] bg-[#161625] p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <UserCircle2 size={32} className="text-indigo-400" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile?.name || user?.displayName || 'User'}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium capitalize">{profile?.plan || 'free'} plan</span>
            </div>
          </div>
        </motion.div>

        {/* Info cards */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="rounded-2xl border border-white/[0.10] bg-[#161625] p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Mail size={15} className="text-indigo-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
              <p className="text-sm text-white font-medium truncate">{profile?.email || user?.email || '—'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.10] bg-[#161625] p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <Calendar size={15} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Joined</p>
              <p className="text-sm text-white font-medium">{joinedDate}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.10] bg-[#161625] p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Target size={15} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Total Detections</p>
              <p className="text-2xl font-bold text-white tabular-nums">{profile?.totalDetections ?? 0}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.10] bg-[#161625] p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={15} className="text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Account Type</p>
              <p className="text-sm text-white font-medium capitalize">{user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email & Password'}</p>
            </div>
          </div>

        </motion.div>

        {/* Logout button */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] text-red-400 hover:bg-red-500/[0.12] hover:border-red-500/30 font-semibold text-sm transition-all"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </motion.div>

      </div>
    </div>
  )
}