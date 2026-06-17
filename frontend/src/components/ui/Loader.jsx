/**
 * Loading indicator with spinner and skeleton variants.
 *
 * @param {Object} props - Component props
 * @param {'spinner' | 'skeleton'} [props.type='spinner'] - Loader type
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Loader size
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Spinner or skeleton loader
 */
function Loader({ type = 'spinner', size = 'md', className = '' }) {
  const spinnerSizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  }

  const skeletonSizes = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-10',
  }

  if (type === 'skeleton') {
    return (
      <div
        role="status"
        aria-label="Loading content"
        className={`animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-700 ${skeletonSizes[size]} w-full ${className}`}
      />
    )
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-agri-200 border-t-agri-600 dark:border-zinc-600 dark:border-t-agri-500 ${spinnerSizes[size]} ${className}`}
    />
  )
}

export default Loader
