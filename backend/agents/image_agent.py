from agents.agent_prompts import SYS_AGENT_PROMPTS, INSTRUCTION_PROMPTS
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel
import logging
import os
import base64

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def gen_img(prompt: str):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-preview-image-generation",
            contents=(
                f"{INSTRUCTION_PROMPTS["generate_img"]}\n{prompt}"
            ),
            config=types.GenerateContentConfig(
                response_modalities=['TEXT','IMAGE'],
            )
        )
        for candidate in response.candidates: # pyright: ignore[reportOptionalIterable]
            for part in candidate.content.parts: # type: ignore
                if hasattr(part, "inline_data") and part.inline_data is not None:
                    if hasattr(part.inline_data, "data"):
                        # Some SDKs return bytes, some return str
                        raw_data = part.inline_data.data
                        if isinstance(raw_data, bytes):
                            image_base64 = base64.b64encode(raw_data).decode("utf-8")
                        else:
                            image_base64 = raw_data  # already a str
                        
                        return {"image": image_base64}

        return {"error": "No image data found in response."}
    except Exception as e:
        print(e)
        return {"error": str(e)}
    