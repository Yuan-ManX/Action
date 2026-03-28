import uuid
import json
from datetime import datetime
from typing import Optional, List, Dict, Any, Union
from enum import Enum
from pathlib import Path
import asyncio

try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False


class MediaType(Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"


class MediaQuality(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    ORIGINAL = "original"


class ASRResult:
    def __init__(
        self,
        segments: Optional[List[Dict[str, Any]]] = None,
        text: str = "",
        language: str = "",
        segments_with_timestamps: Optional[List[Dict[str, Any]]] = None
    ):
        self.segments = segments or []
        self.text = text
        self.language = language
        self.segments_with_timestamps = segments_with_timestamps or []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "text": self.text,
            "language": self.language,
            "segments": self.segments,
            "segments_with_timestamps": self.segments_with_timestamps
        }


class SpeechProcessingSystem:
    def __init__(self, model_size: str = "base"):
        self.model_size = model_size
        self._model = None
        self._model_loaded = False

    async def load_model(self):
        if not WHISPER_AVAILABLE:
            raise ImportError("Whisper is not installed. Please install it with: pip install openai-whisper")
        
        if not self._model_loaded:
            loop = asyncio.get_event_loop()
            self._model = await loop.run_in_executor(None, lambda: whisper.load_model(self.model_size))
            self._model_loaded = True

    async def transcribe_audio(
        self,
        audio_path: str,
        language: Optional[str] = None,
        task: str = "transcribe"
    ) -> ASRResult:
        await self.load_model()
        
        loop = asyncio.get_event_loop()
        
        def _transcribe():
            result = self._model.transcribe(
                audio_path,
                language=language,
                task=task,
                word_timestamps=True
            )
            return result
        
        result = await loop.run_in_executor(None, _transcribe)
        
        segments = []
        segments_with_timestamps = []
        
        for segment in result.get("segments", []):
            segment_data = {
                "id": segment.get("id"),
                "start": segment.get("start"),
                "end": segment.get("end"),
                "text": segment.get("text", "").strip()
            }
            segments.append(segment_data)
            
            words = segment.get("words", [])
            if words:
                for word in words:
                    segments_with_timestamps.append({
                        "word": word.get("word", "").strip(),
                        "start": word.get("start"),
                        "end": word.get("end")
                    })
        
        return ASRResult(
            segments=segments,
            text=result.get("text", "").strip(),
            language=result.get("language", ""),
            segments_with_timestamps=segments_with_timestamps
        )


class SpeechCleaner:
    FILLER_WORDS = {
        "um", "uh", "er", "ah", "like", "you know", "i mean", "sort of",
        "kind of", "okay", "so", "well", "basically", "actually", "literally",
        "right", "yeah", "hm", "hmm", "mmm", "em", "eh"
    }
    
    DISFLUENCIES = ["uh", "um", "er", "ah", "hm", "hmm"]
    
    @classmethod
    def clean_transcript(cls, transcript: str) -> str:
        words = transcript.lower().split()
        cleaned_words = []
        
        i = 0
        while i < len(words):
            word = words[i].strip('.,!?')
            
            if word in cls.FILLER_WORDS:
                i += 1
                continue
            
            if i > 0 and word == words[i-1].strip('.,!?'):
                i += 1
                continue
            
            cleaned_words.append(words[i])
            i += 1
        
        return ' '.join(cleaned_words)
    
    @classmethod
    def identify_segments_to_remove(
        cls,
        segments: List[Dict[str, Any]],
        remove_fillers: bool = True,
        remove_repeats: bool = True,
        remove_disfluencies: bool = True
    ) -> List[Dict[str, float]]:
        segments_to_remove = []
        
        for segment in segments:
            text = segment.get("text", "").lower().strip()
            words = text.split()
            
            should_remove = False
            
            if remove_fillers:
                if all(word.strip('.,!?') in cls.FILLER_WORDS for word in words):
                    should_remove = True
            
            if remove_disfluencies and not should_remove:
                if all(word.strip('.,!?') in cls.DISFLUENCIES for word in words):
                    should_remove = True
            
            if should_remove:
                segments_to_remove.append({
                    "start": segment.get("start"),
                    "end": segment.get("end"),
                    "reason": "filler_or_disfluency",
                    "text": segment.get("text")
                })
        
        return segments_to_remove


class RoughCutGenerator:
    def __init__(self):
        self.speech_cleaner = SpeechCleaner()
    
    async def generate_rough_cut(
        self,
        audio_path: str,
        asr_result: ASRResult,
        remove_fillers: bool = True,
        remove_repeats: bool = True,
        remove_disfluencies: bool = True,
        min_segment_duration: float = 0.5
    ) -> Dict[str, Any]:
        segments_to_remove = self.speech_cleaner.identify_segments_to_remove(
            asr_result.segments,
            remove_fillers=remove_fillers,
            remove_repeats=remove_repeats,
            remove_disfluencies=remove_disfluencies
        )
        
        kept_segments = []
        prev_end = 0.0
        
        for segment in asr_result.segments:
            start = segment.get("start", 0)
            end = segment.get("end", 0)
            
            is_removed = any(
                rem["start"] <= start and rem["end"] >= end
                for rem in segments_to_remove
            )
            
            if not is_removed and (end - start) >= min_segment_duration:
                kept_segments.append({
                    "original_start": start,
                    "original_end": end,
                    "text": segment.get("text"),
                    "new_start": prev_end,
                    "new_end": prev_end + (end - start)
                })
                prev_end += (end - start)
        
        cleaned_transcript = self.speech_cleaner.clean_transcript(asr_result.text)
        
        return {
            "original_duration": asr_result.segments[-1].get("end", 0) if asr_result.segments else 0,
            "rough_cut_duration": prev_end,
            "segments_removed": len(segments_to_remove),
            "segments_kept": len(kept_segments),
            "kept_segments": kept_segments,
            "removed_segments": segments_to_remove,
            "cleaned_transcript": cleaned_transcript,
            "original_transcript": asr_result.text
        }


class EnhancedMediaAsset:
    def __init__(
        self,
        asset_id: Optional[str] = None,
        file_path: str = "",
        media_type: MediaType = MediaType.IMAGE,
        metadata: Optional[Dict[str, Any]] = None,
        tags: Optional[List[str]] = None,
        quality: MediaQuality = MediaQuality.ORIGINAL,
        created_at: Optional[datetime] = None
    ):
        self.asset_id = asset_id or str(uuid.uuid4())
        self.file_path = file_path
        self.media_type = media_type
        self.metadata = metadata or {}
        self.tags = tags or []
        self.quality = quality
        self.created_at = created_at or datetime.now()
        self.content_description: str = ""
        self.sentiment: Optional[str] = None
        self.dominant_colors: List[str] = []
        self.asr_result: Optional[ASRResult] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "asset_id": self.asset_id,
            "file_path": self.file_path,
            "media_type": self.media_type.value,
            "metadata": self.metadata,
            "tags": self.tags,
            "quality": self.quality.value,
            "created_at": self.created_at.isoformat(),
            "content_description": self.content_description,
            "sentiment": self.sentiment,
            "dominant_colors": self.dominant_colors,
            "asr_result": self.asr_result.to_dict() if self.asr_result else None
        }


class EnhancedMediaLibrary:
    def __init__(self):
        self.assets: Dict[str, EnhancedMediaAsset] = {}
        self.tags_index: Dict[str, List[str]] = {}
        self.type_index: Dict[MediaType, List[str]] = {}

    def add_asset(self, asset: EnhancedMediaAsset) -> None:
        self.assets[asset.asset_id] = asset
        
        for tag in asset.tags:
            if tag not in self.tags_index:
                self.tags_index[tag] = []
            if asset.asset_id not in self.tags_index[tag]:
                self.tags_index[tag].append(asset.asset_id)
        
        if asset.media_type not in self.type_index:
            self.type_index[asset.media_type] = []
        if asset.asset_id not in self.type_index[asset.media_type]:
            self.type_index[asset.media_type].append(asset.asset_id)

    def get_asset(self, asset_id: str) -> Optional[EnhancedMediaAsset]:
        return self.assets.get(asset_id)

    def search_assets(
        self,
        query: Optional[str] = None,
        media_type: Optional[MediaType] = None,
        tags: Optional[List[str]] = None,
        sentiment: Optional[str] = None,
        limit: int = 50
    ) -> List[EnhancedMediaAsset]:
        results = list(self.assets.values())
        
        if media_type:
            results = [a for a in results if a.media_type == media_type]
        
        if tags:
            results = [a for a in results if any(tag in a.tags for tag in tags)]
        
        if sentiment:
            results = [a for a in results if a.sentiment == sentiment]
        
        if query:
            query_lower = query.lower()
            results = [
                a for a in results
                if query_lower in a.content_description.lower() or
                   query_lower in ' '.join(a.tags).lower()
            ]
        
        return results[:limit]

    def get_all_assets(self) -> List[EnhancedMediaAsset]:
        return list(self.assets.values())


_speech_system: Optional[SpeechProcessingSystem] = None
_media_library: Optional[EnhancedMediaLibrary] = None
_rough_cut_generator: Optional[RoughCutGenerator] = None


def get_speech_system() -> SpeechProcessingSystem:
    global _speech_system
    if _speech_system is None:
        _speech_system = SpeechProcessingSystem()
    return _speech_system


def get_enhanced_media_library() -> EnhancedMediaLibrary:
    global _media_library
    if _media_library is None:
        _media_library = EnhancedMediaLibrary()
    return _media_library


def get_rough_cut_generator() -> RoughCutGenerator:
    global _rough_cut_generator
    if _rough_cut_generator is None:
        _rough_cut_generator = RoughCutGenerator()
    return _rough_cut_generator
