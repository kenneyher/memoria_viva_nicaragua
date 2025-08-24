from agents.agent_prompts import SYS_AGENT_PROMPTS, INSTRUCTION_PROMPTS
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
import logging
import os
import base64

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def gen_img(prompt: str):
    try:
        result = client.images.generate(
            model="gpt-image-1",
            prompt=f"{INSTRUCTION_PROMPTS["generate_img"]}\n {prompt}",
            n=1,
            size="1024x1024"
        )

        imageb64 = result.data[0].b64_json
        if not imageb64:
            return {"error": "No image data found in response."}
        
        return imageb64
    except Exception as e:
        print(e)
        return {"error": str(e)}
    