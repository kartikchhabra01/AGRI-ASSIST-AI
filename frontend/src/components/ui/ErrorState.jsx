/**
 * Error State Component
 * Displays friendly error messages with retry buttons
 */

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

export const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30',
  }

  return (
    <div className={`rounded-xl border p-6 ${variants[variant]}`}>
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
          variant === 'default' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' :
          variant === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
          'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
        }`}>
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          {variant === 'default' ? 'Error' : variant === 'warning' ? 'Warning' : 'Info'}
        </h3>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 max-w-md">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}

export default ErrorState
