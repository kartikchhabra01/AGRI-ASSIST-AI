import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter } from 'lucide-react'
import Logo from './Logo'

const footerLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'AI Chat', path: '/chat' },
  { label: 'Components', path: '/components' },
  { label: 'Login', path: '/login' },
]

const socialLinks = [
  { label: 'Twitter', icon: Twitter, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
  { label: 'GitHub', icon: Github, href: '#' },
]

function Footer() {
  const currentYear = new Date().getFullYear()

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
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 transition-colors hover:text-agri-600 dark:text-slate-400 dark:hover:text-agri-400"
                  >
                    {link.label}
                  </Link>
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
    </footer>
  )
}

export default Footer
