import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
if db_url is None:
    raise ValueError("DATABASE_URL not set in .env")

pool = None


async def connect_db():
    global pool
    try:
        print(f"Attempting to connect to database...")
        print(f"Database URL: {db_url}")
        pool = await asyncpg.create_pool(db_url)
        print(f"Database connected successfully: {pool}")
        return True
    except Exception as e:
        print(f"Failed to connect to database: {e}")
        print(f"Error type: {type(e)}")
        pool = None
        return False

async def disconnect_db():
    global pool
    await pool.close()

def is_connected():
    return pool is not None

def get_pool():
    return pool

async def innit_db():
    if pool is None:
        raise Exception("Database not connected")
        
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS stories (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                author TEXT NOT NULL,
                media_url TEXT,
                type TEXT NOT NULL
            );
        """)