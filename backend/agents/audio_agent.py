from agents.agent_prompts import INSTRUCTION_PROMPTS
from dotenv import load_dotenv
from openai import OpenAI
import logging
import os
import base64

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def gen_tts(text: str):
    try:
        with client.audio.speech.with_streaming_response.create(
            model="gpt-4o-mini-tts",
            voice="echo",
            input=text,
            instructions=INSTRUCTION_PROMPTS["generate-tts"],
            response_format="mp3"
        ) as response:
            audio_bytes = b''.join(response.json)

        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
        return {"audio_base64": audio_b64}
    
    except Exception as e:
        print(e)
        return {"error": str(e)}