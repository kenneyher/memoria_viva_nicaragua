from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from agents.story_agent import gen_story
from agents.image_agent import gen_img
from agents.audio_agent import gen_tts
from database import connect_db, innit_db, disconnect_db, is_connected
from crud import create_story, get_all_stories
import logging

logging.basicConfig(level=logging.INFO)
logger=logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting FastAPI application...")
    
    # Try to connect to database
    connection_success = await connect_db()
    if not connection_success:
        print("Failed to connect to database during startup!")
        # Don't raise here, let the app start but mark it as unhealthy
        yield
        return
    
    try:
        await innit_db()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Failed to initialize database: {e}")
        yield
        return
    
    print("FastAPI application started successfully")
    yield
    print("Shutting down FastAPI application...")
    await disconnect_db()

app = FastAPI(lifespan=lifespan)
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

class Story(BaseModel):
    title: str
    content: str
    type: str
    author: str
    media_url: str

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
    
@app.post("/ai/generate-tts")
def generate_audio(request: StoryRequest):
    try:
        res = gen_tts(request.prompt)
        return res
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error generating audio: {str(e)}" )
    
@app.post("/db/add-story")
async def add_story(request:Story):
    try:
        logger.info(f"Database connection status: {is_connected()}")
        
        if not is_connected():
            raise HTTPException(status_code=503, detail="Database not connected")
            
        logger.info(request)
        await create_story(
            request.title,
            request.content,
            request.author,
            request.media_url,
            request.type
        )
        return {"status": "success", "message": "Story added successfully"}
    except Exception as e: 
        logger.error(f"Error adding story: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error adding story: {str(e)}")

@app.get("/db/stories")
async def get_stories():
    """Get all stories"""
    try:
        if not is_connected():
            raise HTTPException(status_code=503, detail="Database not connected")
            
        stories = await get_all_stories()
        return {"status": "success", "stories": stories}
    except Exception as e:
        logger.error(f"Error getting stories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting stories: {str(e)}")