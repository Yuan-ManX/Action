'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useProjectStore } from '@/stores/projectStore'
import { cn, downloadFile, readFile } from '@/lib'
import { VideoProject, ExportSettings } from '@/types'

interface ProjectImportExportProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'import' | 'export' | 'both'
}

const EXPORT_FORMATS = [
  { id: 'json', name: 'JSON Project', extension: '.json', description: 'Complete project file' },
  { id: 'mp4', name: 'MP4 Video', extension: '.mp4', description: 'H.264 video export' },
  { id: 'webm', name: 'WebM Video', extension: '.webm', description: 'WebM video export' },
  { id: 'mov', name: 'QuickTime MOV', extension: '.mov', description: 'Apple QuickTime format' }
]

const QUALITY_LEVELS = [
  { id: 'low', name: 'Low', bitrate: '2 Mbps' },
  { id: 'medium', name: 'Medium', bitrate: '5 Mbps' },
  { id: 'high', name: 'High', bitrate: '10 Mbps' },
  { id: 'ultra', name: 'Ultra', bitrate: '20 Mbps' }
]

const RESOLUTIONS = [
  { id: '720p', name: '720p', width: 1280, height: 720 },
  { id: '1080p', name: '1080p', width: 1920, height: 1080 },
  { id: '1440p', name: '1440p', width: 2560, height: 1440 },
  { id: '2160p', name: '4K', width: 3840, height: 2160 }
]

export default function ProjectImportExport({
  isOpen,
  onClose,
  mode = 'both'
}: ProjectImportExportProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>(mode === 'both' ? 'export' : mode)
  const [selectedFormat, setSelectedFormat] = useState<string>('json')
  const [selectedQuality, setSelectedQuality] = useState<string>('high')
  const [selectedResolution, setSelectedResolution] = useState<string>('1080p')
  const [includeAudio, setIncludeAudio] = useState(true)
  const [includeWatermark, setIncludeWatermark] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { 
    getCurrentProject, 
    projects, 
    setCurrentProject,
    saveProjects 
  } = useProjectStore()

  const currentProject = getCurrentProject()

  if (!isOpen) return null

  const handleExport = async () => {
    if (!currentProject) return
    
    setIsProcessing(true)
    setProgress(0)

    if (selectedFormat === 'json') {
      const content = JSON.stringify(currentProject, null, 2)
      const filename = `${currentProject.name.replace(/\s+/g, '_')}.json`
      
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setProgress(i)
      }
      
      downloadFile(content, filename, 'application/json')
    } else {
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }
    }

    setIsProcessing(false)
    setProgress(0)
    onClose()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      importProject(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      importProject(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const importProject = async (file: File) => {
    setIsProcessing(true)
    setProgress(0)

    try {
      const content = await readFile(file)
      const project = JSON.parse(content) as VideoProject
      
      for (let i = 0; i <= 50; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setProgress(i)
      }

      const importedProject = {
        ...project,
        projectId: project.projectId + '_imported_' + Date.now(),
        name: project.name + ' (Imported)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setCurrentProject(importedProject.projectId)
      
      for (let i = 50; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setProgress(i)
      }

      setTimeout(() => {
        setIsProcessing(false)
        setProgress(0)
        onClose()
      }, 500)
    } catch (error) {
      console.error('Failed to import project:', error)
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {activeTab === 'import' ? 'Import Project' : 'Export Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {mode === 'both' && (
          <div className="flex gap-1 p-2 bg-slate-900/50 mx-6 mt-4 rounded-lg">
            <button
              onClick={() => setActiveTab('export')}
              className={cn(
                "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === 'export'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              📤 Export
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={cn(
                "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === 'import'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              📥 Import
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              {currentProject && (
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <span>🎬</span>
                    {currentProject.name}
                  </h3>
                  <p className="text-slate-400 text-sm">{currentProject.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span>{currentProject.clips.length} clips</span>
                    <span>{currentProject.width}x{currentProject.height}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {EXPORT_FORMATS.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        selectedFormat === format.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                      )}
                    >
                      <div className="text-white font-medium mb-1">{format.name}</div>
                      <div className="text-xs text-slate-400">{format.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedFormat !== 'json' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Quality
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {QUALITY_LEVELS.map((quality) => (
                        <button
                          key={quality.id}
                          onClick={() => setSelectedQuality(quality.id)}
                          className={cn(
                            "p-3 rounded-lg border-2 text-center transition-all",
                            selectedQuality === quality.id
                              ? 'border-purple-500 bg-purple-900/20'
                              : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                          )}
                        >
                          <div className="text-white font-medium text-sm">{quality.name}</div>
                          <div className="text-xs text-slate-400">{quality.bitrate}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Resolution
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {RESOLUTIONS.map((res) => (
                        <button
                          key={res.id}
                          onClick={() => setSelectedResolution(res.id)}
                          className={cn(
                            "p-3 rounded-lg border-2 text-center transition-all",
                            selectedResolution === res.id
                              ? 'border-purple-500 bg-purple-900/20'
                              : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                          )}
                        >
                          <div className="text-white font-medium text-sm">{res.name}</div>
                          <div className="text-xs text-slate-400">{res.width}×{res.height}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeAudio}
                        onChange={(e) => setIncludeAudio(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-slate-300 text-sm">Include Audio</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeWatermark}
                        onChange={(e) => setIncludeWatermark(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-slate-300 text-sm">Add Watermark</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
                  dragOver
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="text-5xl mb-4">📁</div>
                <h3 className="text-white font-medium text-lg mb-2">
                  Drop your project file here
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  or click to browse
                </p>
                <div className="text-xs text-slate-500">
                  Supports .json project files
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <span>ℹ️</span>
                  Import Notes
                </h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>Imported projects will have a new unique ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>The word "(Imported)" will be added to the project name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>Media files paths will be preserved if available</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700">
          {isProcessing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">
                  {activeTab === 'export' ? 'Exporting...' : 'Importing...'}
                </span>
                <span className="text-purple-400 font-mono">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
              >
                Cancel
              </button>
              {activeTab === 'export' && (
                <button
                  onClick={handleExport}
                  disabled={!currentProject}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Export
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
