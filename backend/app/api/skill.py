from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.core.skill_system import (
    get_skill_system,
    Skill,
    WorkflowStep,
    SkillType,
    SkillDifficulty
)

router = APIRouter()


class CreateSkillRequest(BaseModel):
    name: str = Field(..., description="Name of the skill")
    description: str = Field(..., description="Description of the skill")
    skill_type: str = Field("complete", description="Skill type: editing, styling, effects, transitions, audio, complete")
    difficulty: str = Field("beginner", description="Skill difficulty: beginner, intermediate, advanced")
    tags: Optional[List[str]] = Field(None, description="Optional tags for the skill")
    author: str = Field("", description="Author of the skill")


class CreateSkillFromCaptureRequest(BaseModel):
    capture_id: str = Field(..., description="ID of the workflow capture")
    name: str = Field(..., description="Name of the skill")
    description: str = Field(..., description="Description of the skill")
    skill_type: str = Field("complete", description="Skill type")
    difficulty: str = Field("beginner", description="Skill difficulty")
    tags: Optional[List[str]] = Field(None, description="Optional tags")
    author: str = Field("", description="Author of the skill")


class ApplySkillRequest(BaseModel):
    skill_id: str = Field(..., description="ID of the skill to apply")
    target_media: Optional[Dict[str, Any]] = Field(None, description="Target media to apply skill to")
    override_parameters: Optional[Dict[str, Any]] = Field(None, description="Override parameters for the skill")


class SearchSkillsRequest(BaseModel):
    query: Optional[str] = Field(None, description="Search query")
    skill_type: Optional[str] = Field(None, description="Filter by skill type")
    difficulty: Optional[str] = Field(None, description="Filter by difficulty")
    tags: Optional[List[str]] = Field(None, description="Filter by tags")
    include_builtin: bool = Field(True, description="Include built-in skills")
    include_custom: bool = Field(True, description="Include custom skills")
    max_results: int = Field(20, description="Maximum number of results")


class SkillResponse(BaseModel):
    skill_id: str
    name: str
    description: str
    skill_type: str
    difficulty: str
    tags: List[str]
    workflow_steps: List[Dict[str, Any]]
    style_parameters: Dict[str, Any]
    is_builtin: bool
    author: str
    version: str
    created_at: str
    updated_at: str


@router.post("/create", response_model=SkillResponse)
async def create_skill(request: CreateSkillRequest):
    try:
        system = get_skill_system()
        
        skill = Skill(
            name=request.name,
            description=request.description,
            skill_type=SkillType(request.skill_type),
            difficulty=SkillDifficulty(request.difficulty),
            tags=request.tags,
            author=request.author
        )
        
        system.library.add_skill(skill)
        return SkillResponse(**skill.to_dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create skill: {str(e)}")


@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill(skill_id: str):
    try:
        system = get_skill_system()
        skill = system.library.get_skill(skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        return SkillResponse(**skill.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get skill: {str(e)}")


@router.get("/", response_model=List[SkillResponse])
async def list_skills():
    try:
        system = get_skill_system()
        skills = system.library.list_all_skills()
        return [SkillResponse(**s.to_dict()) for s in skills]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list skills: {str(e)}")


@router.post("/search", response_model=List[SkillResponse])
async def search_skills(request: SearchSkillsRequest):
    try:
        system = get_skill_system()
        
        skill_type = SkillType(request.skill_type) if request.skill_type else None
        difficulty = SkillDifficulty(request.difficulty) if request.difficulty else None
        
        skills = system.library.search_skills(
            query=request.query,
            skill_type=skill_type,
            difficulty=difficulty,
            tags=request.tags,
            include_builtin=request.include_builtin,
            include_custom=request.include_custom
        )
        
        return [SkillResponse(**s.to_dict()) for s in skills[:request.max_results]]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search skills: {str(e)}")


@router.post("/apply")
async def apply_skill(request: ApplySkillRequest):
    try:
        system = get_skill_system()
        skill = system.library.get_skill(request.skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        
        results = system.application.apply_skill(
            skill=skill,
            target_media=request.target_media,
            override_parameters=request.override_parameters
        )
        
        return results
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply skill: {str(e)}")


@router.post("/capture/create")
async def create_capture(capture_id: Optional[str] = None):
    try:
        system = get_skill_system()
        capture = system.create_capture(capture_id)
        return {
            "capture_id": capture.capture_id,
            "message": "Workflow capture created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create capture: {str(e)}")


@router.post("/capture/{capture_id}/start")
async def start_capture(capture_id: str):
    try:
        system = get_skill_system()
        success = system.start_capture(capture_id)
        if not success:
            raise HTTPException(status_code=404, detail="Capture not found")
        return {"message": "Workflow capture started successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start capture: {str(e)}")


@router.post("/capture/{capture_id}/end")
async def end_capture(capture_id: str):
    try:
        system = get_skill_system()
        success = system.end_capture(capture_id)
        if not success:
            raise HTTPException(status_code=404, detail="Capture not found")
        return {"message": "Workflow capture ended successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to end capture: {str(e)}")


@router.post("/capture/create-skill", response_model=SkillResponse)
async def create_skill_from_capture(request: CreateSkillFromCaptureRequest):
    try:
        system = get_skill_system()
        capture = system.get_capture(request.capture_id)
        if not capture:
            raise HTTPException(status_code=404, detail="Capture not found")
        
        skill = capture.create_skill(
            name=request.name,
            description=request.description,
            skill_type=SkillType(request.skill_type),
            difficulty=SkillDifficulty(request.difficulty),
            tags=request.tags,
            author=request.author
        )
        
        system.library.add_skill(skill)
        return SkillResponse(**skill.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create skill from capture: {str(e)}")


@router.post("/{skill_id}/save")
async def save_skill_to_file(skill_id: str, directory: str = "./skills"):
    try:
        system = get_skill_system()
        skill = system.library.get_skill(skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        
        file_path = system.save_skill_to_file(skill, directory)
        return {
            "message": "Skill saved successfully",
            "file_path": file_path
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save skill: {str(e)}")


@router.post("/load")
async def load_skill_from_file(file: UploadFile = File(...)):
    try:
        import tempfile
        system = get_skill_system()
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        skill = system.load_skill_from_file(tmp_path)
        if not skill:
            raise HTTPException(status_code=400, detail="Failed to load skill from file")
        
        import os
        os.unlink(tmp_path)
        
        return {
            "message": "Skill loaded successfully",
            "skill": SkillResponse(**skill.to_dict())
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load skill: {str(e)}")
