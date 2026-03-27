from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid
from app.core.llm import get_llm_service, LLMService
from app.core.tools import get_tool_registry, ToolRegistry, BaseTool
import json


class Message:
    def __init__(self, role: str, content: str, timestamp: Optional[datetime] = None):
        self.role = role
        self.content = content
        self.timestamp = timestamp or datetime.now()
        self.id = str(uuid.uuid4())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat()
        }


class Conversation:
    def __init__(self, conversation_id: Optional[str] = None):
        self.conversation_id = conversation_id or str(uuid.uuid4())
        self.messages: List[Message] = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def add_message(self, role: str, content: str) -> Message:
        message = Message(role, content)
        self.messages.append(message)
        self.updated_at = datetime.now()
        return message

    def get_messages(self) -> List[Message]:
        return self.messages

    def to_dict(self) -> Dict[str, Any]:
        return {
            "conversation_id": self.conversation_id,
            "messages": [msg.to_dict() for msg in self.messages],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class ConversationStore:
    _conversations: Dict[str, Conversation] = {}

    @classmethod
    def create_conversation(cls, conversation_id: Optional[str] = None) -> Conversation:
        conversation = Conversation(conversation_id)
        cls._conversations[conversation.conversation_id] = conversation
        return conversation

    @classmethod
    def get_conversation(cls, conversation_id: str) -> Optional[Conversation]:
        return cls._conversations.get(conversation_id)

    @classmethod
    def get_or_create_conversation(cls, conversation_id: Optional[str] = None) -> Conversation:
        if conversation_id:
            conversation = cls.get_conversation(conversation_id)
            if conversation:
                return conversation
        return cls.create_conversation(conversation_id)

    @classmethod
    def list_conversations(cls) -> List[Dict[str, Any]]:
        return [
            {
                "conversation_id": conv.conversation_id,
                "created_at": conv.created_at.isoformat(),
                "updated_at": conv.updated_at.isoformat(),
                "message_count": len(conv.messages)
            }
            for conv in cls._conversations.values()
        ]

    @classmethod
    def delete_conversation(cls, conversation_id: str) -> bool:
        if conversation_id in cls._conversations:
            del cls._conversations[conversation_id]
            return True
        return False


class Agent:
    def __init__(
        self,
        llm_service: Optional[LLMService] = None,
        tool_registry: Optional[ToolRegistry] = None,
        system_prompt: Optional[str] = None
    ):
        self.llm_service = llm_service or get_llm_service()
        self.tool_registry = tool_registry or get_tool_registry()
        self.system_prompt = system_prompt or self._get_default_system_prompt()

    def _get_default_system_prompt(self) -> str:
        tools_description = "\n".join([
            f"- {tool.name}: {tool.description}"
            for tool in self.tool_registry.get_all_tools()
        ])
        return f"""You are a helpful AI assistant with access to the following tools:

{tools_description}

When you need to use a tool, respond with a JSON object in the following format:
{{
    "tool_call": {{
        "name": "tool_name",
        "parameters": {{
            "param1": "value1",
            "param2": "value2"
        }}
    }}
}}

Always use tools when appropriate. If no tool is needed, respond normally with text.
"""

    def _format_messages_for_llm(self, conversation: Conversation) -> List[Dict[str, str]]:
        messages = [{"role": "system", "content": self.system_prompt}]
        for msg in conversation.get_messages():
            messages.append({"role": msg.role, "content": msg.content})
        return messages

    async def _process_tool_call(self, tool_call: Dict[str, Any]) -> Dict[str, Any]:
        tool_name = tool_call.get("name")
        parameters = tool_call.get("parameters", {})

        tool = self.tool_registry.get_tool(tool_name)
        if not tool:
            return {"error": f"Tool not found: {tool_name}"}

        try:
            result = await tool.execute(**parameters)
            return {"tool": tool_name, "result": result}
        except Exception as e:
            return {"tool": tool_name, "error": str(e)}

    def _extract_tool_call(self, content: str) -> Optional[Dict[str, Any]]:
        try:
            parsed = json.loads(content)
            if isinstance(parsed, dict) and "tool_call" in parsed:
                return parsed["tool_call"]
        except json.JSONDecodeError:
            pass
        return None

    async def process_message(
        self,
        user_message: str,
        conversation_id: Optional[str] = None,
        use_tools: bool = True
    ) -> Dict[str, Any]:
        conversation = ConversationStore.get_or_create_conversation(conversation_id)
        conversation.add_message("user", user_message)

        llm_messages = self._format_messages_for_llm(conversation)

        try:
            response = await self.llm_service.generate_completion(
                messages=llm_messages,
                temperature=0.7
            )
            assistant_content = response["content"]

            tool_call = self._extract_tool_call(assistant_content) if use_tools else None

            tool_result = None
            if tool_call:
                tool_result = await self._process_tool_call(tool_call)
                
                tool_message = f"Tool execution result: {json.dumps(tool_result)}"
                conversation.add_message("assistant", assistant_content)
                conversation.add_message("user", tool_message)

                llm_messages = self._format_messages_for_llm(conversation)
                final_response = await self.llm_service.generate_completion(
                    messages=llm_messages,
                    temperature=0.7
                )
                assistant_content = final_response["content"]

            conversation.add_message("assistant", assistant_content)

            return {
                "conversation_id": conversation.conversation_id,
                "message": assistant_content,
                "tool_used": tool_call is not None,
                "tool_call": tool_call,
                "tool_result": tool_result,
                "usage": response.get("usage"),
                "model": response.get("model")
            }

        except Exception as e:
            error_message = f"Error processing message: {str(e)}"
            conversation.add_message("assistant", error_message)
            return {
                "conversation_id": conversation.conversation_id,
                "message": error_message,
                "error": str(e)
            }


_agent: Optional[Agent] = None


def get_agent() -> Agent:
    global _agent
    if _agent is None:
        _agent = Agent()
    return _agent
