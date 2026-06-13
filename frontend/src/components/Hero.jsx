import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Sprout } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-agri-950 via-agri-800 to-emerald-600 px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-36 lg:pb-32 lg:pt-40">
      <div
        className="pointer-events-none absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{
          backgroundImage:
            "url('/assets/167669960-farm-field-photo-download-the-best.jpg')",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-b from-black/65 via-black/50 to-agri-950/85 lg:block"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-agri-400/20 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-agri-100 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-agri-300" />
            SIP 2026 — AI for Agriculture
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Smart Farming Powered by{' '}
            <span className="bg-gradient-to-r from-agri-200 to-emerald-200 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-agri-100/90 sm:text-lg lg:mx-0"
          >
            Transform your farm with intelligent crop advisory, real-time disease
            detection, and data-driven insights. AGRI ASSIST AI empowers farmers
            to grow smarter, reduce losses, and maximize yields.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              to="/login"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-agri-800 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-agri-50 hover:shadow-2xl sm:w-auto"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="glass-dark relative overflow-hidden rounded-3xl p-8 shadow-2xl shadow-black/20">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-agri-400/20 blur-2xl" />
            <div className="relative flex flex-col items-center gap-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-agri-400 to-agri-600 shadow-lg shadow-agri-900/30">
                <Sprout className="h-10 w-10 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-agri-300">
                  Platform Overview
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  Your AI Farming Companion
                </p>
              </div>
              <div className="grid w-full grid-cols-3 gap-3">
                {[
                  { label: 'Crops', value: '50+' },
                  { label: 'Accuracy', value: '94%' },
                  { label: 'Farmers', value: '10K+' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white/10 px-3 py-4 backdrop-blur-sm"
                  >
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-agri-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
