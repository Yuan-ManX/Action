'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { cn, generateId } from '@/lib'
import { ChatMessage } from '@/types'

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
    setIsResizing(true)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = moveEvent.clientX
      if (newWidth >= 300 && newWidth <= 600) {
        setChatWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

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
        className={`w-1.5 bg-oat-border hover:bg-ube-500 cursor-col-resize transition-colors flex-shrink-0 relative group ${isResizing ? 'bg-ube-500' : ''}`}
      >
        <div className="absolute inset-y-0 -left-1 -right-1"></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full transition-colors ${isResizing ? 'bg-white' : 'bg-warm-silver group-hover:bg-ube-600'}`}></div>
      </div>

      {/* RIGHT PANEL - DAW Audio Editor */}
      <div className="flex-1 flex flex-col bg-[#1a1a2e]">
        {/* Transport Bar */}
        <div className="h-14 border-b border-[#2a2a3e] bg-[#16162a] flex items-center justify-between px-4">
          {/* Left: Playback Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white rounded transition-colors"
            >⏮</motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all",
                isPlaying 
                  ? "bg-red-500/20 text-red-400" 
                  : "bg-slushie-500/20 text-slushie-400 hover:bg-slushie-500/30"
              )}
            >
              {isPlaying ? '⏸' : '▶'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentTime(Math.min(duration, currentTime + 5))}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white rounded transition-colors"
            >⏭</motion.button>

            <div className="w-px h-6 bg-white/10 mx-2"></div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setCurrentTime(0); setIsPlaying(false); }}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white rounded transition-colors"
            >⏹</motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white rounded transition-colors"
            >🔁</motion.button>
          </div>

          {/* Center: Time Display */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-slashie-400 tabular-nums">{formatTime(currentTime)}</span>
            <span className="text-white/30">/</span>
            <span className="text-sm font-mono text-white/50 tabular-nums">{formatTime(duration)}</span>
            
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden ml-2">
              <motion.div
                className="h-full bg-gradient-to-r from-slushie-500 to-ube-500 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></motion.div>
            </div>
          </div>

          {/* Right: Zoom & Tools */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/5 rounded px-2 py-1">
              <button 
                onClick={() => setZoomLevel(Math.max(0.25, zoomLevel - 0.25))}
                className="text-white/60 hover:text-white text-xs w-5"
              >−</button>
              <span className="text-xs text-white/80 min-w-[3rem] text-center">{Math.round(zoomLevel * 100)}%</span>
              <button 
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
                className="text-white/60 hover:text-white text-xs w-5"
              >+</button>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 text-white/50 hover:text-white rounded transition-colors text-xs">Snap</button>
              <button className="p-1.5 text-white/50 hover:text-white rounded transition-colors text-xs">Grid</button>
            </div>
          </div>
        </div>

        {/* Main Editor Area: Tracks + Timeline */}
        <div className="flex-1 flex overflow-hidden">
          {/* Track List (Left Sidebar) */}
          <div className="w-48 border-r border-[#2a2a3e] bg-[#12121f] flex flex-col">
            {/* Track Headers */}
            <div className="h-8 border-b border-[#2a2a3e] flex items-end px-2 pb-1">
              <div className="w-8"></div>
              <div className="flex-1 text-xs text-white/40 pl-2">Name</div>
              <div className="w-10 text-center text-xs text-white/40">M</div>
              <div className="w-10 text-center text-xs text-white/40">S</div>
            </div>

            {/* Tracks */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {tracks.map((track, idx) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedTrack(selectedTrack === track.id ? null : track.id)}
                  className={cn(
                    "h-12 flex items-center gap-2 px-2 cursor-pointer border-b border-[#1e1e32] transition-all group",
                    selectedTrack === track.id && "bg-white/[0.06]",
                    track.muted && "opacity-50"
                  )}
                >
                  {/* Track Color Indicator */}
                  <div 
                    className="w-2 h-8 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: track.color }}
                  ></div>

                  {/* Track Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/80 truncate font-medium group-hover:text-white transition-colors">
                      {track.name}
                    </p>
                  </div>

                  {/* Mute Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMute(track.id); }}
                    className={cn(
                      "w-8 h-6 rounded flex items-center justify-center text-xs font-bold transition-all",
                      track.muted 
                        ? "bg-white/10 text-white/40" 
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >M</button>

                  {/* Solo Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSolo(track.id); }}
                    className={cn(
                      "w-8 h-6 rounded flex items-center justify-center text-xs font-bold transition-all",
                      track.solo 
                        ? "bg-lemon-500/30 text-lemon-400" 
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >S</button>
                </motion.div>
              ))}

              {/* Add Track Button */}
              <button className="h-10 flex items-center justify-center gap-2 text-white/40 hover:text-slushie-400 text-xs border-b border-dashed border-[#2a2a3e] hover:border-slashie-500/50 transition-all">
                <span>+</span> Add Track
              </button>
            </div>
          </div>

          {/* Timeline / Waveform Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0d1a]">
            {/* Time Ruler */}
            <div className="h-6 border-b border-[#2a2a3e] bg-[#12121f] relative">
              <div 
                className="absolute inset-0 flex"
                style={{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'left center' }}
              >
                {[...Array(Math.ceil(duration / 5) + 1)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[200px] relative h-full">
                    <span className="absolute top-0 left-0 text-[10px] text-white/30 font-mono">{formatTime(i * 5)}</span>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-white/5" style={{ left: `${(j + 1) * 25}%` }}></div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Playhead */}
              <motion.div
                animate={{ x: `${(currentTime / duration) * 100 * zoomLevel}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-lemon-500 z-10 pointer-events-none"
                style={{ left: 0 }}
              >
                <div className="absolute -top-0 left-[-3px] w-0 h-2 bg-lemon-500"></div>
                <div className="absolute -top-1 left-[-5px] w-2.5 h-3 bg-lemon-500 rounded-t-sm"></div>
              </motion.div>
            </div>

            {/* Tracks Timeline */}
            <div className="flex-1 overflow-auto relative">
              <div 
                className="absolute inset-0"
                style={{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'left center' }}
              >
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="h-12 relative border-b border-[#1a1a2e]"
                  >
                    {/* Clips on this track */}
                    {track.clips.map((clip) => (
                      <motion.div
                        key={clip.id}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        onClick={() => selectClip(clip.id)}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "absolute top-1 bottom-1 rounded-md cursor-pointer transition-all",
                          clip.selected 
                            ? "ring-2 ring-white shadow-lg z-10" 
                            : "hover:ring-1 hover:ring-white/30"
                        )}
                        style={{
                          left: `${(clip.start / duration) * 100}%`,
                          width: `${(clip.duration / duration) * 100}%`,
                          backgroundColor: clip.color + (clip.selected ? '' : 'CC'),
                          backgroundImage: `repeating-linear-gradient(
                            90deg,
                            ${clip.color},
                            ${clip.color} 4px,
                            ${clip.color}88 4px,
                            ${clip.color}88 8px
                          )`
                        }}
                      >
                        {/* Clip Label */}
                        <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 flex items-center">
                          <span className="text-[10px] text-white font-medium truncate drop-shadow-md">
                            {clip.name}
                          </span>
                        </div>

                        {/* Waveform visualization pattern */}
                        <div className="absolute inset-0 opacity-30">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute bottom-1/2 w-px bg-current translate-y-1/2"
                              style={{
                                left: `${i * 5}%`,
                                height: `${30 + Math.sin(i * 0.5) * 25}%`,
                                opacity: 0.4 + Math.abs(Math.cos(i * 0.3)) * 0.6
                              }}
                            ></div>
                          ))}
                        </div>

                        {/* Clip handles for resizing */}
                        {clip.selected && (
                          <>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize rounded-l"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize rounded-r"></div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Selection Marquee overlay would go here */}
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="h-8 border-t border-[#2a2a3e] bg-[#12121f] flex items-center justify-between px-4 text-xs text-white/40">
          <div className="flex items-center gap-4">
            <span>Tracks: {tracks.length}</span>
            <span>•</span>
            <span>{tracks.reduce((acc, t) => acc + t.clips.length, 0)} clips</span>
            <span>•</span>
            <span>Sample Rate: 44.1kHz</span>
          </div>
          <div className="flex items-center gap-4">
            <span>BPM: 120</span>
            <span>•</span>
            <span>Key: C Major</span>
            <span>•</span>
            <span>{isPlaying ? '▶ Playing' : '⏸ Stopped'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
