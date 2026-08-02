from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.place import PlaceRepository
from app.services.place import PlaceService
from app.schemas.v1.place import PlaceListResponse, PlaceSingleResponse

router = APIRouter(prefix="/places", tags=["places"])

@router.get("", response_model=PlaceListResponse)
async def get_places(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    session: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * limit
    places = await PlaceRepository.get_all(
        session=session,
        category_slug=category,
        tag=tag,
        search=search,
        limit=limit,
        offset=offset
    )
    
    total = await PlaceRepository.count(
        session=session,
        category_slug=category,
        tag=tag,
        search=search
    )
    
    response_data = PlaceService.to_response_list(places)
    
    return PlaceListResponse(
        success=True,
        data=response_data,
        meta={
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        }
    )

@router.get("/{slug}", response_model=PlaceSingleResponse)
async def get_place(
    slug: str,
    session: AsyncSession = Depends(get_db)
):
    place = await PlaceRepository.get_by_slug(session, slug)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
        
    response_data = PlaceService.to_response(place)
    return PlaceSingleResponse(success=True, data=response_data)
