from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from app.schemas.common import ApiResponse

class Coordinates(BaseModel):
    lat: float
    lng: float

class PlaceResponse(BaseModel):
    id: str  # maps to slug
    name: str
    category: str
    place_type: Optional[str] = None
    location: Optional[str] = None
    distance_kms: Optional[float] = None
    duration_mins: Optional[int] = None
    budget_level: Optional[str] = None
    entry_fee_num: float = 0.0
    is_must_visit: bool = False
    
    # Detail fields
    description: Optional[str] = None
    history: Optional[str] = None
    timings: Optional[str] = None
    entry_fee: Optional[str] = None
    address: Optional[str] = None
    
    # Metadata
    rating: float = 0.0
    review_count: int = 0
    image: Optional[str] = None  # maps to hero_image
    coordinates: Coordinates
    
    # Extracted Info
    best_time: Optional[str] = None
    short_intro: Optional[str] = None
    why_visit: Optional[str] = None
    
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    duration: Optional[str] = None
    
    open_from: int = 0
    open_to: int = 24
    
    video_url: Optional[str] = None
    
    # Arrays and Objects
    interests: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)
    
    travel_info: Dict[str, Any] = Field(default_factory=dict)
    practical_info: Dict[str, Any] = Field(default_factory=dict)
    spiritual_info: Dict[str, Any] = Field(default_factory=dict)
    visitor_tips: Dict[str, Any] = Field(default_factory=dict)
    travel_estimates: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class PlaceListResponse(ApiResponse[List[PlaceResponse]]):
    pass

class PlaceSingleResponse(ApiResponse[PlaceResponse]):
    pass
