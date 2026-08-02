from typing import List, Optional
from sqlalchemy import select, func, or_, cast, String
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.place import Place

class PlaceRepository:
    @staticmethod
    async def get_all(
        session: AsyncSession,
        category_slug: Optional[str] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Place]:
        stmt = select(Place).options(
            selectinload(Place.category)
        ).where(Place.status == "Published")
        
        if category_slug:
            stmt = stmt.where(Place.category.has(slug=category_slug))
            
        if tag:
            # PostgreSQL ARRAY column contains check
            stmt = stmt.where(Place.tags.contains([tag]))
            
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    Place.name.ilike(search_pattern),
                    Place.description.ilike(search_pattern),
                    Place.short_intro.ilike(search_pattern)
                )
            )
            
        stmt = stmt.order_by(Place.priority.desc().nullslast()).limit(limit).offset(offset)
        
        result = await session.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def get_by_slug(session: AsyncSession, slug: str) -> Optional[Place]:
        stmt = select(Place).options(
            selectinload(Place.category)
        ).where(Place.slug == slug)
        
        result = await session.execute(stmt)
        return result.scalars().first()

    @staticmethod
    async def count(
        session: AsyncSession,
        category_slug: Optional[str] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None
    ) -> int:
        stmt = select(func.count()).select_from(Place).where(Place.status == "Published")
        
        if category_slug:
            stmt = stmt.where(Place.category.has(slug=category_slug))
            
        if tag:
            stmt = stmt.where(Place.tags.contains([tag]))
            
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    Place.name.ilike(search_pattern),
                    Place.description.ilike(search_pattern),
                    Place.short_intro.ilike(search_pattern)
                )
            )
            
        result = await session.execute(stmt)
        return result.scalar_one()
