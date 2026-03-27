import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum
from app.core.llm import get_llm_service, LLMService


class MediaSource(Enum):
    USER_UPLOAD = "user_upload"
    STOCK_PHOTO = "stock_photo"
    STOCK_VIDEO = "stock_video"
    WEB_SEARCH = "web_search"


class MediaType(Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"


class MediaItem:
    def __init__(
        self,
        media_id: Optional[str] = None,
        source: MediaSource = MediaSource.USER_UPLOAD,
        media_type: MediaType = MediaType.IMAGE,
        title: str = "",
        description: str = "",
        url: str = "",
        local_path: Optional[str] = None,
        tags: Optional[List[str]] = None,
        themes: Optional[List[str]] = None,
        width: Optional[int] = None,
        height: Optional[int] = None,
        duration: Optional[float] = None,
        created_at: Optional[datetime] = None
    ):
        self.media_id = media_id or str(uuid.uuid4())
        self.source = source
        self.media_type = media_type
        self.title = title
        self.description = description
        self.url = url
        self.local_path = local_path
        self.tags = tags or []
        self.themes = themes or []
        self.width = width
        self.height = height
        self.duration = duration
        self.created_at = created_at or datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "media_id": self.media_id,
            "source": self.source.value,
            "media_type": self.media_type.value,
            "title": self.title,
            "description": self.description,
            "url": self.url,
            "local_path": self.local_path,
            "tags": self.tags,
            "themes": self.themes,
            "width": self.width,
            "height": self.height,
            "duration": self.duration,
            "created_at": self.created_at.isoformat()
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'MediaItem':
        return cls(
            media_id=data.get("media_id"),
            source=MediaSource(data.get("source", "user_upload")),
            media_type=MediaType(data.get("media_type", "image")),
            title=data.get("title", ""),
            description=data.get("description", ""),
            url=data.get("url", ""),
            local_path=data.get("local_path"),
            tags=data.get("tags", []),
            themes=data.get("themes", []),
            width=data.get("width"),
            height=data.get("height"),
            duration=data.get("duration"),
            created_at=datetime.fromisoformat(data["created_at"]) if data.get("created_at") else None
        )


class MediaCollection:
    def __init__(
        self,
        collection_id: Optional[str] = None,
        name: str = "",
        theme: str = "",
        media_items: Optional[List[MediaItem]] = None,
        created_at: Optional[datetime] = None
    ):
        self.collection_id = collection_id or str(uuid.uuid4())
        self.name = name
        self.theme = theme
        self.media_items = media_items or []
        self.created_at = created_at or datetime.now()

    def add_item(self, item: MediaItem) -> None:
        self.media_items.append(item)

    def get_all_tags(self) -> List[str]:
        tags = set()
        for item in self.media_items:
            tags.update(item.tags)
        return list(tags)

    def get_all_themes(self) -> List[str]:
        themes = set()
        for item in self.media_items:
            themes.update(item.themes)
        return list(themes)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "collection_id": self.collection_id,
            "name": self.name,
            "theme": self.theme,
            "media_items": [item.to_dict() for item in self.media_items],
            "all_tags": self.get_all_tags(),
            "all_themes": self.get_all_themes(),
            "created_at": self.created_at.isoformat()
        }


class MediaSearchEngine:
    def __init__(self, llm_service: Optional[LLMService] = None):
        self.llm_service = llm_service or get_llm_service()
        self._media_store: Dict[str, MediaItem] = {}
        self._collections: Dict[str, MediaCollection] = {}

    def add_media(self, item: MediaItem) -> str:
        self._media_store[item.media_id] = item
        return item.media_id

    def get_media(self, media_id: str) -> Optional[MediaItem]:
        return self._media_store.get(media_id)

    def search_media(
        self,
        query: str,
        media_type: Optional[MediaType] = None,
        source: Optional[MediaSource] = None,
        tags: Optional[List[str]] = None,
        themes: Optional[List[str]] = None,
        limit: int = 20
    ) -> List[MediaItem]:
        results = []
        
        for item in self._media_store.values():
            match = True
            
            if media_type and item.media_type != media_type:
                match = False
            if source and item.source != source:
                match = False
            if tags and not any(tag in item.tags for tag in tags):
                match = False
            if themes and not any(theme in item.themes for theme in themes):
                match = False
            
            if query:
                query_lower = query.lower()
                if not (query_lower in item.title.lower() or 
                       query_lower in item.description.lower() or
                       any(query_lower in tag.lower() for tag in item.tags) or
                       any(query_lower in theme.lower() for theme in item.themes)):
                    match = False
            
            if match:
                results.append(item)
        
        return results[:limit]

    def create_collection(
        self,
        name: str,
        theme: str,
        media_items: Optional[List[MediaItem]] = None
    ) -> MediaCollection:
        collection = MediaCollection(name=name, theme=theme, media_items=media_items)
        self._collections[collection.collection_id] = collection
        return collection

    def get_collection(self, collection_id: str) -> Optional[MediaCollection]:
        return self._collections.get(collection_id)

    def organize_by_theme(self, items: List[MediaItem]) -> Dict[str, List[MediaItem]]:
        theme_groups: Dict[str, List[MediaItem]] = {}
        
        for item in items:
            if not item.themes:
                if "uncategorized" not in theme_groups:
                    theme_groups["uncategorized"] = []
                theme_groups["uncategorized"].append(item)
            else:
                for theme in item.themes:
                    if theme not in theme_groups:
                        theme_groups[theme] = []
                    theme_groups[theme].append(item)
        
        return theme_groups

    async def analyze_and_tag(
        self,
        item: MediaItem,
        content_description: Optional[str] = None
    ) -> MediaItem:
        system_prompt = """You are a media curator. Analyze the given media description and provide:
1. 5-10 relevant tags (keywords)
2. 2-3 theme categories
3. A brief description (if not provided)

Respond with JSON in the following format:
{
    "tags": ["tag1", "tag2", "tag3"],
    "themes": ["theme1", "theme2"],
    "description": "Brief description of the media"
}"""

        user_content = f"Media title: {item.title}\n"
        if content_description:
            user_content += f"Description: {content_description}\n"
        if item.description:
            user_content += f"Existing description: {item.description}\n"

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]

        try:
            response = await self.llm_service.generate_completion(
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )

            analysis = self._parse_analysis_response(response["content"])
            
            if analysis.get("tags"):
                item.tags = list(set(item.tags + analysis["tags"]))
            if analysis.get("themes"):
                item.themes = list(set(item.themes + analysis["themes"]))
            if analysis.get("description") and not item.description:
                item.description = analysis["description"]
                
        except Exception:
            pass
        
        return item

    def _parse_analysis_response(self, content: str) -> Dict[str, Any]:
        try:
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            if json_start != -1 and json_end != -1:
                json_str = content[json_start:json_end]
                import json
                return json.loads(json_str)
        except Exception:
            pass
        
        return {
            "tags": [],
            "themes": [],
            "description": ""
        }

    def list_all_media(self) -> List[MediaItem]:
        return list(self._media_store.values())

    def list_all_collections(self) -> List[MediaCollection]:
        return list(self._collections.values())


_media_search_engine: Optional[MediaSearchEngine] = None


def get_media_search_engine() -> MediaSearchEngine:
    global _media_search_engine
    if _media_search_engine is None:
        _media_search_engine = MediaSearchEngine()
    return _media_search_engine
