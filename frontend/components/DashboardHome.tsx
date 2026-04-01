'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useProjectStore } from '@/stores/projectStore'
import { cn, formatTime, formatDuration } from '@/lib'
import { VideoProject } from '@/types'

export default function DashboardHome() {
  const { 
    projects, 
    loadProjects, 
    createProject, 
    setCurrentProject,
    duplicateProject,
    deleteProject,
    isLoading 
  } = useProjectStore()
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleCreateProject = () => {
    createProject('New Project', 'A new video project')
  }

  const handleOpenProject = (project: VideoProject) => {
    setCurrentProject(project.projectId)
  }

  const handleDuplicateProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation()
    duplicateProject(projectId)
  }

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation()
    setShowDeleteConfirm(projectId)
  }

  const confirmDeleteProject = () => {
    if (showDeleteConfirm) {
      deleteProject(showDeleteConfirm)
      setShowDeleteConfirm(null)
    }
  }

  const getProjectStatus = (project: VideoProject) => {
    if (project.clips.length === 0) return { label: 'Draft', color: 'bg-yellow-600' }
    if (project.updatedAt !== project.createdAt) return { label: 'In Progress', color: 'bg-blue-600' }
    return { label: 'Completed', color: 'bg-emerald-600' }
  }

  const stats = {
    totalProjects: projects.length,
    totalClips: projects.reduce((sum, p) => sum + p.clips.length, 0),
    totalDuration: projects.reduce((sum, p) => {
      if (p.clips.length === 0) return sum
      return sum + Math.max(...p.clips.map(c => c.startTime + c.duration))
    }, 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">Welcome back! Let's create something amazing.</p>
          </div>
          <button
            onClick={handleCreateProject}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 font-medium"
          >
            <span className="text-xl">+</span>
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🎬</span>
              <span className="text-2xl font-bold text-white">{stats.totalProjects}</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Total Projects</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">📹</span>
              <span className="text-2xl font-bold text-white">{stats.totalClips}</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Total Clips</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">⏱️</span>
              <span className="text-2xl font-bold text-white">{formatDuration(stats.totalDuration)}</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Total Editing Time</p>
          </motion.div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>📁</span>
            Recent Projects
          </h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-white text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-slate-400 mb-6">Create your first project to get started</p>
              <button
                onClick={handleCreateProject}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-500/20 font-medium"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((project, index) => {
                  const status = getProjectStatus(project)
                  return (
                    <motion.div
                      key={project.projectId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleOpenProject(project)}
                      className="group bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                      <div className="h-36 bg-gradient-to-br from-purple-900/50 to-slate-900 flex items-center justify-center relative">
                        <span className="text-6xl">🎬</span>
                        <div className="absolute top-3 right-3">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium text-white",
                            status.color
                          )}>
                            {status.label}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <Link
                            href="/dashboard/editor"
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors font-medium text-sm"
                          >
                            Open Editor
                          </Link>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-white font-semibold mb-1 truncate">{project.name}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-4">
                            <span>{project.clips.length} clips</span>
                            {project.totalDuration && <span>{formatDuration(project.totalDuration)}</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                          <span className="text-xs text-slate-500">
                            Updated {new Date(project.updatedAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleDuplicateProject(e, project.projectId)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                              title="Duplicate"
                            >
                              📋
                            </button>
                            <button
                              onClick={(e) => handleDeleteProject(e, project.projectId)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-900/20 to-slate-800 rounded-2xl p-6 border border-purple-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💡</span>
              <h3 className="text-white font-semibold text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Use keyboard shortcuts like Space for play/pause and Ctrl+Z for undo</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Drag clips between tracks for creative layering</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Apply effects from the Effects panel to selected clips</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-900/20 to-slate-800 rounded-2xl p-6 border border-blue-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⚡</span>
              <h3 className="text-white font-semibold text-lg">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/editor"
                className="p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-center group"
              >
                <span className="text-2xl block mb-2">✂️</span>
                <span className="text-white text-sm font-medium">Open Editor</span>
              </Link>
              <Link
                href="/dashboard/chat"
                className="p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-center group"
              >
                <span className="text-2xl block mb-2">💬</span>
                <span className="text-white text-sm font-medium">AI Assistant</span>
              </Link>
              <Link
                href="/dashboard/media"
                className="p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-center group"
              >
                <span className="text-2xl block mb-2">📁</span>
                <span className="text-white text-sm font-medium">Media Library</span>
              </Link>
              <Link
                href="/dashboard/skills"
                className="p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-center group"
              >
                <span className="text-2xl block mb-2">✨</span>
                <span className="text-white text-sm font-medium">Skills</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-slate-700"
          >
            <h3 className="text-white text-xl font-semibold mb-2">Delete Project?</h3>
            <p className="text-slate-400 mb-6">This action cannot be undone. The project will be permanently deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProject}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
