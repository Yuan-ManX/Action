'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  preview?: string
}

const ACCEPTED_TYPES = {
  'text/plain': ['.txt'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-excel': ['.xls', '.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/markdown': ['.md', '.markdown'],
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp'],
  'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm'],
  'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.flac'],
  'application/pdf': ['.pdf'],
  'text/x-python': ['.py'],
  'text/javascript': ['.js', '.jsx', '.ts', '.tsx'],
  'text/html': ['.html', '.htm'],
  'text/css': ['.css'],
  'application/json': ['.json'],
  'text/xml': ['.xml'],
  'text/csv': ['.csv']
}

const MODULES = [
  { id: 'studio', label: 'AI Studio', icon: '🎬', desc: 'Video creation' },
  { id: 'canva', label: 'AI Canva', icon: '🎨', desc: 'Design canvas' },
  { id: 'audio', label: 'AI Audio', icon: '🎵', desc: 'Audio editing' },
  { id: 'scripts', label: 'Scripts', icon: '📝', desc: 'Script writing' },
]

interface FileUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void
  onModuleLink?: (module: string) => void
  onContextReference?: () => void
  onVoiceInput?: (isRecording: boolean) => void
  showModelSelector?: boolean
  selectedModel?: string
  onModelChange?: (model: string) => void
  inputValue?: string
  onInputChange?: (value: string) => void
  onSendMessage?: () => void
  isTyping?: boolean
  placeholder?: string
  sendButtonColor?: string
}

export default function FileUpload({
  onFilesChange,
  onModuleLink,
  onContextReference,
  onVoiceInput,
  showModelSelector = false,
  selectedModel = 'Action-Agent',
  onModelChange,
  inputValue = '',
  onInputChange,
  onSendMessage,
  isTyping = false,
  placeholder = 'Type a message...',
  sendButtonColor = 'from-lemon-500 to-slushie-500'
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [showModuleMenu, setShowModuleMenu] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎬'
    if (type.startsWith('audio/')) return '🎵'
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('powerpoint') || type.includes('presentation')) return '📊'
    if (type.includes('excel') || type.includes('sheet')) return '📈'
    if (type.includes('python')) return '🐍'
    if (type.includes('javascript') || type.includes('typescript')) return '⚡'
    if (type.includes('markdown')) return '📋'
    if (type === 'text/plain' || type.startsWith('text/')) return '📃'
    return '📎'
  }

  const getFileExtension = (name: string) => {
    return name.split('.').pop()?.toUpperCase() || ''
  }

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return

    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    if (onFilesChange) {
      onFilesChange([...uploadedFiles, ...newFiles])
    }
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId)
    setUploadedFiles(updatedFiles)
    if (onFilesChange) onFilesChange(updatedFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && onSendMessage) {
      e.preventDefault()
      onSendMessage()
    }
  }

  const handleVoiceToggle = () => {
    const newState = !isRecording
    setIsRecording(newState)
    if (onVoiceInput) onVoiceInput(newState)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.module-menu') && !target.closest('.context-menu')) {
        setShowModuleMenu(false)
        setShowContextMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const visibleFiles = uploadedFiles.slice(0, 4)
  const hiddenCount = uploadedFiles.length - 4

  return (
    <div className="w-full">
      {/* Main Container - Light Theme (Matches Dashboard System) */}
      <div className={`rounded-xl overflow-hidden border transition-all ${
        isDragOver
          ? 'border-lemon-500 bg-lemon-50'
          : 'border-oat-border bg-pure-white shadow-sm'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      >
        {/* Input Area */}
        <div className="px-4 py-3 min-h-[60px]">
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange?.(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isTyping}
            rows={2}
            className="w-full bg-transparent text-dark-charcoal placeholder:text-warm-silver/60 text-sm resize-none outline-none"
          />
        </div>

        {/* Toolbar - Bottom Row */}
        <div className="flex items-center justify-between px-3 py-2.5 border-t border-oat-border bg-oat-light/30">
          {/* Left Side Tools */}
          <div className="flex items-center gap-0.5">
            {/* @ Module Link */}
            <div className="relative module-menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowModuleMenu(!showModuleMenu)
                  setShowContextMenu(false)
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                  showModuleMenu ? 'bg-lemon-500/20 text-lemon-700' : 'text-warm-silver hover:text-dark-charcoal hover:bg-oat-light'
                }`}
                title="Link to other modules"
              >
                <span className="text-base font-normal">@</span>
              </motion.button>

              <AnimatePresence>
                {showModuleMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 mb-2 w-48 bg-pure-white rounded-xl shadow-hard border border-oat-border py-2 z-50 module-menu"
                  >
                    <p className="px-3 pb-2 mb-2 text-[10px] text-warm-silver uppercase tracking-wide font-semibold border-b border-oat-border">
                      Link to Module
                    </p>
                    {MODULES.map((module) => (
                      <button
                        key={module.id}
                        onClick={() => {
                          if (onModuleLink) onModuleLink(module.id)
                          setShowModuleMenu(false)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-oat-light transition-colors text-left"
                      >
                        <span className="text-lg">{module.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark-charcoal">{module.label}</p>
                          <p className="text-[10px] text-warm-silver">{module.desc}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* # Context Reference */}
            <div className="relative context-menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowContextMenu(!showContextMenu)
                  setShowModuleMenu(false)
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                  showContextMenu ? 'bg-lemon-500/20 text-lemon-700' : 'text-warm-silver hover:text-dark-charcoal hover:bg-oat-light'
                }`}
                title="Reference context"
              >
                <span className="text-base font-normal">#</span>
              </motion.button>

              <AnimatePresence>
                {showContextMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 mb-2 w-56 bg-pure-white rounded-xl shadow-hard border border-oat-border py-2 z-50 context-menu"
                  >
                    <p className="px-3 pb-2 mb-2 text-[10px] text-warm-silver uppercase tracking-wide font-semibold border-b border-oat-border">
                      Reference Context
                    </p>
                    <button
                      onClick={() => {
                        if (onContextReference) onContextReference()
                        setShowContextMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-oat-light transition-colors text-left"
                    >
                      <span className="text-lg">💬</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-charcoal">Chat History</p>
                        <p className="text-[10px] text-warm-silver">Reference previous messages</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        if (onContextReference) onContextReference()
                        setShowContextMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-oat-light transition-colors text-left"
                    >
                      <span className="text-lg">📋</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-charcoal">Current Context</p>
                        <p className="text-[10px] text-warm-silver">Include current conversation</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* File Upload - Paperclip */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                isDragOver
                  ? 'bg-lemon-500/20 text-lemon-600 border border-dashed border-lemon-500'
                  : uploadedFiles.length > 0
                    ? 'bg-matcha-500/20 text-matcha-700'
                    : 'text-warm-silver hover:text-dark-charcoal hover:bg-oat-light'
              }`}
              title="Attach files (all formats supported)"
            >
              <motion.span
                animate={isDragOver ? { rotateZ: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="text-base"
              >
                📎
              </motion.span>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={Object.values(ACCEPTED_TYPES).flat().join(',')}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </motion.button>
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center gap-1.5">
            {/* Model Selector */}
            {showModelSelector && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-oat-light transition-colors cursor-pointer">
                <span className="text-xs text-warm-silver">{selectedModel}</span>
                <span className="text-[10px] text-warm-silver">▼</span>
              </div>
            )}

            {/* Sparkle/Effects Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotateZ: 180 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 flex items-center justify-center rounded-md text-warm-silver hover:text-dark-charcoal hover:bg-oat-light transition-colors"
              title="Enhance with AI"
            >
              <span className="text-sm">✨</span>
            </motion.button>

            {/* Voice Input */}
            {onVoiceInput && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceToggle}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${
                  isRecording
                    ? 'bg-pomegranate-500 text-white animate-pulse'
                    : 'text-warm-silver hover:text-dark-charcoal hover:bg-oat-light'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-sm"
                  >⏹️</motion.span>
                ) : (
                  <span className="text-sm">🎤</span>
                )}
              </motion.button>
            )}

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold text-clay-black shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${sendButtonColor} relative overflow-hidden`}
            >
              <span className="relative z-10 text-base">↑</span>
              <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* File Attachments Preview */}
      <AnimatePresence mode="popLayout">
        {visibleFiles.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-thin pb-1"
          >
            {visibleFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -2 }}
                className="group relative flex-shrink-0 h-7 px-2 bg-oat-light border border-oat-border rounded-md flex items-center gap-1.5 min-w-[80px] max-w-[120px]"
                title={`${file.name} (${formatFileSize(file.size)})`}
              >
                {file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-5 h-5 object-cover rounded" />
                ) : (
                  <span className="text-xs leading-none">{getFileIcon(file.type)}</span>
                )}

                <span className="text-[9px] font-semibold text-dark-charcoal bg-pure-white px-1 py-0.5 rounded leading-none">
                  {getFileExtension(file.name)}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id) }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-pomegranate-500 text-white rounded-full flex items-center justify-center text-[7px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pomegranate-700 shadow-sm z-10"
                >✕</button>
              </motion.div>
            ))}

            {hiddenCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-7 px-2 bg-oat-border text-dark-charcoal rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 cursor-pointer hover:bg-warm-silver/20 transition-colors"
                title={`${hiddenCount} more files attached`}
              >
                +{hiddenCount}
              </motion.div>
            )}

            <button
              onClick={() => { setUploadedFiles([]); if (onFilesChange) onFilesChange([]); }}
              className="h-5 w-5 flex items-center justify-center rounded text-warm-silver/60 hover:text-pomegranate-500 hover:bg-pomegranate-50 transition-colors text-xs flex-shrink-0"
              title="Clear all attachments"
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
