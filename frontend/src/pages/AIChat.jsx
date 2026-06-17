import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, User } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button, Input } from '../components/ui'

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content:
      'Hello! I\'m your AGRI ASSIST AI advisor. Ask me about crop diseases, pest management, soil health, or best farming practices.',
  },
  {
    id: 2,
    role: 'user',
    content: 'What are the signs of nitrogen deficiency in maize?',
  },
  {
    id: 3,
    role: 'assistant',
    content:
      'Nitrogen deficiency in maize typically shows as yellowing starting from the tip of lower leaves, progressing along the midrib in a V-shape pattern. Plants may appear stunted with reduced yield. Consider soil testing and applying nitrogen-rich fertilizer during the vegetative stage.',
  },
]

function AIChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content:
            'Thank you for your question! Full AI responses will be available once the backend is connected. For now, always verify critical advice with a certified agricultural expert.',
        },
      ])
    }, 800)
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
              className="flex items-end gap-2 border-t border-slate-200 p-3 dark:border-zinc-700 sm:gap-3 sm:p-4"
            >
              <div className="flex-1">
                <Input
                  placeholder="Ask about crops, diseases, or farming..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-label="Chat message"
                />
              </div>
              <Button type="submit" size="md" className="shrink-0 !px-4">
                <Send className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-1">Send</span>
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AIChat
