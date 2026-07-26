import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Cloud,
  CloudRain,
  Droplets,
  Image as ImageIcon,
  MessageSquare,
  Sprout,
  Sun,
  Thermometer,
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
  Eye,
  ArrowUpRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Loader, CardSkeleton, StatsSkeleton, ErrorState } from '../components/ui'
import { dashboardAPI, authAPI, aiAPI } from '../services/api'

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
        try {
          const chatResponse = await aiAPI.getChatHistory()
          if (chatResponse.success) {
            setChatHistory(chatResponse.data || chatResponse.chats || [])
          }
        } catch {
          setChatHistory([])
        }

        // Fetch dashboard analytics from backend
        try {
          const statsResponse = await dashboardAPI.getUserStats()
          if (statsResponse.success) {
            // Map backend response to frontend structure
            const backendData = statsResponse.data
            setAnalytics({
              totalQueries: backendData.totalQueries || 0,
              totalReports: backendData.totalReports || 0,
              totalChats: backendData.totalChats || 0,
              recentQueries: backendData.recentQueries || 0,
              recentChats: backendData.recentChats || 0,
              cropsQueried: backendData.cropsQueried || [],
              lastActivity: backendData.lastActivity,
              reportsBySeverity: backendData.reportsBySeverity || null,
              farmHealth: backendData.farmHealth ?? null,
              imageUploads: backendData.imageUploads ?? null,
            })
            setFarmHealth(backendData.farmHealth ?? null)
          } else {
            setAnalytics({})
            setFarmHealth(null)
          }
        } catch {
          setAnalytics({})
          setFarmHealth(null)
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
            setWeatherError(error.message || 'Failed to load weather')
          }
        } else {
          setWeatherError('Set your farm location to view weather.')
        }
        setWeatherLoading(false)

        setLoading(false)
      } catch {
        // Don't show error toast, just continue with partial data
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
    const geocodeResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    )
    if (!geocodeResponse.ok) throw new Error('Unable to find the farm location')
    const geocodeData = await geocodeResponse.json()
    const place = geocodeData.results?.[0]
    if (!place) throw new Error('Unable to find the farm location')

    const params = new URLSearchParams({
      latitude: place.latitude,
      longitude: place.longitude,
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
      daily: 'precipitation_probability_max,sunrise,sunset,uv_index_max',
      timezone: 'auto',
    })
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
    if (!response.ok) throw new Error('Weather data is unavailable')
    const data = await response.json()
    const current = data.current
    if (!current) throw new Error('Weather data is unavailable')

    const weatherCodes = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
      61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow',
      75: 'Heavy snow', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail',
    }
    const formatTime = (value) => value
      ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '--:--'

    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      rainChance: data.daily?.precipitation_probability_max?.[0] ?? 0,
      uvIndex: data.daily?.uv_index_max?.[0] ?? null,
      sunrise: formatTime(data.daily?.sunrise?.[0]),
      sunset: formatTime(data.daily?.sunset?.[0]),
      condition: weatherCodes[current.weather_code] || 'Weather update',
      weatherCode: current.weather_code,
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
        const data = statsResponse.data
        setAnalytics({
          totalQueries: data.totalQueries || 0,
          totalReports: data.totalReports || 0,
          totalChats: data.totalChats || 0,
          recentQueries: data.recentQueries || 0,
          recentChats: data.recentChats || 0,
          cropsQueried: data.cropsQueried || [],
          lastActivity: data.lastActivity,
          reportsBySeverity: data.reportsBySeverity || null,
          farmHealth: data.farmHealth ?? null,
          imageUploads: data.imageUploads ?? null,
        })
        setFarmHealth(data.farmHealth ?? null)
      }
    } catch (error) {
      setAnalyticsError(error.message || 'Failed to load analytics')
    }
  }

  const getAIRecommendation = () => {
    if (!weather) {
      return user?.farmLocation
        ? `Weather data for ${user.farmLocation} is unavailable right now. Ask the assistant for crop-specific guidance.`
        : 'Set your farm location to receive weather-aware crop guidance.'
    }

    const crop = user?.cropType ? ` for your ${user.cropType} crop` : ''
    const location = user?.farmLocation ? ` in ${user.farmLocation}` : ''
    const recommendations = []

    if (weather.rainChance >= 30) recommendations.push('Rain is possible, so postpone pesticide spraying if practical.')
    if (weather.temperature >= 35) recommendations.push('High heat calls for checking soil moisture and irrigation.')
    if (weather.humidity >= 80) recommendations.push('High humidity increases fungal-risk monitoring.')
    if (weather.temperature > 25 && weather.humidity < 70) recommendations.push('Conditions are suitable for planned irrigation.')

    return recommendations.length
      ? `${recommendations.join(' ')}${crop}${location}.`
      : `Current conditions look stable${crop}${location}; continue your normal field checks.`
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
          <>
          {isNewUser && (
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
          )}

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
                        {weather?.weatherCode >= 51 ? <CloudRain className="h-6 w-6" /> : weather?.weatherCode >= 1 ? <Cloud className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                      </div>
                    </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-agri-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Temperature</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.temperature ?? '--'}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThermometerSun className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Feels Like</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.feelsLike ?? '--'}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Humidity</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.humidity ?? '--'}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Wind Speed</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.windSpeed ?? '--'} km/h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-sky-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Rain Chance</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.rainChance ?? '--'}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-amber-600" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">UV Index</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {weather?.uvIndex ?? '--'}
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
                  {farmHealth === null ? (
                    <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-5 text-center dark:border-zinc-700">
                      <Sprout className="mx-auto h-8 w-8 text-agri-600" />
                      <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                        No crop reports available yet.
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Upload your first crop image to generate a health score.
                      </p>
                      <button
                        onClick={() => navigate('/chat')}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-agri-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-agri-700"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Analyze Crop Image
                      </button>
                    </div>
                  ) : (
                    <>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Derived from your saved crop-report severity.</p>
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
                          {farmHealth !== null ? `${farmHealth}%` : '—'}
                        </span>
                        <span className="text-xs font-medium text-agri-600">
                          {farmHealth !== null ? (farmHealth >= 80 ? 'Excellent' : farmHealth >= 60 ? 'Good' : 'Needs Attention') : 'No data'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    Based on your saved crop reports.
                  </p>
                    </>
                  )}
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
                    {analytics?.totalReports > 0 && analytics.reportsBySeverity ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Low severity</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.reportsBySeverity.Low || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Moderate severity</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.reportsBySeverity.Moderate || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">High severity</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.reportsBySeverity.High || 0}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center dark:border-zinc-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400">No crop reports available yet.</p>
                      </div>
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
                    {analytics?.imageUploads > 0 ? (
                      <>
                        <div className="col-span-2 rounded-xl bg-slate-50 p-3 dark:bg-zinc-800">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">
                            {analytics.imageUploads}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 rounded-xl bg-slate-50 p-3 dark:bg-zinc-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">No image analyses yet.</p>
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
                    {analytics ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Advisory questions</span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.totalQueries || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Conversations</span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.totalChats || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Crop reports</span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {analytics.totalReports || 0}
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
                            {chat.messageCount ? `${chat.messageCount} messages` : 'No messages'}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(chat.updatedAt)}</span>
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
          </>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
