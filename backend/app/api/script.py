from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.core.script import get_script_generator, Script, ContentStyle

router = APIRouter()


class GenerateScriptRequest(BaseModel):
    theme: str = Field(..., description="The theme or topic of the video")
    title: Optional[str] = Field(None, description="Optional title for the video")
    style: str = Field("casual", description="Content style: casual, professional, humorous, dramatic, inspirational, educational")
    target_duration: float = Field(60.0, description="Target duration in seconds")


class RefineScriptRequest(BaseModel):
    script_id: str = Field(..., description="The ID of the script to refine")
    refinement_request: str = Field(..., description="The refinement request in natural language")


class ScriptResponse(BaseModel):
    script_id: str
    title: str
    theme: str
    style: str
    target_duration: float
    total_duration: float
    scenes: List[Dict[str, Any]]
    created_at: str
    updated_at: str


_script_store: Dict[str, Script] = {}


@router.post("/generate", response_model=ScriptResponse)
async def generate_script(request: GenerateScriptRequest):
    try:
        generator = get_script_generator()
        
        try:
            style = ContentStyle(request.style.lower())
        except ValueError:
            style = ContentStyle.CASUAL
        
        script = await generator.generate_script(
            theme=request.theme,
            style=style,
            target_duration=request.target_duration,
            title=request.title
        )
        
        _script_store[script.script_id] = script
        
        return ScriptResponse(**script.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate script: {str(e)}")


@router.get("/{script_id}", response_model=ScriptResponse)
async def get_script(script_id: str):
    try:
        script = _script_store.get(script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        
        return ScriptResponse(**script.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get script: {str(e)}")


@router.post("/{script_id}/refine", response_model=ScriptResponse)
async def refine_script(script_id: str, request: RefineScriptRequest):
    try:
        script = _script_store.get(script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        
        generator = get_script_generator()
        refined_script = await generator.refine_script(
            script=script,
            refinement_request=request.refinement_request
        )
        
        _script_store[refined_script.script_id] = refined_script
        
        return ScriptResponse(**refined_script.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refine script: {str(e)}")


@router.get("/")
async def list_scripts():
    try:
        return {
            "scripts": [
                {
                    "script_id": script.script_id,
                    "title": script.title,
                    "theme": script.theme,
                    "style": script.style.value,
                    "created_at": script.created_at.isoformat()
                }
                for script in _script_store.values()
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list scripts: {str(e)}")
