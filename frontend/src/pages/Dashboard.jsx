import { motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  MessageSquare,
  Sprout,
  TrendingUp,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const stats = [
  { label: 'Active Queries', value: '—', icon: MessageSquare },
  { label: 'Crops Monitored', value: '—', icon: Sprout },
  { label: 'Health Score', value: '—', icon: Activity },
  { label: 'Yield Forecast', value: '—', icon: TrendingUp },
]

function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-1 px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-agri-600">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Farming Dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Your central hub for crop health monitoring, AI advisory history, and
              farming analytics. This dashboard will display real-time insights once
              connected to the backend — for now, explore the layout below.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass rounded-2xl p-6 shadow-md shadow-agri-900/5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <stat.icon className="h-5 w-5 text-agri-500" />
                </div>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass mt-8 rounded-3xl p-8 shadow-lg shadow-agri-900/5 sm:p-10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Analytics Overview
                </h2>
                <p className="text-sm text-slate-500">Coming soon</p>
              </div>
            </div>
            <div className="mt-8 flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-agri-200 bg-agri-50/50">
              <p className="text-sm font-medium text-agri-600">
                Chart and analytics widgets will appear here
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
