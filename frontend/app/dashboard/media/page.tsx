'use client'

import { useState, useCallback } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

interface MediaItem {
  id: string
  title: string
  type: 'image' | 'video' | 'audio'
  thumbnail: string
  duration?: string
  tags: string[]
  size?: string
  createdAt?: string
}

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (files: File[]) => void
}

function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onUpload(files)
      onClose()
    }
  }, [onUpload, onClose])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onUpload(files)
      onClose()
    }
  }, [onUpload, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Upload Media</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center transition-all",
            dragOver
              ? "border-purple-500 bg-purple-500/10"
              : "border-slate-600 hover:border-slate-500 bg-slate-800/50"
          )}
        >
          <div className="text-6xl mb-4">📁</div>
          <p className="text-slate-300 mb-2">Drag and drop files here</p>
          <p className="text-slate-500 text-sm mb-4">or</p>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={handleFileInput}
            />
            <span className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors font-medium inline-block">
              Browse Files
            </span>
          </label>
        </div>

        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
          <p className="text-sm text-slate-400 font-medium mb-2">Supported formats:</p>
          <p className="text-xs text-slate-500">
            Images: JPG, PNG, GIF, WebP<br/>
            Videos: MP4, WebM, MOV<br/>
            Audio: MP3, WAV, AAC
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([
    {
      id: '1',
      title: 'Sunset Scene',
      type: 'image',
      thumbnail: '🌅',
      tags: ['nature', 'sunset', 'landscape'],
      size: '2.4 MB',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'City Walkthrough',
      type: 'video',
      thumbnail: '🏙️',
      duration: '0:15',
      tags: ['urban', 'city', 'b-roll'],
      size: '45.2 MB',
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Ambient Background',
      type: 'audio',
      thumbnail: '🎵',
      duration: '3:20',
      tags: ['music', 'calm', 'background'],
      size: '4.8 MB',
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      title: 'Product Closeup',
      type: 'image',
      thumbnail: '📷',
      tags: ['product', 'commercial', 'closeup'],
      size: '3.1 MB',
      createdAt: '2024-01-12'
    },
    {
      id: '5',
      title: 'Interview Footage',
      type: 'video',
      thumbnail: '🎤',
      duration: '4:30',
      tags: ['interview', 'talking-head', 'documentary'],
      size: '128.5 MB',
      createdAt: '2024-01-11'
    },
    {
      id: '6',
      title: 'SFX Pack',
      type: 'audio',
      thumbnail: '🔊',
      duration: '0:45',
      tags: ['sfx', 'sound-effects', 'transitions'],
      size: '1.2 MB',
      createdAt: '2024-01-10'
    }
  ])

  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredMedia = media.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesType && matchesSearch
  })

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const handleUpload = useCallback((files: File[]) => {
    const newItems: MediaItem[] = files.map((file, index) => ({
      id: Date.now().toString() + index,
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'audio',
      thumbnail: file.type.startsWith('image/') ? '🖼️' : file.type.startsWith('video/') ? '🎬' : '🎵',
      tags: ['new', 'uploaded'],
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      createdAt: new Date().toISOString().split('T')[0]
    }))
    setMedia(prev => [...newItems, ...prev])
  }, [])

  const deleteSelected = useCallback(() => {
    setMedia(prev => prev.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }, [selectedItems])

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      image: '🖼️',
      video: '🎬',
      audio: '🎵'
    }
    return icons[type] || '📦'
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
            <p className="text-slate-400">Organize and manage your media assets</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedItems.length > 0 && (
              <button
                onClick={deleteSelected}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-medium flex items-center gap-2"
              >
                <span>🗑️</span>
                Delete ({selectedItems.length})
              </button>
            )}
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all font-medium flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <span>+</span>
              Upload
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
              {['all', 'image', 'video', 'audio'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                    filterType === type
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'grid'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                ▦
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'list'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSelectItem(item.id)}
                className={cn(
                  "group relative bg-slate-900 rounded-xl border-2 overflow-hidden cursor-pointer transition-all",
                  selectedItems.includes(item.id)
                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                    : 'border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-black/30'
                )}
              >
                {selectedItems.includes(item.id) && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                      ✓
                    </div>
                  </div>
                )}

                <div className="h-36 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                  <span className="text-5xl">{item.thumbnail || getTypeIcon(item.type)}</span>
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded">
                      <span className="text-xs text-white font-mono">{item.duration}</span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-white text-sm truncate">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{item.type}</span>
                    {item.size && (
                      <span className="text-xs text-slate-600">{item.size}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 text-xs bg-slate-800 text-slate-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="px-1.5 py-0.5 text-xs bg-slate-800 text-slate-500 rounded">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors">
                      ➕
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors">
                      👁️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSelectItem(item.id)}
                className={cn(
                  "group flex items-center gap-4 p-4 bg-slate-900 rounded-xl border-2 cursor-pointer transition-all",
                  selectedItems.includes(item.id)
                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                )}
              >
                {selectedItems.includes(item.id) && (
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                    ✓
                  </div>
                )}
                {!selectedItems.includes(item.id) && (
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{item.thumbnail || getTypeIcon(item.type)}</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{item.type}</span>
                    {item.duration && <span className="text-xs text-slate-500">{item.duration}</span>}
                    {item.size && <span className="text-xs text-slate-500">{item.size}</span>}
                    {item.createdAt && <span className="text-xs text-slate-600">{item.createdAt}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 text-xs bg-slate-800 text-slate-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
                    ➕
                  </button>
                  <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
                    👁️
                  </button>
                  <button className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-slate-400 hover:text-red-400">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredMedia.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No media found</h3>
            <p className="text-slate-600">Try adjusting your filters or upload new media</p>
          </div>
        )}
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  )
}
