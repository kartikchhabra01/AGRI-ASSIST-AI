import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Send, User, Plus, Trash2, Image as ImageIcon, 
  Mic, MicOff, Volume2, MessageSquare, X, ChevronLeft,
  Sparkles, Leaf, Droplets, Bug, Sun, Sprout, Search
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button, Loader } from '../components/ui'
import { aiAPI, authAPI } from '../services/api'
import toast from 'react-hot-toast'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
]

const SUGGESTED_PROMPTS = [
  { icon: Sparkles, text: 'Diagnose Disease', prompt: 'My crop has unusual symptoms, can you help diagnose the disease?' },
  { icon: Leaf, text: 'Recommend Fertilizer', prompt: 'What fertilizer should I use for my crops?' },
  { icon: Bug, text: 'Pest Control', prompt: 'How can I control pests in my field?' },
  { icon: Droplets, text: 'Watering Advice', prompt: 'What is the best watering schedule for my crops?' },
  { icon: Sprout, text: 'Soil Health', prompt: 'How can I improve my soil health?' },
  { icon: Sun, text: 'Weather Advice', prompt: 'How should I protect my crops from weather conditions?' }
]

const getSpeechLanguage = (language) => ({
  hi: 'hi-IN',
  pa: 'pa-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
}[language] || 'en-US')

// Group chats by time period
const groupChatsByTime = (chats) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const groups = {
    today: [],
    yesterday: [],
    previous7Days: [],
    older: []
  }

  chats.forEach(chat => {
    const chatDate = new Date(chat.updatedAt)
    if (chatDate >= today) {
      groups.today.push(chat)
    } else if (chatDate >= yesterday) {
      groups.yesterday.push(chat)
    } else if (chatDate >= weekAgo) {
      groups.previous7Days.push(chat)
    } else {
      groups.older.push(chat)
    }
  })

  return groups
}

function AIChat() {
  const [searchParams] = useSearchParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [language, setLanguage] = useState('en')
  const [, setIsSpeaking] = useState(false)
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true)
  const [lastFailedMessage, setLastFailedMessage] = useState(null)
  const [lastFailedImage, setLastFailedImage] = useState(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)
  const speechBaseInputRef = useRef('')
  const textareaRef = useRef(null)

  // Filter chat history based on search query
  const filteredChatHistory = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory
    const query = searchQuery.toLowerCase()
    return chatHistory.filter(chat => 
      (chat.title || 'New Chat').toLowerCase().includes(query) ||
      (chat.messages?.[0]?.content || '').toLowerCase().includes(query)
    )
  }, [chatHistory, searchQuery])

  const groupedChats = useMemo(() => groupChatsByTime(filteredChatHistory), [filteredChatHistory])

  useEffect(() => {
    loadChatHistory()
    setupSpeechRecognition()
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null
        recognitionRef.current.onerror = null
        recognitionRef.current.onend = null
        recognitionRef.current.onstart = null
        recognitionRef.current.abort()
      }
    }
    // Speech recognition is initialized once; its language is refreshed
    // immediately before recording starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const loadChatHistory = async () => {
    try {
      const response = await aiAPI.getChatHistory()
      if (response.success) {
        setChatHistory(response.chats)
      }
    } catch {
      // History is non-blocking; the chat remains usable without it.
    }
  }

  const setupSpeechRecognition = () => {
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    setIsSpeechSupported(isSupported)
    
    if (isSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = getSpeechLanguage(language)

      recognitionRef.current.onstart = () => {
        setIsRecording(true)
      }

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let index = 0; index < event.results.length; index += 1) {
          const transcript = event.results[index][0].transcript
          if (event.results[index].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setInput(`${speechBaseInputRef.current}${finalTranscript}${interimTranscript}`.trimStart())
      }

      recognitionRef.current.onerror = (event) => {
        setIsRecording(false)
        const messages = {
          'not-allowed': 'Microphone permission was denied. Allow microphone access and try again.',
          'service-not-allowed': 'Speech recognition is not available in this browser.',
          'audio-capture': 'No microphone was found. Check that a microphone is connected and available.',
          network: 'Speech recognition network error. Check your connection and try again.',
          'language-not-supported': 'The selected language is not supported by speech recognition in this browser.',
          'language-unavailable': 'The selected speech-recognition language is currently unavailable.',
          'no-speech': 'No speech was detected. Please try again.',
        }
        if (event.error !== 'aborted') toast.error(messages[event.error] || 'Unable to start voice input. Please try again.')
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }

  const startRecording = useCallback(() => {
    if (!isSpeechSupported) {
      toast.error('Voice input is not supported in this browser')
      return
    }
    if (recognitionRef.current) {
      try {
        speechBaseInputRef.current = input ? `${input.trimEnd()} ` : ''
        recognitionRef.current.lang = getSpeechLanguage(language)
        recognitionRef.current.start()
        setIsRecording(false)
      } catch {
        setIsRecording(false)
        toast.error('Voice input is already active or unavailable. Please try again.')
      }
    }
  }, [input, language, isSpeechSupported])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }, [])

  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'hi' ? 'hi-IN' : 
                       language === 'pa' ? 'pa-IN' :
                       language === 'bn' ? 'bn-IN' :
                       language === 'ta' ? 'ta-IN' : 'en-US'
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } else {
      toast.error('Speech synthesis not supported')
    }
  }, [language])

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Please select a JPEG, PNG, or WebP image')
        return
      }
      // Base64 expands the payload. This also remains within Gemini's 4MB
      // inline-image limit after encoding.
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Image size must be less than 3MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        setImagePreview(reader.result)
      }
      reader.onerror = () => {
        toast.error('Failed to read image file')
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const removeImage = useCallback(() => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const createNewChat = useCallback(() => {
    setChatId(null)
    setMessages([])
    setSelectedImage(null)
    setImagePreview(null)
    setInput('')
    setIsWelcomeScreen(true)
    setLastFailedMessage(null)
    setLastFailedImage(null)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [])

  const loadChat = useCallback(async (chatId) => {
    try {
      const response = await aiAPI.getChatById(chatId)
      if (response.success) {
        setChatId(chatId)
        setMessages(response.chat.messages)
        setLanguage(response.chat.language)
        setIsWelcomeScreen(false)
        if (window.innerWidth < 768) {
          setSidebarOpen(false)
        }
      }
    } catch {
      toast.error('Failed to load chat')
    }
  }, [])

  useEffect(() => {
    const requestedChatId = searchParams.get('chatId')
    if (requestedChatId) {
      loadChat(requestedChatId)
    }
  }, [loadChat, searchParams])

  const deleteChat = useCallback(async (id, e) => {
    e.stopPropagation()
    try {
      await aiAPI.deleteChat(id)
      if (id === chatId) {
        createNewChat()
      }
      loadChatHistory()
      toast.success('Chat deleted')
    } catch {
      toast.error('Failed to delete chat')
    }
  }, [chatId, createNewChat])

  const renameChat = useCallback(async (id, newTitle) => {
    try {
      await aiAPI.updateChatTitle(id, newTitle)
      loadChatHistory()
      toast.success('Chat renamed')
    } catch {
      toast.error('Failed to rename chat')
    }
  }, [])

  const handleSend = useCallback(async (e, retryMessage = null, retryImage = null) => {
    e?.preventDefault()
    
    const messageToSend = retryMessage || input
    const imageToSend = retryImage || selectedImage
    
    if ((!messageToSend.trim() && !imageToSend) || loading) return

    if (!authAPI.isAuthenticated()) {
      toast.error('Please login to use AI advisory')
      return
    }

    const userMessage = {
      role: 'user',
      content: messageToSend,
      image: imageToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    
    // Only clear input if not retrying
    if (!retryMessage) {
      setInput('')
      setSelectedImage(null)
      setImagePreview(null)
    }
    
    setIsWelcomeScreen(false)
    setLoading(true)
    setLastFailedMessage(null)
    setLastFailedImage(null)

    try {
      const response = await aiAPI.sendMessage({
        message: userMessage.content,
        chatId,
        image: userMessage.image,
        language
      })

      if (response.success) {
        setChatId(response.chatId)
        const assistantMessage = {
          role: 'assistant',
          content: response.message.content,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        loadChatHistory()
      }
    } catch (error) {
      let errorMessage = 'Failed to get AI response'
      
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.'
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.'
      } else if (error.message) {
        // Use the error message from backend if it's user-friendly
        errorMessage = error.message
      }
      
      // Preserve failed message for retry
      setLastFailedMessage(messageToSend)
      setLastFailedImage(imageToSend)
      
      // Restore input if not retrying
      if (!retryMessage) {
        setInput(messageToSend)
        setSelectedImage(imageToSend)
        setImagePreview(imageToSend)
      }
      
      toast.error(errorMessage);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
          isError: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }, [input, selectedImage, loading, chatId, language])

  const handleRetry = useCallback((e) => {
    if (lastFailedMessage || lastFailedImage) {
      handleSend(e, lastFailedMessage, lastFailedImage)
    }
  }, [lastFailedMessage, lastFailedImage, handleSend])

  const handlePromptClick = useCallback((prompt) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }, [])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex h-screen bg-slate-50 transition-colors duration-300 dark:bg-zinc-950">
      <Navbar />
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-20 z-40 h-[calc(100vh-80px)] w-[280px] border-r border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 md:relative md:top-0 md:h-screen"
          >
            <div className="flex h-full flex-col">
              {/* Search */}
              <div className="px-4 pb-4 pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-agri-500 focus:outline-none focus:ring-2 focus:ring-agri-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-agri-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto px-3 pb-4">
                {chatHistory.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-slate-400 dark:text-slate-500">
                    No chats yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupedChats.today.length > 0 && (
                      <div>
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Today
                        </p>
                        {groupedChats.today.map((chat) => (
                          <ChatItem
                            key={chat._id}
                            chat={chat}
                            isActive={chatId === chat._id}
                            onClick={() => loadChat(chat._id)}
                            onDelete={(e) => deleteChat(chat._id, e)}
                            onRename={renameChat}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.yesterday.length > 0 && (
                      <div>
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Yesterday
                        </p>
                        {groupedChats.yesterday.map((chat) => (
                          <ChatItem
                            key={chat._id}
                            chat={chat}
                            isActive={chatId === chat._id}
                            onClick={() => loadChat(chat._id)}
                            onDelete={(e) => deleteChat(chat._id, e)}
                            onRename={renameChat}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.previous7Days.length > 0 && (
                      <div>
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Previous 7 Days
                        </p>
                        {groupedChats.previous7Days.map((chat) => (
                          <ChatItem
                            key={chat._id}
                            chat={chat}
                            isActive={chatId === chat._id}
                            onClick={() => loadChat(chat._id)}
                            onDelete={(e) => deleteChat(chat._id, e)}
                            onRename={renameChat}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.older.length > 0 && (
                      <div>
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Older
                        </p>
                        {groupedChats.older.map((chat) => (
                          <ChatItem
                            key={chat._id}
                            chat={chat}
                            isActive={chatId === chat._id}
                            onClick={() => loadChat(chat._id)}
                            onDelete={(e) => deleteChat(chat._id, e)}
                            onRename={renameChat}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className="border-t border-slate-200 p-4 dark:border-zinc-700">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* New Chat Button */}
              <div className="p-4">
                <Button
                  onClick={createNewChat}
                  className="w-full gap-2 rounded-xl border-2 border-agri-200 bg-gradient-to-r from-agri-50 to-white px-4 py-3 text-sm font-semibold text-agri-700 shadow-sm hover:border-agri-400 hover:shadow-md dark:border-agri-700 dark:from-agri-900/20 dark:to-zinc-800 dark:text-agri-300 dark:hover:border-agri-500"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col pt-16 md:pt-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 sm:px-4 md:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 md:hidden"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
          </button>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-agri-500 to-agri-700 text-white shadow-lg shadow-agri-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              AGRI ASSIST AI
            </p>
            <p className="text-xs text-agri-600 truncate">Agricultural Expert Assistant</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 md:px-6">
          <div className="mx-auto max-w-[760px]">
            {isWelcomeScreen && messages.length === 0 ? (
              <WelcomeScreen onPromptClick={handlePromptClick} />
            ) : (
              <>
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-agri-100 text-agri-700 dark:bg-agri-900/50 dark:text-agri-300'
                            : 'bg-gradient-to-br from-agri-500 to-agri-700 text-white shadow-lg shadow-agri-500/20'
                        }`}
                      >
                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      
                      <div className={`flex max-w-[85%] flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-agri-600 text-white shadow-md'
                              : 'bg-white text-slate-800 shadow-sm dark:bg-zinc-800 dark:text-slate-200'
                          }`}
                        >
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="Uploaded"
                              className="mb-2 max-h-48 w-full rounded-lg object-cover"
                            />
                          )}
                          {msg.role === 'assistant' ? (
                            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-slate-900 prose-p:text-slate-700 dark:prose-headings:text-white dark:prose-p:text-slate-300">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                              {msg.isError && lastFailedMessage && (
                                <button
                                  onClick={handleRetry}
                                  className="mt-3 flex items-center gap-2 rounded-lg bg-agri-50 px-3 py-2 text-sm font-medium text-agri-700 hover:bg-agri-100 dark:bg-agri-900/30 dark:text-agri-300 dark:hover:bg-agri-900/50 transition-colors"
                                >
                                  <Bot className="h-4 w-4" />
                                  Retry
                                </button>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          )}
                        </div>
                        
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {formatTimestamp(msg.timestamp)}
                          </span>
                          {msg.role === 'assistant' && !msg.isError && (
                            <button
                              onClick={() => speakText(msg.content)}
                              className="text-slate-400 hover:text-agri-600 dark:hover:text-agri-400 transition-colors"
                            >
                              <Volume2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-agri-500 to-agri-700 text-white shadow-lg shadow-agri-500/20">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                          className="h-2 w-2 rounded-full bg-agri-600"
                        />
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-agri-600"
                        />
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                          className="h-2 w-2 rounded-full bg-agri-600"
                        />
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Thinking...
                      </span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900 shrink-0 sm:p-4">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 rounded-lg object-cover shadow-md sm:h-28 sm:w-28"
              />
              <button
                onClick={removeImage}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 shadow-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="mx-auto max-w-[760px]">
            <div className="relative flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-agri-400 focus-within:ring-2 focus-within:ring-agri-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-agri-600 dark:focus-within:ring-agri-900/50">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-700 dark:hover:text-slate-300 transition-colors shrink-0"
                title="Upload image"
              >
                <ImageIcon className="h-5 w-5 sm:h-5 sm:w-5" />
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(e)
                  }
                }}
                placeholder="Type your message here..."
                rows={1}
                className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none dark:text-white sm:px-3 sm:text-base"
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />

              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isSpeechSupported && !isRecording}
                aria-label={isRecording ? 'Stop voice input' : 'Start voice input'}
                aria-pressed={isRecording}
                className={`rounded-xl p-2 transition-colors shrink-0 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isRecording
                    ? 'animate-pulse bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-700 dark:hover:text-slate-300'
                }`}
                title={isSpeechSupported ? (isRecording ? 'Stop recording' : 'Voice input') : 'Voice input is not supported in this browser'}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              <Button
                type="submit"
                disabled={loading || (!input.trim() && !selectedImage)}
                className="rounded-xl px-3 py-2 sm:px-4 shrink-0"
              >
                {loading ? (
                  <Loader className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Chat Item Component
const ChatItem = React.memo(({ chat, isActive, onClick, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(chat.title || 'New Chat')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleRename = async (e) => {
    e.stopPropagation()
    if (editTitle.trim() && editTitle !== chat.title) {
      await onRename(chat._id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename(e)
    } else if (e.key === 'Escape') {
      setEditTitle(chat.title || 'New Chat')
      setIsEditing(false)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => !isEditing && onClick()}
      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
        isActive
          ? 'bg-agri-50 text-agri-700 shadow-sm dark:bg-agri-900/30 dark:text-agri-300'
          : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
      }`}
    >
      <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? 'text-agri-600' : 'text-slate-400'}`} />
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm font-medium focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="truncate text-sm font-medium">{chat.title || 'New Chat'}</p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
          className="rounded-lg p-1.5 transition-all hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-zinc-700 dark:hover:text-slate-300"
          title="Rename"
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(e)
          }}
          className="rounded-lg p-1.5 transition-all hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  )
})

ChatItem.displayName = 'ChatItem'

// Welcome Screen Component
const WelcomeScreen = React.memo(({ onPromptClick }) => {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white shadow-xl shadow-agri-500/30">
          <Bot className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          Welcome to AGRI ASSIST AI
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Your intelligent agricultural assistant. Ask me anything about farming!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Suggested Questions
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <motion.button
              key={prompt.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              onClick={() => onPromptClick(prompt.prompt)}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left text-sm transition-all hover:border-agri-300 hover:bg-agri-50 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-agri-600 dark:hover:bg-zinc-700"
            >
              <prompt.icon className="h-4 w-4 text-agri-600" />
              <span className="font-medium">{prompt.text}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
})

WelcomeScreen.displayName = 'WelcomeScreen'

export default AIChat
