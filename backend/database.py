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
    pool = await asyncpg.create_pool(db_url)

async def disconnect_db():
    global pool
    await pool.close()

async def innit_db():
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