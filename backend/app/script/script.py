import uuid
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum
from app.llm.llm import get_llm_service, LLMService


class SceneType(Enum):
    INTRO = "intro"
    MAIN = "main"
    TRANSITION = "transition"
    OUTRO = "outro"


class ContentStyle(Enum):
    CASUAL = "casual"
    PROFESSIONAL = "professional"
    HUMOROUS = "humorous"
    DRAMATIC = "dramatic"
    INSPIRATIONAL = "inspirational"
    EDUCATIONAL = "educational"


class Scene:
    def __init__(
        self,
        scene_id: Optional[str] = None,
        scene_type: SceneType = SceneType.MAIN,
        title: str = "",
        description: str = "",
        narration: str = "",
        duration: float = 5.0,
        visual_suggestions: Optional[List[str]] = None,
        media_requirements: Optional[List[str]] = None
    ):
        self.scene_id = scene_id or str(uuid.uuid4())
        self.scene_type = scene_type
        self.title = title
        self.description = description
        self.narration = narration
        self.duration = duration
        self.visual_suggestions = visual_suggestions or []
        self.media_requirements = media_requirements or []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "scene_id": self.scene_id,
            "scene_type": self.scene_type.value,
            "title": self.title,
            "description": self.description,
            "narration": self.narration,
            "duration": self.duration,
            "visual_suggestions": self.visual_suggestions,
            "media_requirements": self.media_requirements
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Scene':
        return cls(
            scene_id=data.get("scene_id"),
            scene_type=SceneType(data.get("scene_type", "main")),
            title=data.get("title", ""),
            description=data.get("description", ""),
            narration=data.get("narration", ""),
            duration=data.get("duration", 5.0),
            visual_suggestions=data.get("visual_suggestions", []),
            media_requirements=data.get("media_requirements", [])
        )


class Script:
    def __init__(
        self,
        script_id: Optional[str] = None,
        title: str = "",
        theme: str = "",
        style: ContentStyle = ContentStyle.CASUAL,
        target_duration: float = 60.0,
        scenes: Optional[List[Scene]] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.script_id = script_id or str(uuid.uuid4())
        self.title = title
        self.theme = theme
        self.style = style
        self.target_duration = target_duration
        self.scenes = scenes or []
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()

    def add_scene(self, scene: Scene) -> None:
        self.scenes.append(scene)
        self.updated_at = datetime.now()

    def get_total_duration(self) -> float:
        return sum(scene.duration for scene in self.scenes)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "script_id": self.script_id,
            "title": self.title,
            "theme": self.theme,
            "style": self.style.value,
            "target_duration": self.target_duration,
            "total_duration": self.get_total_duration(),
            "scenes": [scene.to_dict() for scene in self.scenes],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Script':
        scenes = [Scene.from_dict(scene_data) for scene_data in data.get("scenes", [])]
        return cls(
            script_id=data.get("script_id"),
            title=data.get("title", ""),
            theme=data.get("theme", ""),
            style=ContentStyle(data.get("style", "casual")),
            target_duration=data.get("target_duration", 60.0),
            scenes=scenes,
            created_at=datetime.fromisoformat(data["created_at"]) if data.get("created_at") else None,
            updated_at=datetime.fromisoformat(data["updated_at"]) if data.get("updated_at") else None
        )


class ScriptGenerator:
    def __init__(self, llm_service: Optional[LLMService] = None):
        self.llm_service = llm_service or get_llm_service()
        self._style_examples = self._initialize_style_examples()

    def _initialize_style_examples(self) -> Dict[ContentStyle, str]:
        return {
            ContentStyle.CASUAL: """
Example of casual style:
"Hey there! Let me tell you about this amazing product..."
"Okay, so here's the thing..."
"Pretty cool, right?"
""",
            ContentStyle.PROFESSIONAL: """
Example of professional style:
"Welcome to our comprehensive overview..."
"In this analysis, we will examine..."
"Based on our findings, we recommend..."
""",
            ContentStyle.HUMOROUS: """
Example of humorous style:
"Let's be real, who hasn't wondered about this?"
"Picture this: you're trying to [something], and then bam!"
"Trust me, I've been there..."
""",
            ContentStyle.DRAMATIC: """
Example of dramatic style:
"There was a moment when everything changed..."
"Little did they know what was about to happen..."
"This is the story of how..."
""",
            ContentStyle.INSPIRATIONAL: """
Example of inspirational style:
"Every great journey begins with a single step..."
"Imagine what you could achieve if..."
"You have the power to..."
""",
            ContentStyle.EDUCATIONAL: """
Example of educational style:
"Let's start by understanding the basics..."
"First, let's define what we mean by..."
"Now that we've covered that, let's move on to..."
"""
        }

    def _get_system_prompt(self, style: ContentStyle, theme: str, target_duration: float) -> str:
        style_example = self._style_examples.get(style, self._style_examples[ContentStyle.CASUAL])
        
        return f"""You are a professional video script writer. Create an engaging video script based on the following requirements.

Theme: {theme}
Target Duration: {target_duration} seconds
Content Style: {style.value}

{style_example}

Please create a script with the following structure:
1. Title - A catchy title for the video
2. Intro scene - Hook the viewer and introduce the topic
3. Main scenes - 3-5 scenes that develop the main content
4. Outro scene - Wrap up and provide a call to action

Each scene should include:
- Scene title
- Scene description (what the viewer sees)
- Narration (what the voiceover says)
- Duration (in seconds)
- Visual suggestions (what visuals to use)
- Media requirements (what images/videos are needed)

Respond with a JSON object in the following format:
{{
    "title": "Video title",
    "scenes": [
        {{
            "scene_type": "intro|main|transition|outro",
            "title": "Scene title",
            "description": "What happens in this scene",
            "narration": "The voiceover text",
            "duration": 5.0,
            "visual_suggestions": ["suggestion1", "suggestion2"],
            "media_requirements": ["image1.jpg", "video1.mp4"]
        }}
    ]
}}"""

    async def generate_script(
        self,
        theme: str,
        style: ContentStyle = ContentStyle.CASUAL,
        target_duration: float = 60.0,
        title: Optional[str] = None
    ) -> Script:
        system_prompt = self._get_system_prompt(style, theme, target_duration)
        user_prompt = f"Create a video script about: {theme}"
        
        if title:
            user_prompt += f"\nPlease use this title: {title}"

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        response = await self.llm_service.generate_completion(
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )

        script_data = self._parse_script_response(response["content"])
        
        script = Script(
            title=script_data.get("title", title or f"Video about {theme}"),
            theme=theme,
            style=style,
            target_duration=target_duration
        )

        for scene_data in script_data.get("scenes", []):
            scene = Scene.from_dict(scene_data)
            script.add_scene(scene)

        return script

    def _parse_script_response(self, content: str) -> Dict[str, Any]:
        try:
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            if json_start != -1 and json_end != -1:
                json_str = content[json_start:json_end]
                return json.loads(json_str)
        except Exception:
            pass
        
        return {
            "title": "Generated Script",
            "scenes": [
                {
                    "scene_type": "intro",
                    "title": "Introduction",
                    "description": "Introduction to the topic",
                    "narration": content[:500] if len(content) > 500 else content,
                    "duration": 10.0,
                    "visual_suggestions": ["Opening visuals"],
                    "media_requirements": []
                }
            ]
        }

    async def refine_script(
        self,
        script: Script,
        refinement_request: str
    ) -> Script:
        current_script_json = json.dumps(script.to_dict(), indent=2)
        
        system_prompt = f"""You are a professional script editor. Refine the given video script based on the user's request.

Current Script:
{current_script_json}

Please refine the script and return it in the same JSON format."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": refinement_request}
        ]

        response = await self.llm_service.generate_completion(
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )

        refined_data = self._parse_script_response(response["content"])
        
        refined_script = Script(
            script_id=script.script_id,
            title=refined_data.get("title", script.title),
            theme=script.theme,
            style=script.style,
            target_duration=script.target_duration
        )

        for scene_data in refined_data.get("scenes", script.scenes):
            scene = Scene.from_dict(scene_data) if isinstance(scene_data, dict) else scene_data
            refined_script.add_scene(scene)

        return refined_script


_script_generator: Optional[ScriptGenerator] = None


def get_script_generator() -> ScriptGenerator:
    global _script_generator
    if _script_generator is None:
        _script_generator = ScriptGenerator()
    return _script_generator
