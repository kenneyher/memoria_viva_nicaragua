from agents.agent_prompts import SYS_AGENT_PROMPTS, INSTRUCTION_PROMPTS
from dotenv import load_dotenv
# from openai import OpenAI
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
                system_instruction=SYS_AGENT_PROMPTS["storyteller"]
            ),
            contents=f"{INSTRUCTION_PROMPTS["generate_story"]}\n {prompt}"
        )
        return {"description": response.text}
    except Exception as e:
        print(e)
        return {"text": str(e)}
