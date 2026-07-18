import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  Cloud,
  CloudRain,
  Droplets,
  Image as ImageIcon,
  MessageSquare,
  Sprout,
  Sun,
  Thermometer,
  TrendingUp,
  Wind,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Leaf,
  Sparkles,
  ArrowRight,
  MapPin,
  Sun as SunIcon,
  Moon,
  ThermometerSun,
  Gauge,
  Eye,
  Waves,
  ArrowUpRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Loader } from '../components/ui'
import { dashboardAPI, authAPI, aiAPI } from '../services/api'
import toast from 'react-hot-toast'

// Quick Actions Data
const quickActions = [
  {
    icon: MessageSquare,
    title: 'Ask AI Assistant',
    description: 'Get expert farming advice',
    path: '/chat',
    color: 'from-agri-500 to-agri-600',
  },
  {
    icon: ImageIcon,
    title: 'Analyze Crop Image',
    description: 'Detect diseases instantly',
    path: '/chat',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Sprout,
    title: 'View Crop Reports',
    description: 'Track crop health history',
    path: '/dashboard',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Cloud,
    title: 'Weather Forecast',
    description: 'Plan your farming activities',
    path: '/dashboard',
    color: 'from-sky-500 to-sky-600',
  },
  {
    icon: Leaf,
    title: 'New Consultation',
    description: 'Start a new farming session',
    path: '/chat',
    color: 'from-teal-500 to-teal-600',
  },
]

// Suggested Prompts for AI
const suggestedPrompts = [
  'What crops should I plant this season?',
  'How do I treat tomato leaf blight?',
  'Best irrigation schedule for wheat?',
  'Soil pH recommendations for maize?',
]

function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [chatHistory, setChatHistory] = useState([])
  const [farmHealth, setFarmHealth] = useState(85)
  const [analytics, setAnalytics] = useState({
    cropHealth: { healthy: 12, warning: 3, diseased: 1 },
    imageAnalysis: { uploaded: 45, healthy: 38, diseased: 5, pending: 2 },
    aiUsage: { questions: 128, imagesAnalyzed: 45, avgResponseTime: '1.2s' },
    cropDistribution: { wheat: 35, rice: 25, tomato: 20, maize: 15, other: 5 },
  })
  const [upcomingTasks, setUpcomingTasks] = useState([
    { task: 'Water Wheat Field', date: 'Today', priority: 'high' },
    { task: 'Apply fertilizer', date: 'Tomorrow', priority: 'medium' },
    { task: 'Crop inspection', date: 'Friday', priority: 'low' },
    { task: 'Expected rainfall', date: 'Sunday', priority: 'info' },
  ])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authAPI.isAuthenticated()) {
        setLoading(false)
        return
      }

      try {
        const userData = authAPI.getUser()
        setUser(userData)

        // Fetch chat history for recent activity
        const chatResponse = await aiAPI.getChatHistory()
        if (chatResponse.success) {
          setChatHistory(chatResponse.data || [])
        }

        // TODO: Integrate real weather API (OpenWeatherMap, WeatherAPI, etc.)
        // For now, using placeholder data
        setWeather({
          temperature: 28,
          feelsLike: 30,
          humidity: 67,
          windSpeed: 12,
          rainChance: 40,
          uvIndex: 6,
          sunrise: '05:45',
          sunset: '19:30',
          condition: 'Partly Cloudy',
          icon: 'cloud-sun',
        })

        // TODO: Fetch real analytics from backend
        // For now, using placeholder data

        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Failed to load dashboard data')
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('en-US', options)
  }

  const formatTime = (date) => {
    const diff = new Date() - new Date(date)
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return new Date(date).toLocaleDateString()
  }

  const getAIRecommendation = () => {
    if (!weather) return 'Loading recommendation...'
    
    const recommendations = []
    
    if (weather.temperature > 25 && weather.humidity < 70) {
      recommendations.push('Good weather for irrigation.')
    }
    
    if (weather.rainChance > 30) {
      recommendations.push('Avoid pesticide spraying after 4 PM because rain is expected.')
    }
    
    if (weather.uvIndex > 6) {
      recommendations.push('High UV index - protect crops during peak hours.')
    }
    
    if (recommendations.length === 0) {
      return 'Weather conditions are normal. Continue regular farming activities.'
    }
    
    return recommendations.join(' ')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-300 dark:bg-zinc-950">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Loader className="h-12 w-12" />
        </main>
      </div>
    )
  }

  const isNewUser = chatHistory.length === 0

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-300 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'Farmer'} 🌾
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                  Here's your farm summary for today.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>{formatDate()}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4" />
                <span>Dehradun, India</span>
              </div>
            </div>
          </motion.div>

          {/* Empty State for New Users */}
          {isNewUser ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl p-8 shadow-lg shadow-agri-900/5 dark:shadow-black/20"
            >
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white shadow-xl shadow-agri-500/30">
                  <Sprout className="h-10 w-10" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome to AGRI ASSIST AI
                </h2>
                <p className="mb-8 text-base text-slate-600 dark:text-slate-400">
                  Start by asking your first farming question or upload a crop image to begin disease analysis.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => navigate('/chat')}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-agri-600 to-agri-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-agri-600/25 transition-all hover:from-agri-700 hover:to-agri-600 hover:shadow-lg"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Ask AI Assistant
                  </button>
                  <button
                    onClick={() => navigate('/chat')}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-agri-300 hover:bg-agri-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 dark:hover:border-agri-600 dark:hover:bg-zinc-700"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Analyze Crop Image
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Top Row: Weather + Farm Health */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-8">
                {/* Weather Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Today's Weather
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {weather?.condition || 'Loading...'}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-lg shadow-sky-500/30">
                      <Sun className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-agri-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Temperature</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.temperature || '--'}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThermometerSun className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Feels Like</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.feelsLike || '--'}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Humidity</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.humidity || '--'}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Wind Speed</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.windSpeed || '--'} km/h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-sky-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Rain Chance</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.rainChance || '--'}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-amber-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">UV Index</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.uvIndex || '--'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-zinc-700">
                    <div className="flex items-center gap-2">
                      <SunIcon className="h-4 w-4 text-amber-500" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {weather?.sunrise || '--:--'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-indigo-500" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {weather?.sunset || '--:--'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Farm Health Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Farm Health
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Overall farm condition score
                  </p>
                  
                  <div className="mt-6 flex items-center justify-center">
                    <div className="relative h-32 w-32">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-slate-200 dark:text-zinc-700"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${farmHealth * 3.52} 352`}
                          className="text-agri-600 transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          {farmHealth}%
                        </span>
                        <span className="text-xs font-medium text-agri-600">Excellent</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Based on:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-agri-100 px-2 py-1 text-xs font-medium text-agri-700 dark:bg-agri-900/50 dark:text-agri-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Weather
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-agri-100 px-2 py-1 text-xs font-medium text-agri-700 dark:bg-agri-900/50 dark:text-agri-400">
                        <Sparkles className="h-3 w-3" />
                        AI Recommendations
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-agri-100 px-2 py-1 text-xs font-medium text-agri-700 dark:bg-agri-900/50 dark:text-agri-400">
                        <Leaf className="h-3 w-3" />
                        Disease Reports
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* AI Recommendation Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mb-6 glass rounded-2xl bg-gradient-to-r from-agri-50 to-emerald-50 p-5 shadow-lg shadow-agri-900/5 dark:from-agri-900/20 dark:to-emerald-900/20 dark:shadow-black/20 sm:p-6 lg:mb-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 text-white shadow-lg shadow-agri-500/30">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Today's AI Recommendation
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {getAIRecommendation()}
                    </p>
                    <button
                      onClick={() => navigate('/chat')}
                      className="mt-3 flex items-center gap-2 text-sm font-semibold text-agri-600 hover:text-agri-700 dark:text-agri-400 dark:hover:text-agri-300"
                    >
                      Ask AI for more details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mb-6 lg:mb-8"
              >
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      onClick={() => navigate(action.path)}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-agri-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-agri-600"
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {action.title}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {action.description}
                        </p>
                      </div>
                      <ArrowUpRight className="ml-auto h-5 w-5 text-slate-400" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Middle Row: Analytics */}
              <div className="mb-6 grid grid-cols-1 gap-4 lg:mb-8 lg:grid-cols-3">
                {/* Crop Health Trend */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Crop Health Trend
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Last 30 days
                  </p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Healthy</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {analytics.cropHealth.healthy}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Warning</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {analytics.cropHealth.warning}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Disease Detected</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {analytics.cropHealth.diseased}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Image Analysis Statistics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Image Analysis
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Statistics overview
                  </p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-zinc-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {analytics.imageAnalysis.uploaded}
                      </p>
                    </div>
                    <div className="rounded-xl bg-green-50 p-3 dark:bg-green-900/20">
                      <p className="text-xs text-green-600 dark:text-green-400">Healthy</p>
                      <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                        {analytics.imageAnalysis.healthy}
                      </p>
                    </div>
                    <div className="rounded-xl bg-red-50 p-3 dark:bg-red-900/20">
                      <p className="text-xs text-red-600 dark:text-red-400">Diseased</p>
                      <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                        {analytics.imageAnalysis.diseased}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
                      <p className="text-xs text-amber-600 dark:text-amber-400">Pending</p>
                      <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                        {analytics.imageAnalysis.pending}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* AI Usage */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    AI Usage
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your activity
                  </p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Questions Asked</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {analytics.aiUsage.questions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Images Analyzed</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {analytics.aiUsage.imagesAnalyzed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {analytics.aiUsage.avgResponseTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Row: Recent Activity + Upcoming Tasks */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Recent AI Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Recent Conversations
                    </h3>
                    <button
                      onClick={() => navigate('/chat')}
                      className="text-sm font-semibold text-agri-600 hover:text-agri-700 dark:text-agri-400 dark:hover:text-agri-300"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {chatHistory.slice(0, 4).map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => navigate(`/chat?chatId=${chat._id}`)}
                        className="w-full rounded-xl border border-slate-100 bg-white/50 p-3 text-left transition-all hover:border-agri-200 hover:bg-agri-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-agri-600 dark:hover:bg-agri-900/20"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                              {chat.title || 'New Chat'}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {chat.messages?.[0]?.content?.substring(0, 50) || 'No messages'}...
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(chat.createdAt)}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {chatHistory.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-zinc-700">
                        <MessageSquare className="mx-auto h-8 w-8 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          No conversations yet
                        </p>
                        <button
                          onClick={() => navigate('/chat')}
                          className="mt-2 text-sm font-semibold text-agri-600 hover:text-agri-700 dark:text-agri-400 dark:hover:text-agri-300"
                        >
                          Start your first chat
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Upcoming Tasks */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Upcoming Tasks
                    </h3>
                    <button className="text-sm font-semibold text-agri-600 hover:text-agri-700 dark:text-agri-400 dark:hover:text-agri-300">
                      Manage
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {upcomingTasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                              : task.priority === 'medium'
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
                              : task.priority === 'info'
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                              : 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                          }`}
                        >
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {task.task}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {task.date}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => navigate('/chat')}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-3 text-sm font-medium text-slate-600 transition-all hover:border-agri-300 hover:bg-agri-50 dark:border-zinc-700 dark:text-slate-400 dark:hover:border-agri-600 dark:hover:bg-agri-900/20"
                    >
                      <Sparkles className="h-4 w-4" />
                      Ask AI to create a farming plan
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
