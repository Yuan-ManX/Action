const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const api = new ApiClient(API_BASE_URL)

export interface ProjectResponse {
  success: boolean
  project?: any
  projects?: any[]
  clip?: any
  clips?: any[]
  track?: any
  transition?: any
  preview?: any
}

export const timelineApi = {
  createProject: (data: { name?: string; description?: string; width?: number; height?: number; fps?: number }) =>
    api.post<ProjectResponse>('/timeline/projects', data),
  
  listProjects: () =>
    api.get<ProjectResponse>('/timeline/projects'),
  
  getProject: (projectId: string) =>
    api.get<ProjectResponse>(`/timeline/projects/${projectId}`),
  
  updateProject: (projectId: string, data: any) =>
    api.put<ProjectResponse>(`/timeline/projects/${projectId}`, data),
  
  deleteProject: (projectId: string) =>
    api.delete<ProjectResponse>(`/timeline/projects/${projectId}`),
  
  addClip: (projectId: string, data: any) =>
    api.post<ProjectResponse>(`/timeline/projects/${projectId}/clips`, data),
  
  updateClip: (projectId: string, clipId: string, data: any) =>
    api.put<ProjectResponse>(`/timeline/projects/${projectId}/clips/${clipId}`, data),
  
  deleteClip: (projectId: string, clipId: string) =>
    api.delete<ProjectResponse>(`/timeline/projects/${projectId}/clips/${clipId}`),
  
  splitClip: (projectId: string, clipId: string, splitTime: number) =>
    api.post<ProjectResponse>(`/timeline/projects/${projectId}/clips/${clipId}/split`, { split_time: splitTime }),
  
  addTrack: (projectId: string, data: { track_type?: string; name?: string }) =>
    api.post<ProjectResponse>(`/timeline/projects/${projectId}/tracks`, data),
  
  addTransition: (projectId: string, data: any) =>
    api.post<ProjectResponse>(`/timeline/projects/${projectId}/transitions`, data),
  
  getPreview: (projectId: string) =>
    api.get<ProjectResponse>(`/timeline/projects/${projectId}/preview`),
  
  copyClip: (projectId: string, clipId: string, newStartTime?: number) =>
    api.post<ProjectResponse>(`/timeline/projects/${projectId}/clips/${clipId}/copy`, { new_start_time: newStartTime }),
  
  mergeClips: (projectId: string, clipIds: string[]) =>
    api.post<ProjectResponse>(`/timeline/projects/${projectId}/clips/merge`, { clip_ids: clipIds }),
  
  reorderClips: (projectId: string, clipOrder: string[]) =>
    api.post<ProjectResponse>(`/timeline/projects/${projectId}/clips/reorder`, { clip_order: clipOrder }),
  
  getClipsByTrack: (projectId: string, trackIndex: number) =>
    api.get<ProjectResponse>(`/timeline/projects/${projectId}/tracks/${trackIndex}/clips`),
  
  trimClip: (projectId: string, clipId: string, trimStart: number = 0, trimEnd: number = 0) =>
    api.post<ProjectResponse>(`/timeline/projects/${projectId}/clips/${clipId}/trim`, { trim_start: trimStart, trim_end: trimEnd }),
  
  duplicateProject: (projectId: string, newName?: string) =>
    api.post<ProjectResponse>(`/timeline/projects/${projectId}/duplicate`, { new_name: newName }),
}

export const healthApi = {
  checkHealth: () => api.get('/health'),
}
