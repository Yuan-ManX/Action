'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export interface VideoClip {
  id: string
  title: string
  duration: number
  thumbnail?: string
  type: 'video' | 'audio' | 'image' | 'text'
}

interface WaveformData {
  peaks: number[]
  duration: number
}

interface EnhancedVideoPreviewProps {
  clips?: VideoClip[]
  currentTime?: number
  onTimeChange?: (time: number) => void
  onPlayPause?: (playing: boolean) => void
  isPlaying?: boolean
  showWaveform?: boolean
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3'
}

export default function EnhancedVideoPreview({
  clips = [],
  currentTime: controlledTime,
  onTimeChange,
  onPlayPause,
  isPlaying: controlledPlaying,
  showWaveform = false,
  aspectRatio = '16:9'
}: EnhancedVideoPreviewProps) {
  const [internalTime, setInternalTime] = useState(0)
  const [internalPlaying, setInternalPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showFramePreview, setShowFramePreview] = useState(true)
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  
  const videoRef = useRef<HTMLDivElement>(null)
  const seekBarRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const currentTime = controlledTime ?? internalTime
  const isPlaying = controlledPlaying ?? internalPlaying
  const totalDuration = clips.length > 0 
    ? Math.max(...clips.map(c => c.duration + (clips.findIndex(cc => cc.id === c.id) > 0 ? 
        clips.slice(0, clips.findIndex(cc => cc.id === c.id)).reduce((sum, cc) => sum + cc.duration, 0) : 0))
    : 30

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`
  }

  const generateWaveform = useCallback((): WaveformData => {
    const peaks: number[] = []
    const sampleCount = 100
    for (let i = 0; i < sampleCount; i++) {
      peaks.push(Math.random() * 0.8 + 0.2)
    }
    return { peaks, duration: totalDuration }
  }, [totalDuration])

  const waveform = showWaveform ? generateWaveform() : null

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now()
      const startVideoTime = currentTime

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000 * playbackRate
        const newTime = Math.min(startVideoTime + elapsed, totalDuration)
        
        if (onTimeChange) {
          onTimeChange(newTime)
        } else {
          setInternalTime(newTime)
        }

        if (newTime < totalDuration) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          if (onPlayPause) {
            onPlayPause(false)
          } else {
            setInternalPlaying(false)
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, currentTime, totalDuration, playbackRate, onTimeChange, onPlayPause])

  const togglePlayPause = () => {
    const newPlaying = !isPlaying
    if (onPlayPause) {
      onPlayPause(newPlaying)
    } else {
      setInternalPlaying(newPlaying)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarRef.current) return
    const rect = seekBarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const newTime = Math.max(0, Math.min((x / rect.width) * totalDuration, totalDuration))
    
    if (onTimeChange) {
      onTimeChange(newTime)
    } else {
      setInternalTime(newTime)
    }
  }

  const handleSeekHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarRef.current) return
    const rect = seekBarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const hoverTime = Math.max(0, Math.min((x / rect.width) * totalDuration, totalDuration))
    setHoverTime(hoverTime)
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '9:16': return 'aspect-[9/16]'
      case '1:1': return 'aspect-square'
      case '4:3': return 'aspect-[4/3]'
      default: return 'aspect-video'
    }
  }

  const getCurrentClip = () => {
    let accumulatedTime = 0
    for (const clip of clips) {
      if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clip.duration) {
        return clip
      }
      accumulatedTime += clip.duration
    }
    return null
  }

  const currentClip = getCurrentClip()

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex-1 relative flex items-center justify-center bg-black">
        <div 
          ref={videoRef}
          className={`relative ${getAspectRatioClass()} w-full max-w-4xl bg-gradient-to-br from-slate-800 to-slate-900`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {currentClip ? (
              <div className="text-center">
                <div className="text-7xl mb-4">{currentClip.thumbnail || '🎬'}</div>
                <p className="text-white text-lg font-semibold">{currentClip.title}</p>
                <p className="text-slate-400 text-sm">{currentClip.type.toUpperCase()}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-7xl mb-4">🎬</div>
                <p className="text-slate-400">Video Preview</p>
                <p className="text-sm text-slate-500 mt-2">Add clips to see your video</p>
              </div>
            )}
          </div>

          <button
            onClick={togglePlayPause}
            className="absolute z-10 w-20 h-20 rounded-full bg-purple-600/90 flex items-center justify-center text-white text-4xl hover:bg-purple-500 transition-all hover:scale-105 shadow-lg"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {showFramePreview && hoverTime !== null && (
            <div 
              className="absolute bottom-20 w-32 h-20 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center shadow-lg"
              style={{ left: `${(hoverTime / totalDuration) * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div className="text-2xl">🎞️</div>
              <span className="absolute bottom-1 text-xs text-slate-300">{formatTime(hoverTime)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-800">
        <div 
          ref={seekBarRef}
          className="relative h-8 cursor-pointer group"
          onClick={handleSeek}
          onMouseMove={handleSeekHover}
          onMouseLeave={() => setHoverTime(null)}
        >
          {waveform && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-px h-4">
                {waveform.peaks.map((peak, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-500/50 rounded-full"
                    style={{ height: `${peak * 100}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="absolute bottom-3 left-0 right-0 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>

          {hoverTime !== null && (
            <div
              className="absolute bottom-3 h-1 bg-white/50"
              style={{ left: 0, width: `${(hoverTime / totalDuration) * 100}%` }}
            />
          )}

          <div
            className="absolute bottom-3 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-[6px]"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-mono min-w-[80px]">
              {formatTime(currentTime)}
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => {
                  const newTime = Math.max(0, currentTime - 10)
                  onTimeChange ? onTimeChange(newTime) : setInternalTime(newTime)
                }}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                ⏮
              </button>
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 transition-colors"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button 
                onClick={() => {
                  const newTime = Math.min(totalDuration, currentTime + 10)
                  onTimeChange ? onTimeChange(newTime) : setInternalTime(newTime)
                }}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                ⏭
              </button>
            </div>
            <span className="text-slate-400 text-sm font-mono min-w-[80px]">
              {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFramePreview(!showFramePreview)}
              className={`p-2 transition-colors ${showFramePreview ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}
            >
              🖼️
            </button>
            
            <button 
              onClick={() => setShowWaveform(!showWaveform)}
              className={`p-2 transition-colors ${showWaveform ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}
            >
              📊
            </button>

            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-slate-700 text-white text-sm px-2 py-1 rounded border-none"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value))
                  setIsMuted(false)
                }}
                className="w-24 accent-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {clips.length > 0 && (
        <div className="p-4 bg-slate-900 border-t border-slate-700">
          <p className="text-sm text-slate-400 mb-3">Clip Timeline ({clips.length} clips)</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {clips.map((clip, index) => {
              let accumulatedTime = 0
              for (let i = 0; i < index; i++) {
                accumulatedTime += clips[i].duration
              }
              const isActive = currentTime >= accumulatedTime && currentTime < accumulatedTime + clip.duration
              
              return (
                <div
                  key={clip.id}
                  className={`flex-shrink-0 p-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-purple-600 border-2 border-purple-400' 
                      : 'bg-slate-800 border-2 border-transparent hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl mb-1">{clip.thumbnail || '🎬'}</div>
                  <p className="text-xs text-white truncate w-20">{clip.title}</p>
                  <p className="text-xs text-slate-400">{clip.duration}s</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
