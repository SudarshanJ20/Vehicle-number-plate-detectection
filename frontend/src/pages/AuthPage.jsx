import { useState } from 'react'
import { Mail, Lock, User, Chrome, LogIn } from 'lucide-react'
import { signUp, signIn, signInWithGoogle, resetPassword } from '../firebase/auth'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AuthPage() {
  const { user } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        await signUp(name, email, password)
        setMessage('Account created successfully.')
      } else {
        await signIn(email, password)
        setMessage('Logged in successfully.')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!email) {
      setError('Enter your email first.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')
    try {
      await resetPassword(email)
      setMessage('Password reset email sent.')
    } catch (err) {
      setError(err.message || 'Could not send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07070d] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a12] shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/10">
          <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-3">
            PlateAI Access
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {mode === 'login'
              ? 'Sign in to save detections and view analytics.'
              : 'Sign up to store your detection history and dashboard stats.'}
          </p>
        </div>

        <div className="p-8 space-y-5">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.05] text-white font-semibold py-3 rounded-xl transition-all"
          >
            <Chrome size={16} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Full name</label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <User size={16} className="text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sudarshan"
                    className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Email</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <Mail size={16} className="text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Password</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <Lock size={16} className="text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-all"
            >
              <LogIn size={16} />
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
                setMessage('')
              }}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {mode === 'login' ? 'Create an account' : 'Already have an account?'}
            </button>

            {mode === 'login' && (
              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}