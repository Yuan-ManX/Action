import os
import uuid
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List, Any
from enum import Enum
from moviepy.editor import ImageSequenceClip, AudioFileClip, CompositeAudioClip
from PIL import Image
import aiofiles


class MediaType(Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    UNKNOWN = "unknown"


class MediaFile:
    def __init__(self, file_path: str, media_type: Optional[MediaType] = None):
        self.file_path = file_path
        self.filename = os.path.basename(file_path)
        self.media_type = media_type or self._detect_media_type()
        self.metadata = self._extract_metadata()

    def _detect_media_type(self) -> MediaType:
        ext = os.path.splitext(self.filename)[1].lower()
        if ext in [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"]:
            return MediaType.IMAGE
        elif ext in [".mp4", ".webm", ".avi", ".mov", ".mkv"]:
            return MediaType.VIDEO
        elif ext in [".mp3", ".wav", ".flac", ".aac", ".ogg"]:
            return MediaType.AUDIO
        return MediaType.UNKNOWN

    def _extract_metadata(self) -> Dict[str, Any]:
        metadata = {
            "filename": self.filename,
            "file_path": self.file_path,
            "media_type": self.media_type.value,
            "file_size": os.path.getsize(self.file_path) if os.path.exists(self.file_path) else 0,
            "created_at": datetime.now().isoformat()
        }

        if os.path.exists(self.file_path):
            if self.media_type == MediaType.IMAGE:
                try:
                    with Image.open(self.file_path) as img:
                        metadata["width"] = img.width
                        metadata["height"] = img.height
                        metadata["format"] = img.format
                        metadata["mode"] = img.mode
                except Exception:
                    pass
            elif self.media_type == MediaType.VIDEO:
                try:
                    from moviepy.editor import VideoFileClip
                    with VideoFileClip(self.file_path) as clip:
                        metadata["duration"] = clip.duration
                        metadata["fps"] = clip.fps
                        metadata["width"] = clip.size[0]
                        metadata["height"] = clip.size[1]
                except Exception:
                    pass
            elif self.media_type == MediaType.AUDIO:
                try:
                    from moviepy.editor import AudioFileClip
                    with AudioFileClip(self.file_path) as clip:
                        metadata["duration"] = clip.duration
                        metadata["fps"] = clip.fps
                except Exception:
                    pass

        return metadata

    def get_info(self) -> Dict[str, Any]:
        return self.metadata


class MediaStorage:
    def __init__(self, storage_path: str):
        self.storage_path = Path(storage_path)
        self.metadata_path = self.storage_path / "metadata"
        self._ensure_directories()

    def _ensure_directories(self):
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self.metadata_path.mkdir(parents=True, exist_ok=True)

    def _generate_unique_filename(self, original_filename: str) -> str:
        ext = os.path.splitext(original_filename)[1]
        unique_id = str(uuid.uuid4())
        return f"{unique_id}{ext}"

    async def save_file(self, file_content: bytes, filename: str) -> MediaFile:
        unique_filename = self._generate_unique_filename(filename)
        file_path = self.storage_path / unique_filename

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_content)

        media_file = MediaFile(str(file_path))
        self._save_metadata(media_file)
        return media_file

    def _save_metadata(self, media_file: MediaFile):
        metadata_file = self.metadata_path / f"{os.path.splitext(media_file.filename)[0]}.json"
        with open(metadata_file, "w") as f:
            json.dump(media_file.get_info(), f)

    def get_media_file(self, filename: str) -> Optional[MediaFile]:
        file_path = self.storage_path / filename
        if file_path.exists():
            return MediaFile(str(file_path))
        return None

    def list_media_files(self) -> List[MediaFile]:
        media_files = []
        for file_path in self.storage_path.iterdir():
            if file_path.is_file() and not file_path.name.startswith("."):
                media_files.append(MediaFile(str(file_path)))
        return media_files

    def delete_media_file(self, filename: str) -> bool:
        file_path = self.storage_path / filename
        metadata_file = self.metadata_path / f"{os.path.splitext(filename)[0]}.json"

        deleted = False
        if file_path.exists():
            file_path.unlink()
            deleted = True
        if metadata_file.exists():
            metadata_file.unlink()
        return deleted


class VideoComposer:
    @staticmethod
    def create_video_from_images(image_paths: List[str], output_path: str, fps: int = 24, audio_path: Optional[str] = None) -> str:
        clip = ImageSequenceClip(image_paths, fps=fps)
        
        if audio_path:
            audio_clip = AudioFileClip(audio_path)
            clip = clip.set_audio(audio_clip)
        
        clip.write_videofile(output_path, codec="libx264", audio_codec="aac")
        return output_path

    @staticmethod
    def add_audio_to_video(video_path: str, audio_path: str, output_path: str) -> str:
        from moviepy.editor import VideoFileClip
        video_clip = VideoFileClip(video_path)
        audio_clip = AudioFileClip(audio_path)
        final_clip = video_clip.set_audio(audio_clip)
        final_clip.write_videofile(output_path, codec="libx264", audio_codec="aac")
        return output_path


_media_storage_instance: Optional[MediaStorage] = None


def get_media_storage() -> MediaStorage:
    global _media_storage_instance
    from app.config.config import get_settings
    if _media_storage_instance is None:
        settings = get_settings()
        _media_storage_instance = MediaStorage(settings.MEDIA_STORAGE_PATH)
    return _media_storage_instance
