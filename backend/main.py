from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.story_agent import gen_story
from agents.image_agent import gen_img
from agents.audio_agent import gen_tts
import logging

logging.basicConfig(level=logging.INFO)
logger=logging.getLogger(__name__)

app = FastAPI()
# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:19006"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StoryRequest(BaseModel):
    prompt: str

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.post("/ai/generate-story")
def generate_story(request: StoryRequest):
    try: 
        res = gen_story(request.prompt)
        logger.info(res)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating story: {str(e)}")

@app.post("/ai/generate-img")
def generate_img(request: StoryRequest):
    try:
        res = gen_img(request.prompt)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")
    
@app.post("ai/generate-tts")
def generate_audio(request: StoryRequest):
    try:
        res = gen_tts(request.prompt)
        return res
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error generating audio: {str(e)}" )