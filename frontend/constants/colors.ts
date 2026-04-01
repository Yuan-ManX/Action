export const THEME = {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
}

export const GRADIENTS = {
  primary: 'from-purple-600 to-purple-500',
  primaryDark: 'from-purple-700 to-purple-600',
  secondary: 'from-indigo-600 to-indigo-500',
  accent: 'from-pink-600 to-purple-600',
  video: 'from-purple-600 to-purple-500',
  audio: 'from-green-600 to-green-500',
  image: 'from-blue-600 to-blue-500',
  text: 'from-yellow-600 to-yellow-500',
  effect: 'from-pink-600 to-pink-500',
}

export const CLIP_COLORS = {
  video: {
    bg: 'from-purple-600 to-purple-500',
    border: 'border-purple-500',
    text: 'text-purple-400',
  },
  audio: {
    bg: 'from-green-600 to-green-500',
    border: 'border-green-500',
    text: 'text-green-400',
  },
  image: {
    bg: 'from-blue-600 to-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-400',
  },
  text: {
    bg: 'from-yellow-600 to-yellow-500',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
  },
  effect: {
    bg: 'from-pink-600 to-pink-500',
    border: 'border-pink-500',
    text: 'text-pink-400',
  },
}

export const TRACK_COLORS = {
  video: {
    bg: 'bg-purple-900/30',
    border: 'border-purple-800',
    text: 'text-purple-400',
  },
  audio: {
    bg: 'bg-green-900/30',
    border: 'border-green-800',
    text: 'text-green-400',
  },
  text: {
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-800',
    text: 'text-yellow-400',
  },
  effect: {
    bg: 'bg-pink-900/30',
    border: 'border-pink-800',
    text: 'text-pink-400',
  },
}

export const EFFECT_CATEGORIES = {
  visual: {
    name: 'Visual Effects',
    icon: '✨',
    items: [
      { id: 'blur', name: 'Blur', icon: '🌫️' },
      { id: 'brightness', name: 'Brightness', icon: '💡' },
      { id: 'contrast', name: 'Contrast', icon: '🎚️' },
      { id: 'grayscale', name: 'Grayscale', icon: '⬛' },
      { id: 'invert', name: 'Invert', icon: '🔄' },
      { id: 'sepia', name: 'Sepia', icon: '📷' },
      { id: 'saturate', name: 'Saturate', icon: '🎨' },
      { id: 'hue', name: 'Hue Rotate', icon: '🌈' },
    ],
  },
  transition: {
    name: 'Transitions',
    icon: '🔄',
    items: [
      { id: 'fade', name: 'Fade', icon: '👁️' },
      { id: 'slide', name: 'Slide', icon: '→' },
      { id: 'zoom', name: 'Zoom', icon: '🔍' },
      { id: 'wipe', name: 'Wipe', icon: '⬜' },
      { id: 'glitch', name: 'Glitch', icon: '📺' },
      { id: 'dissolve', name: 'Dissolve', icon: '✨' },
    ],
  },
  audio: {
    name: 'Audio Effects',
    icon: '🎵',
    items: [
      { id: 'reverb', name: 'Reverb', icon: '🔊' },
      { id: 'echo', name: 'Echo', icon: '🔉' },
      { id: 'bass', name: 'Bass Boost', icon: '🔈' },
      { id: 'highpass', name: 'High Pass', icon: '📶' },
      { id: 'lowpass', name: 'Low Pass', icon: '📉' },
      { id: 'compressor', name: 'Compressor', icon: '📊' },
    ],
  },
}

export const ASPECT_RATIOS = [
  { id: '16:9', name: '16:9 (Landscape)', width: 1920, height: 1080, ratio: '16:9' },
  { id: '9:16', name: '9:16 (Portrait)', width: 1080, height: 1920, ratio: '9:16' },
  { id: '1:1', name: '1:1 (Square)', width: 1080, height: 1080, ratio: '1:1' },
  { id: '4:3', name: '4:3 (Standard)', width: 1440, height: 1080, ratio: '4:3' },
  { id: '21:9', name: '21:9 (Cinematic)', width: 2560, height: 1080, ratio: '21:9' },
]

export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export const FPS_OPTIONS = [24, 25, 30, 50, 60]

export const RESOLUTIONS = [
  { id: '720p', name: '720p (HD)', width: 1280, height: 720 },
  { id: '1080p', name: '1080p (Full HD)', width: 1920, height: 1080 },
  { id: '1440p', name: '1440p (2K)', width: 2560, height: 1440 },
  { id: '2160p', name: '2160p (4K)', width: 3840, height: 2160 },
]

export const EXPORT_FORMATS = [
  { id: 'mp4', name: 'MP4 (H.264)', extension: '.mp4' },
  { id: 'webm', name: 'WebM (VP9)', extension: '.webm' },
  { id: 'mov', name: 'QuickTime (MOV)', extension: '.mov' },
  { id: 'gif', name: 'Animated GIF', extension: '.gif' },
]

export const QUALITY_LEVELS = [
  { id: 'low', name: 'Low', bitrate: '2 Mbps' },
  { id: 'medium', name: 'Medium', bitrate: '5 Mbps' },
  { id: 'high', name: 'High', bitrate: '10 Mbps' },
  { id: 'ultra', name: 'Ultra', bitrate: '20 Mbps' },
]
