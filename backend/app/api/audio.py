from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.core.audio import (
    AudioSystem,
    MusicTrack,
    VoiceProfile,
    FontRecommendation,
    AudioTiming
)

router = APIRouter()


class MusicRecommendationRequest(BaseModel):
    mood: Optional[str] = Field(None, description="Music mood: happy, sad, energetic, calm, dramatic, inspirational, mysterious, romantic")
    genre: Optional[str] = Field(None, description="Music genre: pop, rock, jazz, classical, hiphop, electronic, ambient, folk")
    tags: Optional[List[str]] = Field(None, description="Optional tags for filtering")
    max_results: int = Field(5, description="Maximum number of recommendations")


class VoiceProfileRequest(BaseModel):
    gender: Optional[str] = Field(None, description="Voice gender: male, female, neutral")
    tone: Optional[str] = Field(None, description="Voice tone: casual, professional, warm, energetic, calm, dramatic")
    language: str = Field("en", description="Language code, e.g., en, zh, es")


class FontRecommendationRequest(BaseModel):
    content_style: Optional[str] = Field(None, description="Content style for font recommendation")
    mood: Optional[str] = Field(None, description="Mood for font recommendation")
    category: Optional[str] = Field(None, description="Font category: serif, sans-serif, display, monospace, handwritten")
    max_results: int = Field(5, description="Maximum number of recommendations")


class AudioTimingRequest(BaseModel):
    scene_duration: float = Field(..., description="Duration of the scene in seconds")
    track_id: str = Field(..., description="ID of the music track to use")
    scene_start: float = Field(0.0, description="Start time of the scene in seconds")


_audio_system = AudioSystem()


@router.post("/music/recommendations", response_model=List[Dict[str, Any]])
async def get_music_recommendations(request: MusicRecommendationRequest):
    try:
        recommendations = _audio_system.get_music_recommendations(
            mood=request.mood,
            genre=request.genre,
            tags=request.tags,
            max_results=request.max_results
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get music recommendations: {str(e)}")


@router.get("/music/tracks", response_model=List[Dict[str, Any]])
async def list_music_tracks():
    try:
        return [track.to_dict() for track in _audio_system.music_engine.track_library]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list music tracks: {str(e)}")


@router.post("/voice/profiles", response_model=List[Dict[str, Any]])
async def get_voice_profiles(request: VoiceProfileRequest):
    try:
        profiles = _audio_system.get_voice_profiles(
            gender=request.gender,
            tone=request.tone,
            language=request.language
        )
        return profiles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get voice profiles: {str(e)}")


@router.get("/voice/profiles", response_model=List[Dict[str, Any]])
async def list_voice_profiles():
    try:
        return [profile.to_dict() for profile in _audio_system.voice_system.voice_profiles]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list voice profiles: {str(e)}")


@router.post("/font/recommendations", response_model=List[Dict[str, Any]])
async def get_font_recommendations(request: FontRecommendationRequest):
    try:
        fonts = _audio_system.get_font_recommendations(
            content_style=request.content_style,
            mood=request.mood,
            category=request.category,
            max_results=request.max_results
        )
        return fonts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get font recommendations: {str(e)}")


@router.get("/font/fonts", response_model=List[Dict[str, Any]])
async def list_fonts():
    try:
        return [font.to_dict() for font in _audio_system.font_system.font_library]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list fonts: {str(e)}")


@router.post("/timing/generate", response_model=Dict[str, Any])
async def generate_audio_timing(request: AudioTimingRequest):
    try:
        timing = _audio_system.generate_audio_timing(
            scene_duration=request.scene_duration,
            track_id=request.track_id,
            scene_start=request.scene_start
        )
        if timing is None:
            raise HTTPException(status_code=404, detail="Music track not found")
        return timing
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate audio timing: {str(e)}")
