import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Leaf, Lock, Mail, User } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button, Input, Loader } from '../components/ui'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [location, setLocation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.register({ name, email, password, location })
      
      if (response.success) {
        toast.success('Registration successful! Please login.')
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col transition-colors duration-300">
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-24 sm:px-6 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-agri-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
        <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-agri-200/40 blur-3xl dark:bg-agri-900/20" />
        <div className="pointer-events-none absolute -right-32 bottom-20 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/10" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass relative w-full max-w-md rounded-3xl p-6 shadow-xl shadow-agri-900/10 dark:shadow-black/30 sm:p-10"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white shadow-lg shadow-agri-600/25">
              <Leaf className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Join AGRI ASSIST AI to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Farmer"
                  required
                  inputClassName="pl-11"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  inputClassName="pl-11"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Location (optional)
              </label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Punjab, India"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  inputClassName="pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader className="h-4 w-4" /> : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-agri-600 transition-colors hover:text-agri-700 dark:text-agri-400 dark:hover:text-agri-300"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

export default Register
