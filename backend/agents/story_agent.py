from agents.agent_prompts import SYS_AGENT_PROMPTS, INSTRUCTION_PROMPTS
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class StoryResponse(BaseModel):
    title: str
    description: str

def gen_story(prompt: str):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYS_AGENT_PROMPTS["storyteller"],
                response_schema=StoryResponse,
                response_mime_type='application/json'
            ),
            contents=[
                INSTRUCTION_PROMPTS["generate_story"],
                prompt
            ]
        )
        story = StoryResponse.model_validate_json(response.text) # type: ignore
        return story.model_dump()
    except Exception as e:
        print(e)
        return {"text": 'error'}
