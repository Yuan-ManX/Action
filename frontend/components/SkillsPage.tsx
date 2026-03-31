'use client'

import { useState } from 'react'

interface Skill {
  id: string
  name: string
  description: string
  type: 'editing' | 'styling' | 'effects' | 'transitions' | 'audio' | 'complete'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  isBuiltin: boolean
  author: string
  steps: number
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'Quick Intro',
      description: 'Create a quick 10-second intro with title and music',
      type: 'complete',
      difficulty: 'beginner',
      tags: ['intro', 'title', 'quick'],
      isBuiltin: true,
      author: 'Action',
      steps: 2
    },
    {
      id: '2',
      name: 'Cinematic Style',
      description: 'Apply cinematic color grading and transitions',
      type: 'styling',
      difficulty: 'intermediate',
      tags: ['cinematic', 'color', 'movie'],
      isBuiltin: true,
      author: 'Action',
      steps: 2
    },
    {
      id: '3',
      name: 'Vlog Style',
      description: 'Create engaging vlog-style content',
      type: 'complete',
      difficulty: 'beginner',
      tags: ['vlog', 'casual', 'social'],
      isBuiltin: true,
      author: 'Action',
      steps: 3
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || skill.type === filterType
    const matchesDifficulty = filterDifficulty === 'all' || skill.difficulty === filterDifficulty
    return matchesSearch && matchesType && matchesDifficulty
  })

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      editing: 'bg-blue-100 text-blue-800',
      styling: 'bg-purple-100 text-purple-800',
      effects: 'bg-pink-100 text-pink-800',
      transitions: 'bg-yellow-100 text-yellow-800',
      audio: 'bg-green-100 text-green-800',
      complete: 'bg-indigo-100 text-indigo-800'
    }
    return colors[type] || 'bg-slate-100 text-slate-800'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-slate-100 text-slate-800'
  }

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Skills Library</h1>
        <p className="text-slate-600">Save and reuse your favorite editing workflows</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="editing">Editing</option>
          <option value="styling">Styling</option>
          <option value="effects">Effects</option>
          <option value="transitions">Transitions</option>
          <option value="audio">Audio</option>
          <option value="complete">Complete</option>
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{skill.name}</h3>
                  {skill.isBuiltin && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      Built-in
                    </span>
                  )}
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  ⋮
                </button>
              </div>

              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {skill.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(skill.type)}`}>
                  {skill.type}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(skill.difficulty)}`}>
                  {skill.difficulty}
                </span>
                <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full">
                  {skill.steps} steps
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {skill.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-slate-50 text-slate-600 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">by {skill.author}</span>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  Apply Skill
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No skills found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  )
}
