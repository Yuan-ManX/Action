export type ClipType = 'video' | 'audio' | 'image' | 'text' | 'effect'

export interface ClipEffect {
  id: string
  type: string
  name: string
  parameters: Record<string, any>
}

export interface TimelineClip {
  id: string
  type: ClipType
  title: string
  startTime: number
  duration: number
  thumbnail?: string
  color?: string
  track: number
  mediaPath?: string
  properties?: Record<string, any>
  effects?: ClipEffect[]
}

export interface TimelineTrack {
  id: string
  type: ClipType
  name: string
  locked: boolean
  muted: boolean
  volume: number
}

export interface Transition {
  id: string
  type: string
  name: string
  fromClipId: string
  toClipId: string
  duration: number
  parameters: Record<string, any>
}

export interface AspectRatio {
  id: string
  name: string
  width: number
  height: number
  ratio: string
}

export const ASPECT_RATIOS: AspectRatio[] = [
  { id: '16:9', name: '16:9 (Landscape)', width: 1920, height: 1080, ratio: '16:9' },
  { id: '9:16', name: '9:16 (Portrait)', width: 1080, height: 1920, ratio: '9:16' },
  { id: '1:1', name: '1:1 (Square)', width: 1080, height: 1080, ratio: '1:1' },
  { id: '4:3', name: '4:3 (Standard)', width: 1440, height: 1080, ratio: '4:3' },
]

export interface VideoProject {
  projectId: string
  name: string
  description: string
  width: number
  height: number
  fps: number
  aspectRatio: string
  tracks: TimelineTrack[]
  clips: TimelineClip[]
  transitions: Transition[]
  createdAt: string
  updatedAt: string
  totalDuration?: number
  thumbnail?: string
}

export interface Effect {
  id: string
  name: string
  icon: string
  type: 'visual' | 'audio' | 'transition'
  category: string
  description?: string
}

export interface MediaAsset {
  id: string
  name: string
  type: 'image' | 'video' | 'audio'
  filePath: string
  thumbnailPath?: string
  duration?: number
  size: number
  createdAt: string
  tags: string[]
}

export interface Skill {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  icon: string
  workflow: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  attachments?: MediaAsset[]
}

export interface ExportSettings {
  format: 'mp4' | 'mov' | 'webm' | 'json'
  quality: 'low' | 'medium' | 'high' | 'ultra'
  resolution: '720p' | '1080p' | '1440p' | '2160p'
  includeAudio: boolean
  watermark: boolean
}

export interface ProjectStats {
  totalClips: number
  totalTracks: number
  totalDuration: number
  totalEffects: number
}
