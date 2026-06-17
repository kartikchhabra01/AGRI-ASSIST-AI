import toast from 'react-hot-toast'
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

const toastBaseStyle = {
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '500',
  maxWidth: '400px',
}

/**
 * Display a success toast notification.
 *
 * @param {string} message - Message to display
 * @returns {string} Toast id from react-hot-toast
 */
export function successToast(message) {
  return toast.success(message, {
    style: toastBaseStyle,
    icon: <CheckCircle className="h-5 w-5 text-agri-500" />,
    className: 'dark:!bg-zinc-800 dark:!text-white dark:!border dark:!border-zinc-700',
  })
}

/**
 * Display an error toast notification.
 *
 * @param {string} message - Message to display
 * @returns {string} Toast id from react-hot-toast
 */
export function errorToast(message) {
  return toast.error(message, {
    style: toastBaseStyle,
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    className: 'dark:!bg-zinc-800 dark:!text-white dark:!border dark:!border-zinc-700',
  })
}

/**
 * Display a warning toast notification.
 *
 * @param {string} message - Message to display
 * @returns {string} Toast id from react-hot-toast
 */
export function warningToast(message) {
  return toast(message, {
    style: toastBaseStyle,
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    className: 'dark:!bg-zinc-800 dark:!text-white dark:!border dark:!border-zinc-700',
  })
}

/**
 * Toast provider wrapper — re-export for convenience.
 * Mount `<Toaster />` from react-hot-toast at the app root.
 */
export { Toaster } from 'react-hot-toast'
