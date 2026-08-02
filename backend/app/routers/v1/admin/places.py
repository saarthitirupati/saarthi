from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from app.database import get_db
from app.models.place import Place
from sqlalchemy import select, update, insert, delete
from pydantic import BaseModel

router = APIRouter(prefix="/places", tags=["admin-places"])

@router.get("/")
async def get_all_places_admin(session: AsyncSession = Depends(get_db)):
    stmt = select(Place).where(Place.status != 'deleted')
    result = await session.execute(stmt)
    places = result.scalars().all()
    # Next.js expects { places: [...] }
    return {"places": places}

@router.get("/{id}")
async def get_place_admin(id: str, session: AsyncSession = Depends(get_db)):
    stmt = select(Place).where(Place.id == id)
    result = await session.execute(stmt)
    place = result.scalars().first()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return {"place": place}

@router.post("/")
async def create_place_admin(data: Dict[str, Any], session: AsyncSession = Depends(get_db)):
    # Filter out fields that don't exist in the Place model
    valid_keys = set(Place.__table__.columns.keys())
    
    filtered_data = {}
    for k, v in data.items():
        if k in valid_keys and v is not None:
            filtered_data[k] = v
            
    # Need to handle slug/id logic if they aren't provided by client
    import uuid
    import time
    if "id" not in filtered_data:
        filtered_data["id"] = str(uuid.uuid4())
    if "slug" not in filtered_data and "name" in filtered_data:
        import re
        filtered_data["slug"] = re.sub(r'[^a-z0-9-]', '', filtered_data["name"].lower().replace(' ', '-')) + f'-{int(time.time())}'

    stmt = insert(Place).values(**filtered_data).returning(Place)
    result = await session.execute(stmt)
    await session.commit()
    place = result.scalars().first()
    return {"place": place}

@router.put("/{id}")
async def update_place_admin(id: str, data: Dict[str, Any], session: AsyncSession = Depends(get_db)):
    valid_keys = set(Place.__table__.columns.keys())
    
    filtered_data = {}
    for k, v in data.items():
        if k in valid_keys and k not in ("id", "created_at"):
            filtered_data[k] = v

    stmt = update(Place).where(Place.id == id).values(**filtered_data).returning(Place)
    result = await session.execute(stmt)
    await session.commit()
    place = result.scalars().first()
    
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
        
    return {"place": place}

@router.delete("/{id}")
async def delete_place_admin(id: str, session: AsyncSession = Depends(get_db)):
    # Soft delete
    stmt = update(Place).where(Place.id == id).values(status='deleted')
    await session.execute(stmt)
    await session.commit()
    return {"ok": True}
