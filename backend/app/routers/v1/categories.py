from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.category import CategoryRepository
from app.services.category import CategoryService
from app.schemas.v1.category import CategoryListResponse

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=CategoryListResponse)
async def get_categories(session: AsyncSession = Depends(get_db)):
    categories_with_counts = await CategoryRepository.get_with_counts(session)
    response_data = CategoryService.to_response_list(categories_with_counts)
    
    return CategoryListResponse(
        success=True,
        data=response_data,
        meta={"total": len(response_data)}
    )
