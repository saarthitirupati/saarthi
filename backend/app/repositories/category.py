from typing import List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.category import Category
from app.models.place import Place

class CategoryRepository:
    @staticmethod
    async def get_all(session: AsyncSession) -> List[Category]:
        stmt = select(Category).order_by(Category.priority.asc())
        result = await session.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def get_with_counts(session: AsyncSession) -> List[Tuple[Category, int]]:
        stmt = (
            select(Category, func.count(Place.id))
            .outerjoin(Place, (Place.category_id == Category.id) & (Place.status == "Published"))
            .group_by(Category.id)
            .order_by(Category.priority.asc())
        )
        result = await session.execute(stmt)
        return list(result.all())
