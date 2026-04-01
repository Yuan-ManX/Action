from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import os
from pathlib import Path

router = APIRouter()

PROJECTS_DIR = Path("./data/projects")
PROJECTS_DIR.mkdir(parents=True, exist_ok=True)


class TimelineClip(BaseModel):
    id: str
    type: str
    title: str
    startTime: float
    duration: float
    thumbnail: Optional[str] = None
    color: Optional[str] = None
    track: int
    mediaPath: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None
    effects: Optional[List[Any]] = None


class TimelineTrack(BaseModel):
    id: str
    type: str
    name: str
    locked: bool
    muted: bool
    volume: float


class Transition(BaseModel):
    id: str
    type: str
    name: str
    fromClipId: str
    toClipId: str
    duration: float
    parameters: Dict[str, Any]


class VideoProject(BaseModel):
    projectId: str
    name: str
    description: str
    width: int
    height: int
    fps: int
    aspectRatio: str
    tracks: List[TimelineTrack]
    clips: List[TimelineClip]
    transitions: List[Transition]
    createdAt: str
    updatedAt: str
    totalDuration: Optional[float] = None
    thumbnail: Optional[str] = None


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    width: Optional[int] = 1920
    height: Optional[int] = 1080
    fps: Optional[int] = 30
    aspectRatio: Optional[str] = "16:9"


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    fps: Optional[int] = None
    aspectRatio: Optional[str] = None
    tracks: Optional[List[TimelineTrack]] = None
    clips: Optional[List[TimelineClip]] = None
    transitions: Optional[List[Transition]] = None


def get_project_path(project_id: str) -> Path:
    return PROJECTS_DIR / f"{project_id}.json"


def load_project(project_id: str) -> VideoProject:
    project_path = get_project_path(project_id)
    if not project_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    with open(project_path, 'r') as f:
        project_data = json.load(f)
        return VideoProject(**project_data)


def save_project(project: VideoProject):
    project_path = get_project_path(project.projectId)
    with open(project_path, 'w') as f:
        json.dump(project.model_dump(), f, indent=2)


@router.get("/", response_model=List[VideoProject])
async def list_projects():
    projects = []
    for project_file in PROJECTS_DIR.glob("*.json"):
        try:
            with open(project_file, 'r') as f:
                project_data = json.load(f)
                projects.append(VideoProject(**project_data))
        except Exception:
            continue
    return sorted(projects, key=lambda p: p.updatedAt, reverse=True)


@router.get("/{project_id}", response_model=VideoProject)
async def get_project(project_id: str):
    return load_project(project_id)


@router.post("/", response_model=VideoProject, status_code=status.HTTP_201_CREATED)
async def create_project(project_create: ProjectCreate):
    project_id = f"proj_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    default_tracks = [
        TimelineTrack(
            id="video-1",
            type="video",
            name="Video Track 1",
            locked=False,
            muted=False,
            volume=1.0
        ),
        TimelineTrack(
            id="audio-1",
            type="audio",
            name="Audio Track 1",
            locked=False,
            muted=False,
            volume=1.0
        ),
        TimelineTrack(
            id="text-1",
            type="text",
            name="Text Track 1",
            locked=False,
            muted=False,
            volume=1.0
        )
    ]
    
    project = VideoProject(
        projectId=project_id,
        name=project_create.name,
        description=project_create.description or "",
        width=project_create.width or 1920,
        height=project_create.height or 1080,
        fps=project_create.fps or 30,
        aspectRatio=project_create.aspectRatio or "16:9",
        tracks=default_tracks,
        clips=[],
        transitions=[],
        createdAt=datetime.now().isoformat(),
        updatedAt=datetime.now().isoformat(),
        totalDuration=0.0
    )
    
    save_project(project)
    return project


@router.put("/{project_id}", response_model=VideoProject)
async def update_project(project_id: str, project_update: ProjectUpdate):
    project = load_project(project_id)
    
    update_data = project_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    project.updatedAt = datetime.now().isoformat()
    
    save_project(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str):
    project_path = get_project_path(project_id)
    if not project_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    project_path.unlink()


@router.post("/{project_id}/duplicate", response_model=VideoProject)
async def duplicate_project(project_id: str):
    original = load_project(project_id)
    new_project_id = f"proj_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    duplicated = VideoProject(
        **original.model_dump(exclude={"projectId", "name", "createdAt", "updatedAt"}),
        projectId=new_project_id,
        name=f"{original.name} (Copy)",
        createdAt=datetime.now().isoformat(),
        updatedAt=datetime.now().isoformat()
    )
    
    save_project(duplicated)
    return duplicated


@router.post("/{project_id}/save")
async def save_project_endpoint(project_id: str, project: VideoProject):
    if project.projectId != project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project ID mismatch"
        )
    
    project.updatedAt = datetime.now().isoformat()
    save_project(project)
    return {"status": "success", "message": "Project saved"}
