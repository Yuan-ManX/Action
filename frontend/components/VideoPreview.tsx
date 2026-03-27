'use client'

import { useState } from 'react'

interface VideoClip {
  id: string
  title: string
  duration: number
  thumbnail: string
}

export default function VideoPreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)

  const clips: VideoClip[] = [
    { id: '1', title: 'Opening Scene', duration: 5, thumbnail: '🎬' },
    { id: '2', title: 'Main Content', duration: 12, thumbnail: '📸' },
    { id: '3', title: 'Transition', duration: 2, thumbnail: '✨' },
    { id: '4', title: 'Closing Scene', duration: 4, thumbnail: '🎯' },
  ]

  const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0)

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex-1 relative flex items-center justify-center bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4">🎬</div>
            <p className="text-slate-400">Video Preview</p>
            <p className="text-sm text-slate-500 mt-2">Your video will appear here</p>
          </div>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute z-10 w-20 h-20 rounded-full bg-purple-600/90 flex items-center justify-center text-white text-4xl hover:bg-purple-500 transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      <div className="p-4 bg-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-white text-sm font-mono">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
          </span>
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            ></div>
          </div>
          <span className="text-slate-400 text-sm font-mono">
            {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-white transition-colors">⏮</button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 transition-colors"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">⏭</button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 accent-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <p className="text-sm text-slate-400 mb-3">Timeline ({clips.length} clips)</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {clips.map((clip, index) => (
            <div
              key={clip.id}
              className="flex-shrink-0 p-3 bg-slate-800 rounded-lg border-2 border-purple-500"
            >
              <div className="text-3xl mb-1">{clip.thumbnail}</div>
              <p className="text-xs text-white truncate w-20">{clip.title}</p>
              <p className="text-xs text-slate-400">{clip.duration}s</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
