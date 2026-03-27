from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.core.llm import get_llm_service

router = APIRouter()


class Message(BaseModel):
    role: str
    content: str


class CompletionRequest(BaseModel):
    messages: List[Message]
    provider: Optional[str] = None
    model: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = None
    use_fallback: bool = True


class CompletionResponse(BaseModel):
    content: str
    model: str
    provider: str
    is_fallback: bool
    usage: Dict[str, int]


class HealthCheckResponse(BaseModel):
    status: str
    provider: str
    connected: bool
    model: Optional[str] = None
    error: Optional[str] = None


@router.post("/completions", response_model=CompletionResponse)
async def create_completion(request: CompletionRequest):
    try:
        llm_service = get_llm_service()
        result = await llm_service.generate_completion(
            messages=[msg.model_dump() for msg in request.messages],
            provider=request.provider,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            use_fallback=request.use_fallback
        )
        return CompletionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health", response_model=HealthCheckResponse)
async def llm_health_check(provider: Optional[str] = None):
    try:
        llm_service = get_llm_service()
        result = await llm_service.check_connection(provider=provider)
        return HealthCheckResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
