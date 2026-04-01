'use client'

import { useState, useCallback } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

interface ExportImportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport?: () => void
  onImport?: (file: File) => void
  projectName?: string
}

export type ExportFormat = 'json' | 'mp4' | 'mov' | 'webm'

export interface ExportOptions {
  format: ExportFormat
  quality: 'low' | 'medium' | 'high' | 'ultra'
  resolution: '720p' | '1080p' | '1440p' | '2160p'
  includeWatermark: boolean
  exportAudio: boolean
}

const DEFAULT_OPTIONS: ExportOptions = {
  format: 'mp4',
  quality: 'high',
  resolution: '1080p',
  includeWatermark: false,
  exportAudio: true
}

export default function ExportImportModal({
  isOpen,
  onClose,
  onExport,
  onImport,
  projectName = 'My Project'
}: ExportImportModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [options, setOptions] = useState<ExportOptions>(DEFAULT_OPTIONS)
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
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
      onImport?.(files[0])
      onClose()
    }
  }, [onImport, onClose])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onImport?.(files[0])
      onClose()
    }
  }, [onImport, onClose])

  const handleExport = useCallback(() => {
    setIsExporting(true)
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          onExport?.()
          return 100
        }
        return prev + 5
      })
    }, 100)
  }, [onExport])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full mx-4 border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === 'export' ? 'Export Project' : 'Import Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 bg-slate-800 rounded-lg p-1 mb-6">
          {[
            { id: 'export' as const, icon: '📤', label: 'Export' },
            { id: 'import' as const, icon: '📥', label: 'Import' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2",
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'export' ? (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎬</span>
                <div>
                  <h3 className="text-white font-medium">{projectName}</h3>
                  <p className="text-xs text-slate-500">Ready to export</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Format</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'mp4' as const, icon: '🎥', label: 'MP4' },
                    { id: 'mov' as const, icon: '🎬', label: 'MOV' },
                    { id: 'webm' as const, icon: '🎞️', label: 'WebM' },
                    { id: 'json' as const, icon: '📄', label: 'JSON' }
                  ].map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setOptions(prev => ({ ...prev, format: format.id }))}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-center",
                        options.format === format.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      )}
                    >
                      <span className="text-2xl block mb-1">{format.icon}</span>
                      <span className="text-xs text-white font-medium">{format.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-medium">Quality</label>
                  <select
                    value={options.quality}
                    onChange={(e) => setOptions(prev => ({ ...prev, quality: e.target.value as any }))}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-medium">Resolution</label>
                  <select
                    value={options.resolution}
                    onChange={(e) => setOptions(prev => ({ ...prev, resolution: e.target.value as any }))}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="720p">720p (HD)</option>
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="1440p">1440p (2K)</option>
                    <option value="2160p">2160p (4K)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeWatermark}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeWatermark: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-300">Include watermark</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.exportAudio}
                    onChange={(e) => setOptions(prev => ({ ...prev, exportAudio: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-300">Export audio</span>
                </label>
              </div>
            </div>

            {isExporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Exporting...</span>
                  <span className="text-white font-mono">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>📤</span>
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center transition-all",
                dragOver
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
              )}
            >
              <div className="text-6xl mb-4">📁</div>
              <p className="text-slate-300 mb-2">Drag and drop project file here</p>
              <p className="text-slate-500 text-sm mb-4">or</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json,.action"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <span className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors font-medium inline-block">
                  Browse Files
                </span>
              </label>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 font-medium mb-2">Supported formats:</p>
              <p className="text-xs text-slate-500">
                .json - Project file (JSON format)<br/>
                .action - Action project file
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
