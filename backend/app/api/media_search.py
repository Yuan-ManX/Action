from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.core.media_search import (
    get_media_search_engine,
    MediaItem,
    MediaCollection,
    MediaType,
    MediaSource
)

router = APIRouter()


class AddMediaRequest(BaseModel):
    source: str = Field("user_upload", description="Media source: user_upload, stock_photo, stock_video, web_search")
    media_type: str = Field("image", description="Media type: image, video, audio")
    title: str = Field(..., description="Media title")
    description: Optional[str] = Field(None, description="Media description")
    url: Optional[str] = Field(None, description="Media URL")
    local_path: Optional[str] = Field(None, description="Local file path")
    tags: Optional[List[str]] = Field(None, description="Media tags")
    themes: Optional[List[str]] = Field(None, description="Media themes")
    width: Optional[int] = Field(None, description="Media width")
    height: Optional[int] = Field(None, description="Media height")
    duration: Optional[float] = Field(None, description="Media duration (for video/audio)")


class SearchMediaRequest(BaseModel):
    query: str = Field("", description="Search query")
    media_type: Optional[str] = Field(None, description="Filter by media type")
    source: Optional[str] = Field(None, description="Filter by source")
    tags: Optional[List[str]] = Field(None, description="Filter by tags")
    themes: Optional[List[str]] = Field(None, description="Filter by themes")
    limit: int = Field(20, description="Maximum number of results")


class CreateCollectionRequest(BaseModel):
    name: str = Field(..., description="Collection name")
    theme: str = Field(..., description="Collection theme")
    media_ids: Optional[List[str]] = Field(None, description="Media items to add to collection")


class AnalyzeMediaRequest(BaseModel):
    media_id: str = Field(..., description="Media ID to analyze")
    content_description: Optional[str] = Field(None, description="Additional content description for analysis")


@router.post("/add")
async def add_media(request: AddMediaRequest):
    try:
        engine = get_media_search_engine()
        
        try:
            source = MediaSource(request.source.lower())
        except ValueError:
            source = MediaSource.USER_UPLOAD
        
        try:
            media_type = MediaType(request.media_type.lower())
        except ValueError:
            media_type = MediaType.IMAGE
        
        item = MediaItem(
            source=source,
            media_type=media_type,
            title=request.title,
            description=request.description or "",
            url=request.url or "",
            local_path=request.local_path,
            tags=request.tags or [],
            themes=request.themes or [],
            width=request.width,
            height=request.height,
            duration=request.duration
        )
        
        media_id = engine.add_media(item)
        return {"media_id": media_id, "media": item.to_dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add media: {str(e)}")


@router.get("/{media_id}")
async def get_media(media_id: str):
    try:
        engine = get_media_search_engine()
        item = engine.get_media(media_id)
        
        if not item:
            raise HTTPException(status_code=404, detail="Media not found")
        
        return item.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get media: {str(e)}")


@router.post("/search")
async def search_media(request: SearchMediaRequest):
    try:
        engine = get_media_search_engine()
        
        media_type = None
        if request.media_type:
            try:
                media_type = MediaType(request.media_type.lower())
            except ValueError:
                pass
        
        source = None
        if request.source:
            try:
                source = MediaSource(request.source.lower())
            except ValueError:
                pass
        
        results = engine.search_media(
            query=request.query,
            media_type=media_type,
            source=source,
            tags=request.tags,
            themes=request.themes,
            limit=request.limit
        )
        
        return {
            "count": len(results),
            "results": [item.to_dict() for item in results]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search media: {str(e)}")


@router.post("/collections")
async def create_collection(request: CreateCollectionRequest):
    try:
        engine = get_media_search_engine()
        
        media_items = []
        if request.media_ids:
            for media_id in request.media_ids:
                item = engine.get_media(media_id)
                if item:
                    media_items.append(item)
        
        collection = engine.create_collection(
            name=request.name,
            theme=request.theme,
            media_items=media_items
        )
        
        return collection.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create collection: {str(e)}")


@router.get("/collections/{collection_id}")
async def get_collection(collection_id: str):
    try:
        engine = get_media_search_engine()
        collection = engine.get_collection(collection_id)
        
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        return collection.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get collection: {str(e)}")


@router.post("/analyze")
async def analyze_media(request: AnalyzeMediaRequest):
    try:
        engine = get_media_search_engine()
        item = engine.get_media(request.media_id)
        
        if not item:
            raise HTTPException(status_code=404, detail="Media not found")
        
        analyzed_item = await engine.analyze_and_tag(
            item=item,
            content_description=request.content_description
        )
        
        return analyzed_item.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze media: {str(e)}")


@router.get("/")
async def list_all_media():
    try:
        engine = get_media_search_engine()
        items = engine.list_all_media()
        return {
            "count": len(items),
            "media": [item.to_dict() for item in items]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list media: {str(e)}")


@router.get("/collections")
async def list_all_collections():
    try:
        engine = get_media_search_engine()
        collections = engine.list_all_collections()
        return {
            "count": len(collections),
            "collections": [
                {
                    "collection_id": c.collection_id,
                    "name": c.name,
                    "theme": c.theme,
                    "media_count": len(c.media_items),
                    "created_at": c.created_at.isoformat()
                }
                for c in collections
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list collections: {str(e)}")
