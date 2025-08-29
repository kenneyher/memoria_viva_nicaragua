from database import get_pool

async def create_story(
    title,
    content,
    author,
    media_url,
    type
):
    pool = get_pool()
    if pool is None:
        raise Exception("Database not connected")
        
    async with pool.acquire() as conn:
        result = await conn.fetchrow(
        """
        INSERT INTO stories(title, content, author, media_url, type)
        VALUES($1, $2, $3, $4, $5)
        RETURNING id;
        """,
        title, content, author, media_url, type
        )
        return result

async def get_all_stories():
    """Get all stories from the database"""
    pool = get_pool()
    if pool is None:
        raise Exception("Database not connected")
        
    async with pool.acquire() as conn:
        result = await conn.fetch(
        """
        SELECT id, title, content, author, media_url, type
        FROM stories;
        """
        )
        return result
