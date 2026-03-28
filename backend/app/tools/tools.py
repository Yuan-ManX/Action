from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import json
import os
import subprocess
from pathlib import Path
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
import aiofiles


class BaseTool(ABC):
    name: str
    description: str
    parameters: Dict[str, Any]

    @abstractmethod
    async def execute(self, **kwargs) -> Any:
        pass

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters
        }


class ToolRegistry:
    _tools: Dict[str, BaseTool] = {}

    @classmethod
    def register(cls, tool: BaseTool) -> None:
        cls._tools[tool.name] = tool

    @classmethod
    def unregister(cls, tool_name: str) -> None:
        if tool_name in cls._tools:
            del cls._tools[tool_name]

    @classmethod
    def get_tool(cls, tool_name: str) -> Optional[BaseTool]:
        return cls._tools.get(tool_name)

    @classmethod
    def list_tools(cls) -> List[Dict[str, Any]]:
        return [tool.to_dict() for tool in cls._tools.values()]

    @classmethod
    def get_all_tools(cls) -> List[BaseTool]:
        return list(cls._tools.values())


class CalculatorTool(BaseTool):
    name = "calculator"
    description = "Perform basic arithmetic calculations"
    parameters = {
        "type": "object",
        "properties": {
            "operation": {
                "type": "string",
                "enum": ["add", "subtract", "multiply", "divide"],
                "description": "The arithmetic operation to perform"
            },
            "a": {
                "type": "number",
                "description": "First number"
            },
            "b": {
                "type": "number",
                "description": "Second number"
            }
        },
        "required": ["operation", "a", "b"]
    }

    async def execute(self, operation: str, a: float, b: float) -> Dict[str, Any]:
        try:
            if operation == "add":
                result = a + b
            elif operation == "subtract":
                result = a - b
            elif operation == "multiply":
                result = a * b
            elif operation == "divide":
                if b == 0:
                    return {"error": "Division by zero"}
                result = a / b
            else:
                return {"error": f"Unknown operation: {operation}"}
            return {"result": result}
        except Exception as e:
            return {"error": str(e)}


class StringManipulationTool(BaseTool):
    name = "string_manipulator"
    description = "Perform string manipulation operations"
    parameters = {
        "type": "object",
        "properties": {
            "operation": {
                "type": "string",
                "enum": ["uppercase", "lowercase", "reverse", "count", "length"],
                "description": "The string operation to perform"
            },
            "text": {
                "type": "string",
                "description": "Input text to process"
            },
            "substring": {
                "type": "string",
                "description": "Substring to count (for count operation)"
            }
        },
        "required": ["operation", "text"]
    }

    async def execute(self, operation: str, text: str, substring: Optional[str] = None) -> Dict[str, Any]:
        try:
            if operation == "uppercase":
                result = text.upper()
            elif operation == "lowercase":
                result = text.lower()
            elif operation == "reverse":
                result = text[::-1]
            elif operation == "count":
                if not substring:
                    return {"error": "substring is required for count operation"}
                result = text.count(substring)
            elif operation == "length":
                result = len(text)
            else:
                return {"error": f"Unknown operation: {operation}"}
            return {"result": result, "original_text": text}
        except Exception as e:
            return {"error": str(e)}


class EchoTool(BaseTool):
    name = "echo"
    description = "Echo back the input message"
    parameters = {
        "type": "object",
        "properties": {
            "message": {
                "type": "string",
                "description": "Message to echo"
            }
        },
        "required": ["message"]
    }

    async def execute(self, message: str) -> Dict[str, Any]:
        return {"echo": message, "timestamp": datetime.now().isoformat()}


class WebSearchTool(BaseTool):
    name = "web_search"
    description = "Search the web for information using DuckDuckGo"
    parameters = {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query"
            },
            "max_results": {
                "type": "integer",
                "description": "Maximum number of results to return",
                "default": 5
            }
        },
        "required": ["query"]
    }

    async def execute(self, query: str, max_results: int = 5) -> Dict[str, Any]:
        try:
            results = []
            with DDGS() as ddgs:
                for r in ddgs.text(query, max_results=max_results):
                    results.append({
                        "title": r.get("title", ""),
                        "href": r.get("href", ""),
                        "body": r.get("body", "")
                    })
            return {"query": query, "results": results}
        except Exception as e:
            return {"error": str(e)}


class WebScraperTool(BaseTool):
    name = "web_scraper"
    description = "Extract content from a web page"
    parameters = {
        "type": "object",
        "properties": {
            "url": {
                "type": "string",
                "description": "URL of the web page to scrape"
            },
            "selector": {
                "type": "string",
                "description": "CSS selector for specific elements (optional)"
            }
        },
        "required": ["url"]
    }

    async def execute(self, url: str, selector: Optional[str] = None) -> Dict[str, Any]:
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, "html.parser")
            
            if selector:
                elements = soup.select(selector)
                content = [elem.get_text(strip=True) for elem in elements]
            else:
                title = soup.title.string if soup.title else ""
                paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
                content = {
                    "title": title,
                    "paragraphs": paragraphs[:20]
                }
            
            return {"url": url, "content": content}
        except Exception as e:
            return {"error": str(e)}


class FileManagerTool(BaseTool):
    name = "file_manager"
    description = "Manage files and directories"
    parameters = {
        "type": "object",
        "properties": {
            "operation": {
                "type": "string",
                "enum": ["list", "read", "write", "delete", "mkdir"],
                "description": "File operation to perform"
            },
            "path": {
                "type": "string",
                "description": "File or directory path"
            },
            "content": {
                "type": "string",
                "description": "Content to write (for write operation)"
            }
        },
        "required": ["operation", "path"]
    }

    async def execute(self, operation: str, path: str, content: Optional[str] = None) -> Dict[str, Any]:
        try:
            file_path = Path(path)
            
            if operation == "list":
                if not file_path.exists():
                    return {"error": "Path does not exist"}
                items = []
                for item in file_path.iterdir():
                    items.append({
                        "name": item.name,
                        "type": "directory" if item.is_dir() else "file",
                        "size": item.stat().st_size if item.is_file() else 0
                    })
                return {"path": path, "items": items}
            
            elif operation == "read":
                if not file_path.exists() or not file_path.is_file():
                    return {"error": "File does not exist"}
                async with aiofiles.open(file_path, "r", encoding="utf-8") as f:
                    file_content = await f.read()
                return {"path": path, "content": file_content}
            
            elif operation == "write":
                file_path.parent.mkdir(parents=True, exist_ok=True)
                async with aiofiles.open(file_path, "w", encoding="utf-8") as f:
                    await f.write(content or "")
                return {"path": path, "status": "written"}
            
            elif operation == "delete":
                if not file_path.exists():
                    return {"error": "Path does not exist"}
                if file_path.is_file():
                    file_path.unlink()
                else:
                    import shutil
                    shutil.rmtree(file_path)
                return {"path": path, "status": "deleted"}
            
            elif operation == "mkdir":
                file_path.mkdir(parents=True, exist_ok=True)
                return {"path": path, "status": "created"}
            
            return {"error": f"Unknown operation: {operation}"}
        except Exception as e:
            return {"error": str(e)}


class CommandExecutorTool(BaseTool):
    name = "command_executor"
    description = "Execute shell commands (use with caution)"
    parameters = {
        "type": "object",
        "properties": {
            "command": {
                "type": "string",
                "description": "Command to execute"
            },
            "timeout": {
                "type": "integer",
                "description": "Timeout in seconds",
                "default": 30
            }
        },
        "required": ["command"]
    }

    async def execute(self, command: str, timeout: int = 30) -> Dict[str, Any]:
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            return {
                "command": command,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
        except subprocess.TimeoutExpired:
            return {"error": "Command timed out"}
        except Exception as e:
            return {"error": str(e)}


class DataAnalysisTool(BaseTool):
    name = "data_analysis"
    description = "Perform basic data analysis operations"
    parameters = {
        "type": "object",
        "properties": {
            "operation": {
                "type": "string",
                "enum": ["sum", "average", "median", "min", "max", "count"],
                "description": "Analysis operation to perform"
            },
            "data": {
                "type": "array",
                "items": {"type": "number"},
                "description": "List of numbers to analyze"
            }
        },
        "required": ["operation", "data"]
    }

    async def execute(self, operation: str, data: List[float]) -> Dict[str, Any]:
        try:
            if not data:
                return {"error": "No data provided"}
            
            if operation == "sum":
                result = sum(data)
            elif operation == "average":
                result = sum(data) / len(data)
            elif operation == "median":
                sorted_data = sorted(data)
                n = len(sorted_data)
                mid = n // 2
                if n % 2 == 0:
                    result = (sorted_data[mid-1] + sorted_data[mid]) / 2
                else:
                    result = sorted_data[mid]
            elif operation == "min":
                result = min(data)
            elif operation == "max":
                result = max(data)
            elif operation == "count":
                result = len(data)
            else:
                return {"error": f"Unknown operation: {operation}"}
            
            return {"operation": operation, "result": result, "data_points": len(data)}
        except Exception as e:
            return {"error": str(e)}


class MediaSearchTool(BaseTool):
    name = "media_search"
    description = "Search for images and videos online"
    parameters = {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query for media"
            },
            "media_type": {
                "type": "string",
                "enum": ["images", "videos", "all"],
                "description": "Type of media to search for",
                "default": "all"
            },
            "max_results": {
                "type": "integer",
                "description": "Maximum number of results",
                "default": 10
            }
        },
        "required": ["query"]
    }

    async def execute(self, query: str, media_type: str = "all", max_results: int = 10) -> Dict[str, Any]:
        try:
            results = {
                "query": query,
                "media_type": media_type,
                "images": [],
                "videos": []
            }
            
            with DDGS() as ddgs:
                if media_type in ["images", "all"]:
                    for r in ddgs.images(query, max_results=max_results):
                        results["images"].append({
                            "title": r.get("title", ""),
                            "image": r.get("image", ""),
                            "thumbnail": r.get("thumbnail", ""),
                            "url": r.get("url", "")
                        })
                
                if media_type in ["videos", "all"]:
                    for r in ddgs.videos(query, max_results=max_results):
                        results["videos"].append({
                            "title": r.get("title", ""),
                            "content": r.get("content", ""),
                            "thumbnail": r.get("thumbnail", ""),
                            "url": r.get("url", "")
                        })
            
            return results
        except Exception as e:
            return {"error": str(e)}


_tool_registry: Optional[ToolRegistry] = None


def get_tool_registry() -> ToolRegistry:
    global _tool_registry
    if _tool_registry is None:
        _tool_registry = ToolRegistry()
        _tool_registry.register(CalculatorTool())
        _tool_registry.register(StringManipulationTool())
        _tool_registry.register(EchoTool())
        _tool_registry.register(WebSearchTool())
        _tool_registry.register(WebScraperTool())
        _tool_registry.register(FileManagerTool())
        _tool_registry.register(CommandExecutorTool())
        _tool_registry.register(DataAnalysisTool())
        _tool_registry.register(MediaSearchTool())
    return _tool_registry
