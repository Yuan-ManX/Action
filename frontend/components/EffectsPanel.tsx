'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export interface Effect {
  id: string
  name: string
  icon: string
  type: 'visual' | 'audio' | 'transition'
  category: string
  description?: string
}

interface EffectsPanelProps {
  onAddEffect?: (effect: Effect) => void
  onApplyTransition?: (effect: Effect) => void
  selectedClipId?: string
}

const visualEffects: Effect[] = [
  { id: 'blur', name: 'Blur', icon: '🫧', type: 'visual', category: 'Blur', description: 'Soft blur effect' },
  { id: 'glow', name: 'Glow', icon: '✨', type: 'visual', category: 'Lighting', description: 'Glow and bloom effect' },
  { id: 'sepia', name: 'Sepia', icon: '🟤', type: 'visual', category: 'Color', description: 'Vintage sepia tone' },
  { id: 'grayscale', name: 'Black & White', icon: '⬛', type: 'visual', category: 'Color', description: 'Remove color saturation' },
  { id: 'invert', name: 'Invert', icon: '🔄', type: 'visual', category: 'Color', description: 'Invert colors' },
  { id: 'zoom', name: 'Zoom', icon: '🔍', type: 'visual', category: 'Transform', description: 'Zoom in/out effect' },
  { id: 'rotate', name: 'Rotate', icon: '🔃', type: 'visual', category: 'Transform', description: 'Rotate video' },
  { id: 'flip', name: 'Flip', icon: '↔️', type: 'visual', category: 'Transform', description: 'Flip horizontal/vertical' }
]

const audioEffects: Effect[] = [
  { id: 'echo', name: 'Echo', icon: '🔊', type: 'audio', category: 'Delay', description: 'Audio echo effect' },
  { id: 'reverb', name: 'Reverb', icon: '🏛️', type: 'audio', category: 'Space', description: 'Room reverb' },
  { id: 'pitch', name: 'Pitch Shift', icon: '🎵', type: 'audio', category: 'Tone', description: 'Change audio pitch' },
  { id: 'speed', name: 'Speed', icon: '⚡', type: 'audio', category: 'Time', description: 'Audio speed control' },
  { id: 'fadein', name: 'Fade In', icon: '↗️', type: 'audio', category: 'Fade', description: 'Smooth fade in' },
  { id: 'fadeout', name: 'Fade Out', icon: '↘️', type: 'audio', category: 'Fade', description: 'Smooth fade out' }
]

const transitions: Effect[] = [
  { id: 'dissolve', name: 'Dissolve', icon: '✨', type: 'transition', category: 'Classic', description: 'Smooth dissolve' },
  { id: 'slide_left', name: 'Slide Left', icon: '➡️', type: 'transition', category: 'Slide', description: 'Slide from right' },
  { id: 'slide_right', name: 'Slide Right', icon: '⬅️', type: 'transition', category: 'Slide', description: 'Slide from left' },
  { id: 'slide_up', name: 'Slide Up', icon: '⬆️', type: 'transition', category: 'Slide', description: 'Slide from bottom' },
  { id: 'slide_down', name: 'Slide Down', icon: '⬇️', type: 'transition', category: 'Slide', description: 'Slide from top' },
  { id: 'wipe_left', name: 'Wipe Left', icon: '➡️', type: 'transition', category: 'Wipe', description: 'Wipe from right' },
  { id: 'wipe_right', name: 'Wipe Right', icon: '⬅️', type: 'transition', category: 'Wipe', description: 'Wipe from left' },
  { id: 'fade', name: 'Fade', icon: '🌅', type: 'transition', category: 'Classic', description: 'Cross fade' },
  { id: 'zoom_in', name: 'Zoom In', icon: '🔍', type: 'transition', category: 'Zoom', description: 'Zoom in transition' },
  { id: 'zoom_out', name: 'Zoom Out', icon: '🔭', type: 'transition', category: 'Zoom', description: 'Zoom out transition' },
  { id: 'rotate_left', name: 'Rotate Left', icon: '🔄', type: 'transition', category: 'Rotate', description: 'Rotate left' },
  { id: 'rotate_right', name: 'Rotate Right', icon: '🔃', type: 'transition', category: 'Rotate', description: 'Rotate right' }
]

const allEffects = [...visualEffects, ...audioEffects, ...transitions]

export default function EffectsPanel({ 
  onAddEffect, 
  onApplyTransition, 
  selectedClipId 
}: EffectsPanelProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'audio' | 'transition'>('visual')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEffects = allEffects.filter(effect => {
    const matchesType = effect.type === activeTab
    const matchesSearch = !searchQuery || 
      effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      effect.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const categories = [...new Set(filteredEffects.map(e => e.category))]

  const handleEffectClick = (effect: Effect) => {
    if (effect.type === 'transition') {
      onApplyTransition?.(effect)
    } else {
      onAddEffect?.(effect)
    }
  }

  return (
    <div className="h-full bg-slate-900 border-l border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-lg">
          <span>🎨</span>
          Effects & Transitions
        </h3>
        
        <div className="flex gap-1 bg-slate-800 rounded-lg p-1 mb-4">
          {[
            { id: 'visual' as const, icon: '🖼️', label: 'Visual' },
            { id: 'audio' as const, icon: '🎵', label: 'Audio' },
            { id: 'transition' as const, icon: '✨', label: 'Transitions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input
            type="text"
            placeholder="Search effects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {categories.map((category) => {
          const categoryEffects = filteredEffects.filter(e => e.category === category)
          if (categoryEffects.length === 0) return null

          return (
            <div key={category} className="mb-6">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {category}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {categoryEffects.map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => handleEffectClick(effect)}
                    className="group p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-purple-500 hover:bg-slate-750 transition-all text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{effect.icon}</span>
                      <span className="text-sm font-medium text-white truncate">
                        {effect.name}
                      </span>
                    </div>
                    {effect.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {effect.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {filteredEffects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm text-slate-500">No effects found</p>
          </div>
        )}
      </div>

      {selectedClipId && (
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-purple-400">🎯</span>
            <span className="text-slate-400">Selected clip ready</span>
          </div>
        </div>
      )}
    </div>
  )
}
