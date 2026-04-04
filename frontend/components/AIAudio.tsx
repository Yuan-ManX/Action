'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { cn, generateId } from '@/lib'
import { ChatMessage } from '@/types'
import AudioWorkstation from './AudioWorkstation'

interface AIAudioProps {
  onApplySuggestion?: (suggestion: any) => void
  onGenerateScript?: (prompt: string) => void
}

const QUICK_SUGGESTIONS = [
  { label: '🎵 Generate music', prompt: 'Generate an upbeat background music track' },
  { label: '🎤 Clean audio', prompt: 'Remove background noise from my recording' },
  { label: '🔊 Mix tracks', prompt: 'Mix and balance my multi-track project' },
  { label: '⏱️ Edit timing', prompt: 'Fix the timing issues in my audio clip' },
  { label: '🎚️ Add effects', prompt: 'Add reverb and compression to my vocals' },
  { label: '📝 Transcribe', prompt: 'Transcribe this audio to text' }
]

interface AudioTrack {
  id: number
  name: string
  color: string
  type: 'audio' | 'vocal' | 'effect' | 'midi'
  muted: boolean
  solo: boolean
  volume: number
  pan: number
  clips: AudioClip[]
}

interface AudioClip {
  id: number
  start: number
  duration: number
  name: string
  color: string
  selected: boolean
}

const INITIAL_TRACKS: AudioTrack[] = [
  {
    id: 1,
    name: 'Vocals',
    color: '#fbbd41',
    type: 'vocal',
    muted: false,
    solo: false,
    volume: 80,
    pan: 0,
    clips: [
      { id: 1, start: 0.5, duration: 8.2, name: 'Main Vocals', color: '#fbbd41', selected: false },
      { id: 2, start: 10, duration: 6.5, name: 'Chorus', color: '#fbbd41', selected: false }
    ]
  },
  {
    id: 2,
    name: 'Drums',
    color: '#3bd3fd',
    type: 'audio',
    muted: false,
    solo: false,
    volume: 75,
    pan: 0,
    clips: [
      { id: 3, start: 0, duration: 18, name: 'Drum Loop', color: '#3bd3fd', selected: false }
    ]
  },
  {
    id: 3,
    name: 'Bass',
    color: '#c1b0ff',
    type: 'audio',
    muted: false,
    solo: false,
    volume: 70,
    pan: -10,
    clips: [
      { id: 4, start: 0.2, duration: 16, name: 'Bass Line', color: '#c1b0ff', selected: false }
    ]
  },
  {
    id: 4,
    name: 'Synth',
    color: '#7ed957',
    type: 'midi',
    muted: false,
    solo: false,
    volume: 65,
    pan: 15,
    clips: [
      { id: 5, start: 2, duration: 12, name: 'Synth Pad', color: '#7ed957', selected: false },
      { id: 6, start: 14, duration: 4, name: 'Synth Lead', color: '#7ed957', selected: false }
    ]
  },
  {
    id: 5,
    name: 'FX - Reverb',
    color: '#fc7981',
    type: 'effect',
    muted: true,
    solo: false,
    volume: 40,
    pan: 0,
    clips: []
  }
]

const TIMELINE_ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.5, 2]

export default function AIAudio({ onApplySuggestion, onGenerateScript }: AIAudioProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: "Hi! I'm your AI Audio Assistant. I can help you generate music, edit recordings, mix tracks, and apply professional effects. What would you like to work on?",
      timestamp: new Date().toISOString()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [tracks, setTracks] = useState<AudioTrack[]>(INITIAL_TRACKS)
  const [selectedClip, setSelectedClip] = useState<number | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [playheadPosition, setPlayheadPosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Resizable Panel
  const [chatWidth, setChatWidth] = useState(380)
  const [isResizing, setIsResizing] = useState(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: "I've processed your request and updated the timeline. You can see the changes reflected in the audio editor. Would you like me to make any adjustments or add more effects?",
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleQuickSuggestion = (suggestion: typeof QUICK_SUGGESTIONS[0]) => {
    setInputValue(suggestion.prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Resizable Panel Handler
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)

    const startX = e.clientX
    const startWidth = chatWidth

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const newWidth = Math.max(300, Math.min(600, startWidth + deltaX))
      setChatWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const toggleMute = (trackId: number) => {
    setTracks(tracks.map(t =>
      t.id === trackId ? { ...t, muted: !t.muted } : t
    ))
  }

  const toggleSolo = (trackId: number) => {
    setTracks(tracks.map(t =>
      t.id === trackId ? { ...t, solo: !t.solo } : t
    ))
  }

  const selectClip = (clipId: number) => {
    setSelectedClip(selectedClip === clipId ? null : clipId)
    setTracks(tracks.map(track => ({
      ...track,
      clips: track.clips.map(clip => ({
        ...clip,
        selected: clip.id === clipId ? !clip.selected : (selectedClip === null ? false : clip.selected)
      }))
    })))
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full flex bg-warm-cream">
      {/* LEFT PANEL - AI Chat Agent */}
      <div
        className="flex flex-col border-r border-oat-border bg-pure-white"
        style={{ width: chatWidth, minWidth: 300, maxWidth: 600 }}
      >
        {/* Header */}
        <div className="p-5 border-b border-oat-border bg-gradient-to-r from-slushie-500/10 via-ube-400/10 to-transparent">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotateZ: -8, scale: 1.05 }}
              className="w-12 h-12 bg-gradient-to-br from-slushie-500 to-ube-600 rounded-feature flex items-center justify-center shadow-clay relative overflow-hidden"
            >
              <span className="text-2xl relative z-10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12h2l3-9 4 18 4-12 3 6h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <motion.div
                initial={{ x: '-100%', opacity: 0.5 }}
                whileHover={{ x: '200%', opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              ></motion.div>
            </motion.div>
            <div>
              <h3 className="text-sub-heading text-clay-black font-roobert font-semibold">AI Audio</h3>
              <p className="text-caption text-warm-silver">Intelligent audio production</p>
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="p-4 border-b border-oat-border">
          <p className="text-xs text-warm-silver font-semibold mb-3 uppercase tracking-wide">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: '#faf9f7',
                  boxShadow: 'rgba(59,211,253,0.15) 0px 4px 12px'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="px-3 py-2 bg-oat-light text-dark-charcoal text-xs rounded-card font-medium hover:bg-slushie-400/20 hover:text-slushie-700 transition-all clay-focus border border-oat-border"
              >
                {suggestion.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    message.role === 'user'
                      ? "bg-gradient-to-r from-slushie-500 to-ube-500 text-clay-black rounded-tr-none font-medium shadow-clay"
                      : "bg-oat-light text-dark-charcoal rounded-tl-none border border-oat-border"
                  )}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-start"
              >
                <div className="bg-oat-light px-4 py-3 rounded-2xl rounded-tl-none border border-oat-border">
                  <div className="flex gap-1.5">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-2 h-2 bg-slushie-500 rounded-full"
                    ></motion.div>
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                      className="w-2 h-2 bg-ube-500 rounded-full"
                    ></motion.div>
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                      className="w-2 h-2 bg-slushie-500 rounded-full"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-oat-border bg-pure-white">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you want to do with your audio..."
                className="w-full px-4 py-3 pr-12 bg-oat-light border-2 border-oat-border rounded-card text-body-standard text-dark-charcoal placeholder:text-warm-silver focus:outline-none focus:border-slushie-500 focus:bg-pure-white transition-all clay-focus shadow-clay"
                disabled={isTyping}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.08, rotateZ: -8 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="w-12 h-12 bg-gradient-to-r from-slushie-500 to-ube-500 text-clay-black rounded-card font-bold text-lg shadow-hard hover:shadow-lg transition-all clay-focus disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden"
            >
              <span className="relative z-10">↑</span>
              <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              ></motion.div>
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-warm-silver">Press Enter to send • Shift+Enter for new line</p>
            <div className="flex gap-2">
              <button className="p-1.5 text-warm-silver hover:text-dark-charcoal rounded transition-colors">📎</button>
              <button className="p-1.5 text-warm-silver hover:text-dark-charcoal rounded transition-colors">🎙️</button>
            </div>
          </div>
        </div>
      </div>

      {/* Resizable Divider */}
      <div
        onMouseDown={handleResizeMouseDown}
        className={`w-2 bg-gradient-to-r from-ube-400 to-slashie-500 hover:from-ube-500 hover:to-lemon-500 cursor-col-resize transition-all duration-200 flex-shrink-0 relative group ${isResizing ? 'from-red-500 to-pink-500 scale-x-110' : 'hover:scale-x-105'}`}
        style={{ zIndex: 50, height: '100%' }}
      >
        <div className="absolute inset-y-0 -left-2 -right-2 bg-transparent"></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 rounded-full transition-all duration-200 ${isResizing ? 'bg-white shadow-lg shadow-white/50 scale-125' : 'bg-white/70 group-hover:bg-white group-hover:shadow-md scale-110'}`}></div>
        {isResizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none"
          >
            {Math.round(chatWidth)}px
          </motion.div>
        )}
      </div>

      {/* RIGHT PANEL - Professional DAW Workstation (TuneFlow + Audacity + Tracktion Engine) */}
      <div className="flex-1 flex flex-col bg-[#1a1a2e]">
        <AudioWorkstation onAudioGenerated={(data) => {
          console.log('Audio generated:', data)
        }} />
      </div>
    </div>
  )
}
