from agents.agent_prompts import SYS_AGENT_PROMPTS, INSTRUCTION_PROMPTS
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel
import os
import base64

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def gen_img(prompt: str):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-preview-image-generation",
            contents=f"{prompt}. {INSTRUCTION_PROMPTS["generate_img"]}",
            config=types.GenerateContentConfig(
                response_modalities=['TEXT','IMAGE'],
            )
        )

        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data is not None:
                if hasattr(part.inline_data, "data"):
                    # Some SDKs return bytes, some return str
                    raw_data = part.inline_data.data
                    if isinstance(raw_data, bytes):
                        image_base64 = base64.b64encode(raw_data).decode("utf-8")
                    else:
                        image_base64 = raw_data  # already a str
                    return {"img": image_base64}
                
        return {"error": "No image data found in response."}
    except Exception as e:
        print(e)
        return {"error": str(e)}
    