from agents.agent_prompts import SYS_AGENT_PROMPTS, INSTRUCTION_PROMPTS
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

class StoryResponse(BaseModel):
    title: str
    description: str

def gen_story(prompt: str):
    try:
        response = client.responses.parse(
            model="gpt-4o",
            input=[
                { "role": "system", "content": SYS_AGENT_PROMPTS["storyteller"]},
                { "role": "system", "content": INSTRUCTION_PROMPTS["generate_story"] },
                { "role": "user", "content": prompt },
            ],
            text_format=StoryResponse
        )
        story = StoryResponse.model_validate(response.output_parsed)
        return story.model_dump()
    except Exception as e:
        print(e)
        return {"text": str(e)}
