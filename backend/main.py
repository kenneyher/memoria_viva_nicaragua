from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.story_agent import gen_story
import logging


app = FastAPI()
# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:8081"] for stricter security
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
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating story: {str(e)}")
