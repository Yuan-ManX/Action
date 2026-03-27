from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.core.conversational_editing import (
    get_conversational_editing_system,
    VideoTimeline,
    EditAction
)

router = APIRouter()


class CreateTimelineRequest(BaseModel):
    timeline_id: Optional[str] = Field(None, description="Optional timeline ID")


class EditRequest(BaseModel):
    user_input: str = Field(..., description="Natural language edit command")


class TimelineResponse(BaseModel):
    timeline_id: str
    clips: List[Dict[str, Any]]
    transitions: List[Dict[str, Any]]
    audio_tracks: List[Dict[str, Any]]
    created_at: str
    updated_at: str


class EditActionResponse(BaseModel):
    action_id: str
    command_type: str
    parameters: Dict[str, Any]
    description: str
    created_at: str


@router.post("/timeline", response_model=TimelineResponse)
async def create_timeline(request: CreateTimelineRequest):
    try:
        system = get_conversational_editing_system()
        timeline = system.create_timeline(request.timeline_id)
        return TimelineResponse(**timeline.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create timeline: {str(e)}")


@router.get("/timeline/{timeline_id}", response_model=TimelineResponse)
async def get_timeline(timeline_id: str):
    try:
        system = get_conversational_editing_system()
        timeline = system.get_timeline(timeline_id)
        if not timeline:
            raise HTTPException(status_code=404, detail="Timeline not found")
        return TimelineResponse(**timeline.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get timeline: {str(e)}")


@router.post("/timeline/{timeline_id}/edit", response_model=EditActionResponse)
async def process_edit(timeline_id: str, request: EditRequest):
    try:
        system = get_conversational_editing_system()
        action = await system.process_edit_request(timeline_id, request.user_input)
        if not action:
            raise HTTPException(status_code=400, detail="Failed to process edit request")
        return EditActionResponse(**action.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process edit: {str(e)}")


@router.post("/timeline/{timeline_id}/undo", response_model=Optional[EditActionResponse])
async def undo_edit(timeline_id: str):
    try:
        system = get_conversational_editing_system()
        action = system.undo_edit(timeline_id)
        if action:
            return EditActionResponse(**action.to_dict())
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to undo edit: {str(e)}")


@router.post("/timeline/{timeline_id}/redo", response_model=Optional[EditActionResponse])
async def redo_edit(timeline_id: str):
    try:
        system = get_conversational_editing_system()
        action = system.redo_edit(timeline_id)
        if action:
            return EditActionResponse(**action.to_dict())
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to redo edit: {str(e)}")


@router.get("/timeline/{timeline_id}/history", response_model=List[EditActionResponse])
async def get_edit_history(timeline_id: str, limit: int = 10):
    try:
        system = get_conversational_editing_system()
        history = system.get_edit_history(timeline_id, limit)
        return [EditActionResponse(**a) for a in history]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get edit history: {str(e)}")


@router.post("/timeline/{timeline_id}/clip")
async def add_clip(timeline_id: str, clip: Dict[str, Any]):
    try:
        system = get_conversational_editing_system()
        timeline = system.get_timeline(timeline_id)
        if not timeline:
            raise HTTPException(status_code=404, detail="Timeline not found")
        timeline.add_clip(clip)
        return {"message": "Clip added successfully", "timeline": timeline.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add clip: {str(e)}")


@router.delete("/timeline/{timeline_id}/clip/{clip_index}")
async def remove_clip(timeline_id: str, clip_index: int):
    try:
        system = get_conversational_editing_system()
        timeline = system.get_timeline(timeline_id)
        if not timeline:
            raise HTTPException(status_code=404, detail="Timeline not found")
        success = timeline.remove_clip(clip_index)
        if not success:
            raise HTTPException(status_code=400, detail="Invalid clip index")
        return {"message": "Clip removed successfully", "timeline": timeline.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove clip: {str(e)}")


@router.post("/timeline/{timeline_id}/swap")
async def swap_clips(timeline_id: str, index1: int, index2: int):
    try:
        system = get_conversational_editing_system()
        timeline = system.get_timeline(timeline_id)
        if not timeline:
            raise HTTPException(status_code=404, detail="Timeline not found")
        success = timeline.swap_clips(index1, index2)
        if not success:
            raise HTTPException(status_code=400, detail="Invalid clip indices")
        return {"message": "Clips swapped successfully", "timeline": timeline.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to swap clips: {str(e)}")
