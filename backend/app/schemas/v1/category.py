from typing import List
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from app.schemas.common import ApiResponse

class CategoryResponse(BaseModel):
    name: str
    slug: str
    count: int = 0

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class CategoryListResponse(ApiResponse[List[CategoryResponse]]):
    pass
