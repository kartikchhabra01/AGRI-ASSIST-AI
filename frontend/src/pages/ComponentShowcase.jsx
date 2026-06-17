import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Button,
  Input,
  Modal,
  Loader,
  successToast,
  errorToast,
  warningToast,
} from '../components/ui'

function Section({ title, description, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 sm:p-8"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </motion.section>
  )
}

function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [validationValue, setValidationValue] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleValidation = () => {
    if (!validationValue.trim()) {
      setValidationError('This field is required')
      errorToast('Validation failed — please fill in all fields')
    } else if (validationValue.length < 3) {
      setValidationError('Must be at least 3 characters')
      warningToast('Input is too short')
    } else {
      setValidationError('')
      successToast('Validation passed successfully!')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-300 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-agri-600">
              UI Library
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Component Showcase
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
              A live demonstration of the reusable UI component library built for
              AGRI ASSIST AI. Every component is production-ready and fully accessible.
            </p>
          </motion.div>

          <div className="space-y-8">
            <Section title="Button Variants" description="Primary, secondary, and outline styles.">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </Section>

            <Section title="Button Sizes" description="Small, medium, and large sizes.">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </Section>

            <Section title="Input" description="Accessible labeled inputs with focus styling.">
              <div className="max-w-md space-y-4">
                <Input
                  label="Crop Name"
                  placeholder="e.g. Maize, Wheat, Rice"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="farmer@example.com"
                />
              </div>
            </Section>

            <Section
              title="Validation Example"
              description="Input with error state and toast feedback."
            >
              <div className="max-w-md space-y-4">
                <Input
                  label="Farm Location"
                  placeholder="Enter your farm location"
                  value={validationValue}
                  onChange={(e) => {
                    setValidationValue(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                  error={validationError}
                />
                <Button onClick={handleValidation}>Validate Input</Button>
              </div>
            </Section>

            <Section title="Modal" description="Accessible dialog with focus trap and backdrop dismiss.">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Crop Advisory"
              >
                <p className="mb-6 leading-relaxed">
                  This modal demonstrates focus trapping, escape key dismissal, and
                  backdrop click to close. Use it for confirmations, forms, or detail views.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setModalOpen(false)}>Confirm</Button>
                </div>
              </Modal>
            </Section>

            <Section title="Toast Notifications" description="Success, error, and warning toasts.">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => successToast('Crop data saved successfully!')}
                >
                  Success Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => errorToast('Failed to connect to the server.')}
                >
                  Error Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => warningToast('Weather alert: heavy rain expected.')}
                >
                  Warning Toast
                </Button>
              </div>
            </Section>

            <Section title="Loaders" description="Spinner and skeleton loading states.">
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Spinner Loader
                  </p>
                  <div className="flex flex-wrap items-center gap-6">
                    <Loader type="spinner" size="sm" />
                    <Loader type="spinner" size="md" />
                    <Loader type="spinner" size="lg" />
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Skeleton Loader
                  </p>
                  <div className="max-w-md space-y-3">
                    <Loader type="skeleton" size="lg" />
                    <Loader type="skeleton" size="md" />
                    <Loader type="skeleton" size="sm" className="w-2/3" />
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ComponentShowcase
