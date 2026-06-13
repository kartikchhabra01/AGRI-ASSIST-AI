import { Link } from 'react-router-dom'

function Logo({ className = '', showText = true }) {
  return (
    <Link
      to="/"
      className={`group flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
      aria-label="AGRI ASSIST AI — Go to home"
    >
      <img
        src="/assets/tbi-logo.png"
        alt="Technology Business Incubator GEU"
        className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11"
      />
      {showText && (
        <span className="text-lg font-bold tracking-tight text-agri-800 sm:text-xl">
          <span className="hidden sm:inline">AGRI ASSIST AI</span>
          <span className="sm:hidden">AGRI AI</span>
        </span>
      )}
    </Link>
  )
}

export default Logo
