import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../components/ui'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

/**
 * Auth Callback Page
 * Handles OAuth callback from Google login
 * Extracts token from URL and stores it
 */
function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get token from URL query params
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (token) {
          // Store token in localStorage
          localStorage.setItem('token', token)
          
          // Fetch user data
          fetchUserAndRedirect()
        } else {
          toast.error('Authentication failed')
          navigate('/login')
        }
      } catch (error) {
        toast.error('Authentication failed')
        navigate('/login')
      }
    }

    const fetchUserAndRedirect = async () => {
      try {
        const response = await authAPI.getCurrentUser()
        if (response.success) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
          toast.success('Login successful!')
          navigate('/dashboard')
        } else {
          navigate('/login')
        }
      } catch (error) {
        toast.error('Failed to fetch user data')
        navigate('/login')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
      <div className="text-center">
        <Loader className="mx-auto h-12 w-12" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">Completing authentication...</p>
      </div>
    </div>
  )
}

export default AuthCallback
