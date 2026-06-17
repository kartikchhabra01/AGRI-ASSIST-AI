import { useId } from 'react'

/**
 * Accessible form input with label, error state, and focus styling.
 *
 * @param {Object} props - Component props
 * @param {string} [props.label] - Accessible label text displayed above the input
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.type='text'] - HTML input type
 * @param {string} [props.value] - Controlled input value
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} [props.onChange] - Change handler
 * @param {string} [props.error] - Error message; applies error styling when provided
 * @param {string} [props.id] - Custom id; auto-generated if omitted
 * @param {string} [props.className] - Additional CSS classes for the wrapper
 * @param {string} [props.inputClassName] - Additional CSS classes for the input element
 * @returns {JSX.Element} Labeled input field
 */
function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  id,
  className = '',
  inputClassName = '',
  ...rest
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        className={`w-full rounded-xl border bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 dark:bg-zinc-800/80 dark:text-white dark:placeholder:text-zinc-500 ${inputClassName} ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20 dark:border-red-500'
            : 'border-slate-200 focus:border-agri-400 focus:ring-2 focus:ring-agri-400/20 dark:border-zinc-600 dark:focus:border-agri-500'
        }`}
        {...rest}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
