/**
 * Skeleton Loader Component
 * Used for loading states across the application
 */

export const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClass = 'animate-pulse bg-slate-200 dark:bg-zinc-700 rounded'
  
  const variants = {
    default: baseClass,
    text: 'h-4 w-full ' + baseClass,
    title: 'h-6 w-3/4 ' + baseClass,
    avatar: 'h-10 w-10 rounded-full ' + baseClass,
    card: 'h-24 w-full ' + baseClass,
    button: 'h-10 w-24 ' + baseClass,
  }
  
  return <div className={variants[variant] || variants.default + ' ' + className} />
}

export const CardSkeleton = () => (
  <div className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      <Skeleton variant="avatar" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  </div>
)

export const StatsSkeleton = () => (
  <div className="glass rounded-2xl p-5 shadow-lg shadow-agri-900/5 dark:shadow-black/20">
    <Skeleton variant="title" className="mb-4" />
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl bg-slate-50 p-3 dark:bg-zinc-800">
        <Skeleton variant="text" className="mb-2" />
        <Skeleton variant="title" />
      </div>
      <div className="rounded-xl bg-slate-50 p-3 dark:bg-zinc-800">
        <Skeleton variant="text" className="mb-2" />
        <Skeleton variant="title" />
      </div>
    </div>
  </div>
)

export default Skeleton
