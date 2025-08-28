from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.types import GenerateContentResponse
from pydantic import BaseModel
import os
import base64

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def gen_tts(text: str):
    try:
        response: GenerateContentResponse = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Kore',
                        )
                    )
                ),
            )
        )

        # Avoid "Object type None..." error in for loop :p
        if not response or not response.candidates or not response.candidates[0].content: 
            return {"error": "Empty response from model."}

        for part in (response.candidates[0].content.parts or []):
            if hasattr(part, "inline_data") and part.inline_data is not None:
                if hasattr(part.inline_data, "data"):
                    raw_data = part.inline_data.data
                    # Normalize to base64 str
                    if isinstance(raw_data, bytes):
                        audio_base64 = base64.b64encode(raw_data).decode("utf-8")
                    else:
                        audio_base64 = raw_data  # already a str
                    return {"audio": audio_base64}
    except Exception as e:
        return {"error": str(e)}
