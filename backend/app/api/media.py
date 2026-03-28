from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.media.media import get_media_storage, MediaFile, VideoComposer
from app.config.config import get_settings
import os

router = APIRouter()
settings = get_settings()


class MediaInfoResponse(BaseModel):
    filename: str
    file_path: str
    media_type: str
    file_size: int
    created_at: str
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[float] = None
    fps: Optional[float] = None
    format: Optional[str] = None
    mode: Optional[str] = None


class MediaListResponse(BaseModel):
    media_files: List[Dict[str, Any]]


class UploadResponse(BaseModel):
    success: bool
    message: str
    media_info: Dict[str, Any]


class VideoCompositionRequest(BaseModel):
    image_filenames: List[str] = Field(..., description="List of image filenames to use in the video")
    output_filename: str = Field(..., description="Output video filename")
    fps: int = Field(24, description="Frames per second for the video")
    audio_filename: Optional[str] = Field(None, description="Optional audio filename to add to the video")


class VideoCompositionResponse(BaseModel):
    success: bool
    message: str
    output_path: Optional[str] = None
    media_info: Optional[Dict[str, Any]] = None


@router.post("/upload", response_model=UploadResponse)
async def upload_media(file: UploadFile = File(...)):
    try:
        storage = get_media_storage()

        if file.size and file.size > settings.MEDIA_MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File too large")

        if file.content_type not in settings.MEDIA_ALLOWED_TYPES:
            raise HTTPException(status_code=415, detail="File type not allowed")

        content = await file.read()
        media_file = await storage.save_file(content, file.filename)

        return UploadResponse(
            success=True,
            message="File uploaded successfully",
            media_info=media_file.get_info()
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list", response_model=MediaListResponse)
async def list_media():
    try:
        storage = get_media_storage()
        media_files = storage.list_media_files()
        return MediaListResponse(
            media_files=[media.get_info() for media in media_files]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{filename}", response_model=MediaInfoResponse)
async def get_media_info(filename: str):
    try:
        storage = get_media_storage()
        media_file = storage.get_media_file(filename)
        if not media_file:
            raise HTTPException(status_code=404, detail="Media file not found")
        return MediaInfoResponse(**media_file.get_info())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{filename}")
async def delete_media(filename: str):
    try:
        storage = get_media_storage()
        success = storage.delete_media_file(filename)
        if not success:
            raise HTTPException(status_code=404, detail="Media file not found")
        return {"status": "success", "message": "Media file deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compose-video", response_model=VideoCompositionResponse)
async def compose_video(request: VideoCompositionRequest):
    try:
        storage = get_media_storage()

        image_paths = []
        for img_filename in request.image_filenames:
            media_file = storage.get_media_file(img_filename)
            if not media_file:
                raise HTTPException(status_code=404, detail=f"Image file {img_filename} not found")
            image_paths.append(media_file.file_path)

        audio_path = None
        if request.audio_filename:
            audio_file = storage.get_media_file(request.audio_filename)
            if not audio_file:
                raise HTTPException(status_code=404, detail=f"Audio file {request.audio_filename} not found")
            audio_path = audio_file.file_path

        output_ext = os.path.splitext(request.output_filename)[1]
        if not output_ext:
            output_filename = request.output_filename
        else:
            output_filename = f"{request.output_filename}.mp4"

        output_path = str(storage.storage_path / output_filename)

        VideoComposer.create_video_from_images(
            image_paths=image_paths,
            output_path=output_path,
            fps=request.fps,
            audio_path=audio_path
        )

        media_file = MediaFile(output_path)
        storage._save_metadata(media_file)

        return VideoCompositionResponse(
            success=True,
            message="Video composed successfully",
            output_path=output_path,
            media_info=media_file.get_info()
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
