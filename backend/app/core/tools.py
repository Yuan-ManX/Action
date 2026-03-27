from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Callable
import json


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
        return {"echo": message, "timestamp": "now"}


_tool_registry: Optional[ToolRegistry] = None


def get_tool_registry() -> ToolRegistry:
    global _tool_registry
    if _tool_registry is None:
        _tool_registry = ToolRegistry()
        _tool_registry.register(CalculatorTool())
        _tool_registry.register(StringManipulationTool())
        _tool_registry.register(EchoTool())
    return _tool_registry
