import asyncio
from app.database import async_session_maker
from app.models.place import Place
from sqlalchemy import select, delete

async def main():
    async with async_session_maker() as session:
        result = await session.execute(select(Place))
        places = result.scalars().all()
        to_delete = []
        for p in places:
            if (p.hero_image and p.hero_image.startswith('data:image')) or (p.images and any(i.startswith('data:image') for i in p.images)):
                to_delete.append(p.id)
        
        print('Base64 images found in:', to_delete)
        if to_delete:
            await session.execute(delete(Place).where(Place.id.in_(to_delete)))
            await session.commit()
            print('Deleted places with base64 images')

asyncio.run(main())
