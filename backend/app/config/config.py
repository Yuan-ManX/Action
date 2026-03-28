from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional
import os


class Settings(BaseSettings):
    APP_NAME: str = "Dreamix API"
    DEBUG: bool = True
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000

    ANTHROPIC_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    LLM_DEFAULT_PROVIDER: str = "anthropic"
    LLM_DEFAULT_MODEL: str = "claude-3-opus-20240229"
    LLM_FALLBACK_PROVIDER: str = "openai"
    LLM_FALLBACK_MODEL: str = "gpt-4"

    MEDIA_STORAGE_PATH: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "storage", "media")
    MEDIA_MAX_FILE_SIZE: int = 100 * 1024 * 1024
    MEDIA_ALLOWED_TYPES: list = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm", "audio/mpeg", "audio/wav"]

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
