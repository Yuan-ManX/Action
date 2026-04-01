'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useProjectStore } from '@/stores/projectStore'
import { cn, formatTime, generateWaveform } from '@/lib'

export default function StudioPreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(60)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showFullscreen, setShowFullscreen] = useState(false)
  
  const previewRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const { getClips, getTotalDuration } = useProjectStore()
  const clips = getClips()
  const totalDuration = getTotalDuration() || duration

  const waveformData = generateWaveform(duration, 100)

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    } else {
      let lastTime = performance.now()
      const animate = (time: number) => {
        const delta = (time - lastTime) / 1000
        lastTime = time
        setCurrentTime(prev => {
          const next = prev + delta * playbackRate
          if (next >= totalDuration) {
            setIsPlaying(false)
            return totalDuration
          }
          return next
        })
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, playbackRate, totalDuration])

  const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    setCurrentTime(ratio * totalDuration)
  }, [totalDuration])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement && previewRef.current) {
      previewRef.current.requestFullscreen()
      setShowFullscreen(true)
    } else {
      document.exitFullscreen()
      setShowFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setShowFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleMute = () => setIsMuted(!isMuted)

  const progress = (currentTime / totalDuration) * 100

  return (
    <div className="h-[420px] bg-[#1a1a1a] border-b border-[#2a2a2a] flex flex-col">
      <div ref={previewRef} className="flex-1 flex items-center justify-center relative">
        <div className="relative aspect-video w-full max-w-[500px] bg-black rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-30">🎬</div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              className="p-2 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors"
              title="Toggle fullscreen"
            >
              <span className="text-base">📺</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-[#1a1a1a]">
        <div className="flex items-center gap-4 mb-3">
          <div className="text-[#888888] text-xs font-mono min-w-[80px]">
            {formatTime(currentTime)}
          </div>

          <div
            className="flex-1 h-1.5 bg-[#333333] rounded-full relative cursor-pointer group"
            onClick={handleScrub}
          >
            <div
              className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
              style={{ left: `calc(${progress}% - 7px)` }}
            />
          </div>

          <div className="text-[#888888] text-xs font-mono min-w-[80px]">
            {formatTime(totalDuration)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            className="p-2 text-[#888888] hover:text-white transition-colors"
            title="Go back 5 seconds"
          >
            <span className="text-lg">⏪</span>
          </button>

          <button
            onClick={handlePlayPause}
            className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
            title={isPlaying ? "Pause" : "Play"}
          >
            <span className="text-xl">{isPlaying ? "⏸" : "▶"}</span>
          </button>

          <button
            className="p-2 text-[#888888] hover:text-white transition-colors"
            title="Go forward 5 seconds"
          >
            <span className="text-lg">⏩</span>
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1.5 text-[#888888] hover:text-white transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              <span className="text-base">{isMuted ? "🔇" : "🔊"}</span>
            </button>
            <div className="w-24 h-1.5 bg-[#333333] rounded-full relative cursor-pointer group">
              <div
                className="absolute left-0 top-0 h-full bg-[#888888] rounded-full"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                style={{ left: `calc(${isMuted ? 0 : volume}% - 5px)` }}
              />
            </div>
          </div>

          <div className="text-xs text-[#666666] font-medium">
            Main scene
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 text-[#888888] hover:text-white transition-colors"
              title="Fullscreen"
            >
              <span className="text-base">🔍</span>
            </button>
            <div className="w-px h-4 bg-[#333333]" />
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-transparent text-[#888888] text-xs border-none outline-none cursor-pointer hover:text-white transition-colors"
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
