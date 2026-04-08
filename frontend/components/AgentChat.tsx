'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { Send, ImagePlus, Sparkles, Loader2, X, CheckCircle } from 'lucide-react'

// Types
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  toolCall?: ToolCall
  toolResult?: any
}

interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
  status: 'pending' | 'running' | 'completed' | 'error'
}

interface AgentChatProps {
  sessionId?: string
  canvasId?: string
  onToolCall?: (toolCall: ToolCall) => void
  onCanvasUpdate?: (data: any) => void
  className?: string
  placeholder?: string
}

export default function AgentChat({
  sessionId: initialSessionId,
  canvasId,
  onToolCall,
  onCanvasUpdate,
  className = '',
  placeholder
}: AgentChatProps) {
  const { t } = useLanguage()
  
  // State
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(initialSessionId || `session-${Date.now()}`)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize session
  useEffect(() => {
    initializeSession()
  }, [sessionId])

  const initializeSession = async () => {
    try {
      const response = await fetch(`/api/v1/agent/session/${sessionId}`)
      if (!response.ok) {
        // Create new session if not exists
        await fetch('/api/v1/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'chat',
            sessionId,
            message: { role: 'system', content: 'Session initialized' },
            canvasId
          })
        })
      }
    } catch (error) {
      console.error('Failed to initialize session:', error)
    }
  }

  // Send message to agent
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call backend Agent API
      const response = await fetch('/api/v1/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
          canvasId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      // Process assistant response
      const assistantMessage: Message = {
        id: `msg-assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response?.content || data.response || 'Response received',
        timestamp: new Date(),
        toolCall: data.response?.tool_calls?.[0]
      }

      setMessages(prev => [...prev, assistantMessage])

      // Handle tool calls
      if (data.response?.tool_calls?.[0]) {
        const toolCall: ToolCall = {
          id: data.response.tool_calls[0].id,
          name: data.response.tool_calls[0].function?.name,
          arguments: JSON.parse(data.response.tool_calls[0].function?.arguments || '{}'),
          status: 'pending'
        }

        // Update message with tool call info
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, toolCall: { ...toolCall, status: 'running' } }
            : msg
        ))

        // Notify parent component
        if (onToolCall) {
          onToolCall(toolCall)
        }

        // Simulate tool execution completion (in real app, this would be from WebSocket)
        setTimeout(() => {
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessage.id && msg.toolCall
              ? { ...msg, toolCall: { ...msg.toolCall, status: 'completed' } }
              : msg
          ))
        }, 2000)
      }

    } catch (error) {
      console.error('Send message error:', error)
      
      const errorMessage: Message = {
        id: `msg-error-${Date.now()}`,
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, canvasId, isLoading, onToolCall])

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Quick action buttons
  const quickActions = [
    { icon: '🎨', label: t('canva.generateIllustrations'), prompt: 'Generate an illustration of...' },
    { icon: '🎬', label: t('canva.createStoryboards'), prompt: 'Create a storyboard for a video about...' },
    { icon: '👤', label: t('canva.designCharacters'), prompt: 'Design a character for...' },
    { icon: '✨', label: t('canva.addVisualEffects'), prompt: 'Add visual effects to the image...' }
  ]

  return (
    <div className={`flex flex-col h-full bg-pure-white rounded-2xl border border-oat-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-lemon-500/10 via-slushie-500/10 to-ube-500/10 border-b border-oat-border">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotateZ: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-9 h-9 bg-gradient-to-br from-lemon-400 to-slushie-500 rounded-full flex items-center justify-center shadow-md"
          >
            <span className="text-lg">🤖</span>
          </motion.div>
          <div>
            <h3 className="text-sub-heading text-clay-black font-semibold">
              {t('canva.title')}
            </h3>
            <p className="text-xs text-warm-silver">
              {t('canva.subtitle')}
            </p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-matcha-500 animate-pulse' : 'bg-matcha-600'}`}></span>
          <span className="text-xs text-warm-silver font-medium">
            {isLoading ? t('loading') : 'Online'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4" ref={messagesEndRef}>
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-lemon-100 to-slushie-100 rounded-full flex items-center justify-center"
            >
              <span className="text-5xl">💬</span>
            </motion.div>

            <div>
              <h3 className="text-xl font-bold text-clay-black mb-3 font-roobert">
                {t('canva.welcomeTitle')}
              </h3>
              <p className="text-sm text-warm-silver max-w-sm mx-auto leading-relaxed">
                {t('canva.welcomeMessage')}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
              {quickActions.map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(action.prompt)}
                  className="p-3 bg-oat-light hover:bg-lemon-50 border border-oat-border hover:border-lemon-300 rounded-xl text-left transition-all group"
                >
                  <span className="text-xl mb-1 block">{action.icon}</span>
                  <span className="text-xs font-medium text-dark-charcoal group-hover:text-lemon-600 transition-colors line-clamp-2">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-lemon-400 to-slushie-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="bg-oat-light rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lemon-500 animate-spin" />
                <span className="text-sm text-dark-charcoal font-medium">
                  {t('loading')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-oat-border p-4 bg-oat-light/30">
        <div className="flex gap-3 items-end">
          {/* Attachment Button */}
          <button
            type="button"
            className="p-2.5 bg-pure-white border border-oat-border rounded-xl hover:border-lemon-300 hover:bg-lemon-50 transition-all"
            title={t('media.upload')}
          >
            <ImagePlus className="w-5 h-5 text-warm-silver" />
          </button>

          {/* Text Input */}
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t('chat.placeholder')}
            rows={1}
            className="flex-1 px-4 py-3 bg-pure-white border border-oat-border rounded-xl focus:border-lemon-400 focus:outline-none focus:ring-2 focus:ring-lemon-100 resize-none text-body-standard"
          />

          {/* Send Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!inputValue.trim() || isLoading}
            className="px-5 py-3 bg-gradient-to-r from-lemon-500 to-slushie-500 text-clay-black rounded-xl font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Helper Text */}
        <p className="mt-2 text-[10px] text-warm-silver text-center">
          Press Enter to send • Shift+Enter for new line • AI may use tools to help you create
        </p>
      </form>
    </div>
  )
}


/* Sub-components */

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-9 h-9 bg-gradient-to-br from-lemon-400 to-slushie-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-base">🤖</span>
        </div>
      )}

      {/* Content Bubble */}
      <div
        className={`
          max-w-[85%] rounded-2xl px-4 py-3
          ${isUser
            ? 'bg-slushie-500 text-clay-black rounded-tr-none'
            : 'bg-oat-light text-dark-charcoal rounded-tl-none'
          }
          ${message.toolCall ? 'space-y-3' : ''}
        `}
      >
        {/* Text Content */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Tool Call Display */}
        {message.toolCall && (
          <ToolCallDisplay toolCall={message.toolCall} />
        )}

        {/* Timestamp */}
        <div className={`text-[10px] mt-2 ${isUser ? 'text-right' : 'text-left'} opacity-60`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
}


function ToolCallDisplay({ toolCall }: { toolCall: ToolCall }) {
  const statusColors = {
    pending: 'bg-warm-silver text-clay-black',
    running: 'bg-lemon-100 text-lemon-700 border-lemon-300',
    completed: 'bg-matcha-100 text-matcha-700 border-matcha-300',
    error: 'bg-pomegranate-100 text-pomegranate-700 border-pomegranate-300'
  }

  const statusIcons = {
    pending: '⏳',
    running: <Loader2 className="w-4 h-4 animate-spin" />,
    completed: <CheckCircle className="w-4 h-4" />,
    error: '✕'
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${statusColors[toolCall.status]}`}>
      <span>{statusIcons[toolCall.status]}</span>
      <span>⚡ {toolCall.name}</span>
      {toolCall.status === 'running' && <span className="animate-pulse">Processing...</span>}
      {toolCall.status === 'completed' && <span>Completed</span>}
    </div>
  )
}
