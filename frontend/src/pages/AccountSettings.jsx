import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, MapPin, Sprout, Trash2, User } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button, Input, Loader, ConfirmModal } from '../components/ui'
import { authAPI, advisoryAPI } from '../services/api'
import toast from 'react-hot-toast'

function AccountSettings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Profile update state
  const [name, setName] = useState('')
  const [farmLocation, setFarmLocation] = useState('')
  const [cropType, setCropType] = useState('')
  const [updatingProfile, setUpdatingProfile] = useState(false)
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  
  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  
  // Advisory history state
  const [advisoryHistory, setAdvisoryHistory] = useState([])
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login')
      return
    }

    loadUserData()
    loadAdvisoryHistory()
  }, [navigate])

  const loadUserData = async () => {
    try {
      const userData = authAPI.getUser()
      if (userData) {
        setUser(userData)
        setName(userData.name || '')
        setFarmLocation(userData.farmLocation || '')
        setCropType(userData.cropType || '')
      } else {
        const response = await authAPI.getCurrentUser()
        if (response.success) {
          setUser(response.data.user)
          setName(response.data.user.name || '')
          setFarmLocation(response.data.user.farmLocation || '')
          setCropType(response.data.user.cropType || '')
        }
      }
    } catch (error) {
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const loadAdvisoryHistory = async () => {
    try {
      const response = await advisoryAPI.getHistory()
      if (response.success) {
        setAdvisoryHistory(response.data)
      }
    } catch (error) {
      console.error('Failed to load advisory history:', error)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdatingProfile(true)

    try {
      const response = await authAPI.updateProfile({ name, farmLocation, cropType })
      
      if (response.success) {
        toast.success('Profile updated successfully')
        setUser(response.data.user)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setChangingPassword(true)

    try {
      const response = await authAPI.changePassword({ currentPassword, newPassword })
      
      if (response.success) {
        toast.success('Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeletingAccount(true)

    try {
      const response = await authAPI.deleteAccount()
      
      if (response.success) {
        toast.success('Account deleted successfully')
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setDeletingAccount(false)
      setShowDeleteModal(false)
    }
  }

  const handleDeleteQuery = async (id) => {
    try {
      const response = await advisoryAPI.deleteQuery(id)
      
      if (response.success) {
        toast.success('Query deleted successfully')
        loadAdvisoryHistory()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete query')
    }
  }

  const handleDeleteAllQueries = async () => {
    setDeletingAll(true)

    try {
      const response = await advisoryAPI.deleteAllQueries()
      
      if (response.success) {
        toast.success('All queries deleted successfully')
        setAdvisoryHistory([])
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete queries')
    } finally {
      setDeletingAll(false)
      setShowDeleteAllModal(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50/50 transition-colors duration-300 dark:bg-zinc-950">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Loader className="h-12 w-12" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 transition-colors duration-300 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-agri-600">
              Account Settings
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Manage Your Account
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Update your profile information, change password, or manage your data.
            </p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass mt-8 rounded-2xl p-6 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Profile Information
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your personal details
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Farm Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    placeholder="e.g., Punjab, India"
                    inputClassName="pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Primary Crop Type
                </label>
                <div className="relative">
                  <Sprout className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="e.g., Rice, Wheat, Corn"
                    inputClassName="pl-11"
                  />
                </div>
              </div>

              <Button type="submit" disabled={updatingProfile}>
                {updatingProfile ? <Loader className="h-4 w-4" /> : 'Update Profile'}
              </Button>
            </form>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass mt-6 rounded-2xl p-6 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 text-white">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Change Password
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your password securely
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    inputClassName="pl-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    inputClassName="pl-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? <Loader className="h-4 w-4" /> : 'Change Password'}
              </Button>
            </form>
          </motion.div>

          {/* Advisory History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass mt-6 rounded-2xl p-6 shadow-lg shadow-agri-900/5 dark:shadow-black/20 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 text-white">
                  <Sprout className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Advisory History
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {advisoryHistory.length} queries
                  </p>
                </div>
              </div>
              {advisoryHistory.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteAllModal(true)}
                >
                  Delete All
                </Button>
              )}
            </div>

            {advisoryHistory.length === 0 ? (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                No advisory history yet
              </p>
            ) : (
              <div className="space-y-3">
                {advisoryHistory.slice(0, 5).map((query) => (
                  <div
                    key={query.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {query.crop}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {query.issue}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuery(query.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {advisoryHistory.length > 5 && (
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    And {advisoryHistory.length - 5} more queries...
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Delete Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass mt-6 rounded-2xl border border-red-200 bg-red-50/50 p-6 shadow-lg dark:border-red-900/30 dark:bg-red-950/20 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-900 dark:text-red-100">
                  Delete Account
                </h2>
                <p className="text-xs text-red-700 dark:text-red-300">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
              Deleting your account will permanently remove all your data including advisory history and crop reports.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />

      {/* Delete Account Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
        confirmText="Delete Account"
        danger={true}
      />

      {/* Delete All Queries Modal */}
      <ConfirmModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={handleDeleteAllQueries}
        title="Delete All Queries"
        message="Are you sure you want to delete all your advisory history? This action cannot be undone."
        confirmText="Delete All"
        danger={true}
      />
    </div>
  )
}

export default AccountSettings
