import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, User } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button, Input, Loader } from '../components/ui'
import { advisoryAPI, authAPI } from '../services/api'
import toast from 'react-hot-toast'

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content:
      'Hello! I\'m your AGRI ASSIST AI advisor. Please provide the crop name and issue you\'re experiencing to get personalized advice.',
  },
]

function AIChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [crop, setCrop] = useState('')
  const [issue, setIssue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!crop.trim() || !issue.trim() || loading) return

    if (!authAPI.isAuthenticated()) {
      toast.error('Please login to use AI advisory')
      return
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: `Crop: ${crop}\nIssue: ${issue}`,
    }

    setMessages((prev) => [...prev, userMessage])
    setCrop('')
    setIssue('')
    setLoading(true)

    try {
      const response = await advisoryAPI.submitQuery({ crop: crop.trim(), issue: issue.trim() })

      if (response.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `**Diagnosis:** ${response.data.diagnosis}\n\n**Recommendation:** ${response.data.recommendation}`,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      toast.error(error.message || 'Failed to get AI response')
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-300 dark:bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col px-4 pb-4 pt-28 sm:px-6 sm:pt-32 lg:pb-6">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-6"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-agri-600">
              AI Advisory
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Crop Advisory Chat
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Get instant guidance on farming questions powered by AI.
            </p>
          </motion.div>

          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-3xl">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-zinc-700 sm:px-6 sm:py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  AGRI ASSIST AI
                </p>
                <p className="text-xs text-agri-600">Online — Ready to help</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6" style={{ minHeight: '300px', maxHeight: 'calc(100vh - 320px)' }}>
              {loading && (
                <div className="flex items-center gap-3">
                  <Loader className="h-5 w-5" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Analyzing...</span>
                </div>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-agri-100 text-agri-700 dark:bg-agri-900/50 dark:text-agri-300'
                        : 'bg-gradient-to-br from-agri-500 to-agri-700 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] sm:text-base ${
                      msg.role === 'user'
                        ? 'bg-agri-600 text-white'
                        : 'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-slate-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="border-t border-slate-200 p-3 dark:border-zinc-700 sm:p-4"
            >
              <div className="mb-3">
                <Input
                  placeholder="Crop name (e.g., Rice, Wheat, Corn)"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  aria-label="Crop name"
                />
              </div>
              <div className="mb-3">
                <Input
                  placeholder="Describe the issue (e.g., Brown spots on leaves)"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  aria-label="Issue description"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="md" className="!px-6" disabled={loading}>
                  {loading ? <Loader className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  <span className="ml-2">Get Advisory</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AIChat
