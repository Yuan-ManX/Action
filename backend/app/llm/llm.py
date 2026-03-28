import os
from typing import Optional, List, Dict, Any
from litellm import completion, acompletion
from app.config.config import get_settings

settings = get_settings()


class LLMService:
    def __init__(self):
        self._setup_api_keys()

    def _setup_api_keys(self):
        if settings.ANTHROPIC_API_KEY:
            os.environ["ANTHROPIC_API_KEY"] = settings.ANTHROPIC_API_KEY
        if settings.OPENAI_API_KEY:
            os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

    def _get_model_for_provider(self, provider: str) -> str:
        if provider == "anthropic":
            return "claude-3-opus-20240229"
        elif provider == "openai":
            return "gpt-4"
        raise ValueError(f"Unsupported provider: {provider}")

    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        provider: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        use_fallback: bool = True
    ) -> Dict[str, Any]:
        primary_provider = provider or settings.LLM_DEFAULT_PROVIDER
        primary_model = model or (
            settings.LLM_DEFAULT_MODEL
            if provider is None
            else self._get_model_for_provider(primary_provider)
        )

        try:
            return await self._call_llm(
                messages=messages,
                provider=primary_provider,
                model=primary_model,
                temperature=temperature,
                max_tokens=max_tokens
            )
        except Exception as primary_error:
            if use_fallback:
                try:
                    fallback_provider = settings.LLM_FALLBACK_PROVIDER
                    fallback_model = settings.LLM_FALLBACK_MODEL
                    return await self._call_llm(
                        messages=messages,
                        provider=fallback_provider,
                        model=fallback_model,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        is_fallback=True
                    )
                except Exception as fallback_error:
                    raise Exception(f"Primary error: {str(primary_error)}. Fallback error: {str(fallback_error)}")
            raise primary_error

    async def _call_llm(
        self,
        messages: List[Dict[str, str]],
        provider: str,
        model: str,
        temperature: float,
        max_tokens: Optional[int],
        is_fallback: bool = False
    ) -> Dict[str, Any]:
        kwargs = {
            "model": model,
            "messages": messages,
            "temperature": temperature
        }

        if max_tokens:
            kwargs["max_tokens"] = max_tokens

        response = await acompletion(**kwargs)

        return {
            "content": response.choices[0].message.content,
            "model": model,
            "provider": provider,
            "is_fallback": is_fallback,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }

    async def check_connection(
        self,
        provider: Optional[str] = None
    ) -> Dict[str, Any]:
        target_provider = provider or settings.LLM_DEFAULT_PROVIDER
        test_message = [{"role": "user", "content": "Hi"}]

        try:
            result = await self.generate_completion(
                messages=test_message,
                provider=target_provider,
                use_fallback=False
            )
            return {
                "status": "ok",
                "provider": target_provider,
                "model": result["model"],
                "connected": True
            }
        except Exception as e:
            return {
                "status": "error",
                "provider": target_provider,
                "connected": False,
                "error": str(e)
            }

    def generate_completion_sync(
        self,
        messages: List[Dict[str, str]],
        provider: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        use_fallback: bool = True
    ) -> Dict[str, Any]:
        primary_provider = provider or settings.LLM_DEFAULT_PROVIDER
        primary_model = model or (
            settings.LLM_DEFAULT_MODEL
            if provider is None
            else self._get_model_for_provider(primary_provider)
        )

        try:
            return self._call_llm_sync(
                messages=messages,
                provider=primary_provider,
                model=primary_model,
                temperature=temperature,
                max_tokens=max_tokens
            )
        except Exception as primary_error:
            if use_fallback:
                try:
                    fallback_provider = settings.LLM_FALLBACK_PROVIDER
                    fallback_model = settings.LLM_FALLBACK_MODEL
                    return self._call_llm_sync(
                        messages=messages,
                        provider=fallback_provider,
                        model=fallback_model,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        is_fallback=True
                    )
                except Exception as fallback_error:
                    raise Exception(f"Primary error: {str(primary_error)}. Fallback error: {str(fallback_error)}")
            raise primary_error

    def _call_llm_sync(
        self,
        messages: List[Dict[str, str]],
        provider: str,
        model: str,
        temperature: float,
        max_tokens: Optional[int],
        is_fallback: bool = False
    ) -> Dict[str, Any]:
        kwargs = {
            "model": model,
            "messages": messages,
            "temperature": temperature
        }

        if max_tokens:
            kwargs["max_tokens"] = max_tokens

        response = completion(**kwargs)

        return {
            "content": response.choices[0].message.content,
            "model": model,
            "provider": provider,
            "is_fallback": is_fallback,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }


_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
