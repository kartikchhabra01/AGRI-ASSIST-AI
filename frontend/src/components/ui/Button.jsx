/**
 * Reusable button component with variant and size support.
 *
 * @param {Object} props - Component props
 * @param {'primary' | 'secondary' | 'outline'} [props.variant='primary'] - Visual style variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Disables interaction and applies muted styling
 * @param {() => void} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button label or content
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='button'] - Native button type attribute
 * @returns {JSX.Element} Styled button element
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...rest
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-agri-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

  const variants = {
    primary:
      'bg-gradient-to-r from-agri-600 to-agri-500 text-white shadow-md shadow-agri-600/25 hover:from-agri-700 hover:to-agri-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-agri-100 text-agri-800 hover:bg-agri-200 dark:bg-agri-900/40 dark:text-agri-300 dark:hover:bg-agri-900/60 hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'border-2 border-agri-500 text-agri-700 bg-transparent hover:bg-agri-50 dark:text-agri-400 dark:border-agri-500 dark:hover:bg-agri-950/50 hover:-translate-y-0.5 active:translate-y-0',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
