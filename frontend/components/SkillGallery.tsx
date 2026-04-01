'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib'
import { Skill } from '@/types'

const SAMPLE_SKILLS: Skill[] = [
  {
    id: 'skill-1',
    name: 'YouTube Intro Creator',
    description: 'Generate engaging YouTube intro sequences with animated transitions and professional styling',
    category: 'Video Creation',
    difficulty: 'beginner',
    icon: '🎬',
    workflow: { steps: 5, estimatedTime: '3 minutes' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'skill-2',
    name: 'TikTok Style Editor',
    description: 'Automatically edit videos for TikTok with trending effects, music sync, and captions',
    category: 'Social Media',
    difficulty: 'intermediate',
    icon: '📱',
    workflow: { steps: 7, estimatedTime: '5 minutes' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'skill-3',
    name: 'Podcast Audio Enhancer',
    description: 'Clean up audio recordings, remove background noise, and optimize for podcast quality',
    category: 'Audio',
    difficulty: 'advanced',
    icon: '🎙️',
    workflow: { steps: 4, estimatedTime: '2 minutes' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'skill-4',
    name: 'Product Showcase',
    description: 'Create stunning product demonstration videos with smooth transitions and call-to-action overlays',
    category: 'Video Creation',
    difficulty: 'intermediate',
    icon: '📦',
    workflow: { steps: 6, estimatedTime: '4 minutes' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'skill-5',
    name: 'Documentary Style',
    description: 'Professional documentary editing with narrative pacing, interview cuts, and b-roll integration',
    category: 'Video Creation',
    difficulty: 'advanced',
    icon: '🎞️',
    workflow: { steps: 8, estimatedTime: '8 minutes' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'skill-6',
    name: 'Reels Creator',
    description: 'Short-form video optimization for Instagram Reels with dynamic text overlays and trending effects',
    category: 'Social Media',
    difficulty: 'beginner',
    icon: '✨',
    workflow: { steps: 5, estimatedTime: '3 minutes' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

interface SkillGalleryProps {
  onUseSkill?: (skill: Skill) => void
  onEditSkill?: (skill: Skill) => void
  onDeleteSkill?: (skillId: string) => void
}

export default function SkillGallery({ onUseSkill, onEditSkill, onDeleteSkill }: SkillGalleryProps) {
  const [skills, setSkills] = useState<Skill[]>(SAMPLE_SKILLS)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['all', ...new Set(skills.map(skill => skill.category))]

  const filteredSkills = skills.filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    const matchesSearch = !searchQuery || 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600/20 text-green-400'
      case 'intermediate': return 'bg-yellow-600/20 text-yellow-400'
      case 'advanced': return 'bg-red-600/20 text-red-400'
      default: return 'bg-slate-600/20 text-slate-400'
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>✨</span>
            Skills Library
          </h2>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all text-sm font-medium flex items-center gap-2">
            <span>+</span>
            Create Skill
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {filteredSkills.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-white text-lg font-medium mb-2">No skills found</h3>
            <p className="text-slate-400 mb-6">Create your first skill or adjust your filters</p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all font-medium">
              Create New Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, idx) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-purple-500/50 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-3xl">
                      {skill.icon}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditSkill?.(skill)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDeleteSkill?.(skill.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2">{skill.name}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{skill.description}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getDifficultyColor(skill.difficulty)
                    )}>
                      {skill.difficulty.charAt(0).toUpperCase() + skill.difficulty.slice(1)}
                    </span>
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium">
                      {skill.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-500">
                      <span>{skill.workflow.steps} steps</span>
                      <span className="mx-2">•</span>
                      <span>{skill.workflow.estimatedTime}</span>
                    </div>
                    <button
                      onClick={() => onUseSkill?.(skill)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all text-sm font-medium flex items-center gap-2"
                    >
                      Use
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
