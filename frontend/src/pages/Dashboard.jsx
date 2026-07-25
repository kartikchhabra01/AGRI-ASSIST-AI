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
import { Loader, Skeleton, CardSkeleton, StatsSkeleton, ErrorState } from '../components/ui'
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
  const [weatherError, setWeatherError] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [farmHealth, setFarmHealth] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [analyticsError, setAnalyticsError] = useState(null)
  const [upcomingTasks, setUpcomingTasks] = useState([])

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

        // Fetch dashboard analytics from backend
        try {
          const statsResponse = await dashboardAPI.getUserStats()
          if (statsResponse.success) {
            setAnalytics(statsResponse.data)
            setFarmHealth(statsResponse.data.farmHealth || null)
          }
        } catch (error) {
          console.error('Failed to fetch analytics:', error)
          setAnalyticsError(error.message || 'Failed to load analytics')
        }

        // Fetch weather based on user's farm location
        if (userData?.farmLocation) {
          try {
            const weatherResponse = await fetchWeather(userData.farmLocation)
            if (weatherResponse) {
              setWeather(weatherResponse)
            } else {
              setWeatherError('Weather data unavailable')
            }
          } catch (error) {
            console.error('Failed to fetch weather:', error)
            setWeatherError(error.message || 'Failed to load weather')
          }
        } else {
          setWeatherError('Farm location not set')
        }
        setWeatherLoading(false)

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

  const fetchWeather = async (location) => {
    // Using OpenWeatherMap API
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
    if (!API_KEY) {
      console.warn('Weather API key not configured')
      return null
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
      )
      const data = await response.json()

      if (data.cod !== 200) {
        throw new Error(data.message || 'Weather API error')
      }

      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        rainChance: data.rain?.['1h'] ? Math.min(100, data.rain['1h'] * 10) : 0,
        uvIndex: 0, // UV index requires separate API call
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
      }
    } catch (error) {
      console.error('Weather fetch error:', error)
      throw error
    }
  }

  const handleRetryWeather = async () => {
    setWeatherError(null)
    setWeatherLoading(true)
    const userData = authAPI.getUser()
    if (userData?.farmLocation) {
      try {
        const weatherResponse = await fetchWeather(userData.farmLocation)
        if (weatherResponse) {
          setWeather(weatherResponse)
        } else {
          setWeatherError('Weather data unavailable')
        }
      } catch (error) {
        setWeatherError(error.message || 'Failed to load weather')
      }
    }
    setWeatherLoading(false)
  }

  const handleRetryAnalytics = async () => {
    setAnalyticsError(null)
    try {
      const statsResponse = await dashboardAPI.getUserStats()
      if (statsResponse.success) {
        setAnalytics(statsResponse.data)
        setFarmHealth(statsResponse.data.farmHealth || null)
      }
    } catch (error) {
      setAnalyticsError(error.message || 'Failed to load analytics')
    }
  }

  const getAIRecommendation = () => {
    if (!weather) return 'Weather data unavailable'
    if (!analytics) return 'Loading recommendations...'
    
    const recommendations = []
    
    if (weather.temperature > 25 && weather.humidity < 70) {
      recommendations.push('Good weather for irrigation today.')
    }
    
    if (weather.rainChance > 30) {
      recommendations.push('Rain expected - avoid pesticide spraying.')
    }
    
    if (weather.temperature > 35) {
      recommendations.push('High temperature - ensure adequate irrigation.')
    }
    
    if (weather.humidity > 80) {
      recommendations.push('High humidity - monitor for fungal diseases.')
    }
    
    if (recommendations.length === 0) {
      return 'Weather conditions are favorable. Continue regular farming activities.'
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
                <span>{user?.farmLocation || 'Location not set'}</span>
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
                {weatherLoading ? (
                  <CardSkeleton />
                ) : weatherError ? (
                  <ErrorState message={weatherError} onRetry={handleRetryWeather} variant="warning" />
                ) : (
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
                          {weather?.condition || 'Weather unavailable'}
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
                )}

                {/* Farm Health Score */}
                {!weatherLoading && (
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
                          strokeDasharray={`${(farmHealth || 0) * 3.52} 352`}
                          className="text-agri-600 transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          {farmHealth !== null ? `${farmHealth}%` : '--'}
                        </span>
                        <span className="text-xs font-medium text-agri-600">
                          {farmHealth !== null ? (farmHealth >= 80 ? 'Excellent' : farmHealth >= 60 ? 'Good' : 'Needs Attention') : 'Loading'}
                        </span>
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
                )}
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
                {loading ? (
                  <StatsSkeleton />
                ) : analyticsError ? (
                  <ErrorState message={analyticsError} onRetry={handleRetryAnalytics} variant="default" />
                ) : (
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
                    {analytics?.cropHealth ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Healthy</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.cropHealth.healthy || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Warning</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.cropHealth.warning || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Disease Detected</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.cropHealth.diseased || 0}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No crop health data available</p>
                    )}
                  </div>
                </motion.div>
                )}

                {/* Image Analysis Statistics */}
                {loading ? (
                  <StatsSkeleton />
                ) : analyticsError ? (
                  <ErrorState message={analyticsError} onRetry={handleRetryAnalytics} variant="default" />
                ) : (
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
                    {analytics?.imageAnalysis ? (
                      <>
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-zinc-800">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">
                            {analytics.imageAnalysis.uploaded || 0}
                          </p>
                        </div>
                        <div className="rounded-xl bg-green-50 p-3 dark:bg-green-900/20">
                          <p className="text-xs text-green-600 dark:text-green-400">Healthy</p>
                          <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                            {analytics.imageAnalysis.healthy || 0}
                          </p>
                        </div>
                        <div className="rounded-xl bg-red-50 p-3 dark:bg-red-900/20">
                          <p className="text-xs text-red-600 dark:text-red-400">Diseased</p>
                          <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                            {analytics.imageAnalysis.diseased || 0}
                          </p>
                        </div>
                        <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
                          <p className="text-xs text-amber-600 dark:text-amber-400">Pending</p>
                          <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                            {analytics.imageAnalysis.pending || 0}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 rounded-xl bg-slate-50 p-3 dark:bg-zinc-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">No image analysis data</p>
                      </div>
                    )}
                  </div>
                </motion.div>
                )}

                {/* AI Usage */}
                {loading ? (
                  <StatsSkeleton />
                ) : analyticsError ? (
                  <ErrorState message={analyticsError} onRetry={handleRetryAnalytics} variant="default" />
                ) : (
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
                    {analytics?.aiUsage ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Questions Asked</span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.aiUsage.questions || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Images Analyzed</span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.aiUsage.imagesAnalyzed || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.aiUsage.avgResponseTime || '--'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No usage data available</p>
                    )}
                  </div>
                </motion.div>
                )}
              </div>

              {/* Recent Activity */}
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
