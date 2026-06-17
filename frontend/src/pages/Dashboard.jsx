import { motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  CloudRain,
  Droplets,
  MessageSquare,
  Sprout,
  Sun,
  TrendingUp,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const stats = [
  { label: 'Active Queries', value: '24', icon: MessageSquare, change: '+12%' },
  { label: 'Crops Monitored', value: '8', icon: Sprout, change: '+2' },
  { label: 'Health Score', value: '87%', icon: Activity, change: '+5%' },
  { label: 'Yield Forecast', value: '4.2t', icon: TrendingUp, change: '+8%' },
]

const quickInsights = [
  {
    icon: Sun,
    title: 'Weather Today',
    value: '28°C',
    detail: 'Partly cloudy, ideal for field work',
  },
  {
    icon: Droplets,
    title: 'Soil Moisture',
    value: '62%',
    detail: 'Optimal range for maize growth',
  },
  {
    icon: CloudRain,
    title: 'Rain Forecast',
    value: '40%',
    detail: 'Light rain expected Thursday',
  },
]

const recentActivity = [
  { action: 'Crop health scan completed', crop: 'Maize — Field A', time: '2h ago' },
  { action: 'AI advisory requested', crop: 'Tomato — Greenhouse', time: '5h ago' },
  { action: 'Irrigation schedule updated', crop: 'Wheat — Field B', time: '1d ago' },
]

function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 transition-colors duration-300 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-agri-600">
              Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:mt-3 sm:text-3xl lg:text-4xl">
              Farming Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-4 sm:text-base">
              Your central hub for crop health monitoring, AI advisory history, and
              farming analytics. Real-time insights will populate once connected to the backend.
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass rounded-2xl p-5 shadow-md shadow-agri-900/5 dark:shadow-black/20 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                    {stat.label}
                  </p>
                  <stat.icon className="h-5 w-5 text-agri-500" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:mt-3 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-agri-600">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-6 lg:col-span-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 text-white sm:h-12 sm:w-12">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                    Analytics Overview
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    Yield trends &amp; crop performance
                  </p>
                </div>
              </div>
              <div className="mt-6 flex h-40 items-end justify-between gap-2 rounded-2xl border border-agri-100 bg-agri-50/50 px-4 py-4 dark:border-zinc-700 dark:bg-zinc-800/50 sm:mt-8 sm:h-48 sm:gap-3 sm:px-6">
                {[65, 45, 78, 55, 88, 72, 92].map((height, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-agri-600 to-agri-400 transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-slate-400 sm:text-xs">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-6"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Quick Insights
              </h2>
              <div className="mt-4 space-y-3">
                {quickInsights.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white/50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-agri-100 text-agri-700 dark:bg-agri-900/40 dark:text-agri-400">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {item.title}
                        </p>
                        <p className="text-sm font-bold text-agri-600">{item.value}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass mt-6 rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:mt-8 sm:p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h2>
            <div className="mt-4 divide-y divide-slate-100 dark:divide-zinc-700">
              {recentActivity.map((item) => (
                <div
                  key={item.action}
                  className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {item.action}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.crop}</p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
