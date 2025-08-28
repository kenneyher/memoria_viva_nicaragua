from database import pool

async def create_story(
    title,
    content,
    author,
    media_url,
    type
):
    async with pool.acquire() as conn:
        result = await conn.fetchrow(
        """
        INSERT INTO stories(title, content, author, media_url, type)
        VALUES($1, $2, $3, $4, $5, $6);
        """,
        title, content, author, media_url, type
        )
