import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Settings, LogOut, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { authAPI } from '../services/api'
import Logo from './Logo'

const publicNavLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Components', path: '/components' },
]

const authNavLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'AI Chat', path: '/chat' },
  { label: 'Settings', path: '/settings' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const userData = authAPI.getUser()
    setUser(userData)
  }, [location])

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    authAPI.logout()
    navigate('/login')
    setIsOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {(user ? authNavLinks : publicNavLinks).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 xl:px-4 ${
                isActive(link.path)
                  ? 'bg-agri-100 text-agri-800 dark:bg-agri-900/50 dark:text-agri-300'
                  : 'text-slate-600 hover:bg-agri-50 hover:text-agri-700 dark:text-slate-300 dark:hover:bg-zinc-800 dark:hover:text-agri-400'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-agri-50 hover:text-agri-700 dark:text-slate-300 dark:hover:bg-zinc-800 dark:hover:text-agri-400"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {user ? (
            <>
              <div className="ml-2 flex items-center gap-2 rounded-xl bg-agri-50 px-3 py-2 dark:bg-zinc-800">
                <User className="h-4 w-4 text-agri-600 dark:text-agri-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-1 rounded-xl bg-gradient-to-r from-agri-600 to-agri-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-agri-600/25 transition-all duration-200 hover:from-agri-700 hover:to-agri-600 hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-agri-50 dark:text-slate-300 dark:hover:bg-zinc-800"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-agri-50 dark:text-slate-300 dark:hover:bg-zinc-800"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl shadow-lg shadow-agri-900/5 dark:shadow-black/20 lg:hidden"
          >
            <div className="flex flex-col gap-1 p-3">
              {(user ? authNavLinks : publicNavLinks).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-agri-100 text-agri-800 dark:bg-agri-900/50 dark:text-agri-300'
                      : 'text-slate-600 hover:bg-agri-50 dark:text-slate-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="mt-2 flex items-center gap-2 rounded-xl bg-agri-50 px-4 py-3 dark:bg-zinc-800">
                    <User className="h-4 w-4 text-agri-600 dark:text-agri-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {user.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="mt-1 rounded-xl bg-gradient-to-r from-agri-600 to-agri-500 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
