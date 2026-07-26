import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Github, Linkedin } from 'lucide-react'
import Logo from './Logo'
import { authAPI } from '../services/api'
import { ConfirmModal } from './ui'

const footerLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'AI Chat', path: '/chat' },
  { label: 'Login', path: '/login' },
]

const socialLinks = [
  { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/kartik-chhabra-927286289' },
  { label: 'GitHub', icon: Github, href: 'https://github.com/kartikchhabra01' },
]

function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated())
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false)

  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated())
  }, [location])

  const handleLoginClick = () => {
    if (isAuthenticated) {
      setShowLogoutPrompt(true)
      return
    }
    navigate('/login')
  }

  const handleLogout = () => {
    authAPI.logout()
    setShowLogoutPrompt(false)
    navigate('/login')
  }

  return (
    <footer className="border-t border-agri-100 bg-white/80 backdrop-blur-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Empowering farmers with AI-driven crop advisory, disease detection,
              and smart farming insights for a sustainable future.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  {link.path === '/login' ? (
                    <button
                      type="button"
                      onClick={handleLoginClick}
                      className="text-sm text-slate-600 transition-colors hover:text-agri-600 dark:text-slate-400 dark:hover:text-agri-400"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-sm text-slate-600 transition-colors hover:text-agri-600 dark:text-slate-400 dark:hover:text-agri-400"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Connect
            </h4>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-agri-100 bg-agri-50 text-agri-700 transition-all duration-200 hover:border-agri-300 hover:bg-agri-100 hover:text-agri-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-agri-400 dark:hover:border-agri-600 dark:hover:bg-zinc-700"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-agri-100 pt-8 dark:border-zinc-800 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {currentYear} AGRI ASSIST AI. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            SIP 2026 — Summer Internship Programme
          </p>
        </div>
      </div>
      <ConfirmModal
        isOpen={showLogoutPrompt}
        onClose={() => setShowLogoutPrompt(false)}
        onConfirm={handleLogout}
        title="Already logged in"
        message="You are already logged in. Do you want to log out?"
        confirmText="Log out"
        danger
      />
    </footer>
  )
}

export default Footer
