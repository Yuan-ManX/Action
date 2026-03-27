'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m Dreamix, your AI video creation assistant. How can I help you create amazing videos today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you want to: "${input}". Let me help you with that! I can generate scripts, find media, add music, and more. What would you like to do first?`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const quickActions = [
    'Create a video about technology',
    'Generate a script for me',
    'Find some background music',
    'Make a video tutorial'
  ]

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl p-4 rounded-lg shadow-sm ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-purple-200' : 'text-slate-400'}`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className="bg-white p-4 rounded-lg rounded-bl-none border border-slate-200 shadow-sm">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-sm text-slate-500 mb-3">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInput(action)}
                className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what kind of video you want to create..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
