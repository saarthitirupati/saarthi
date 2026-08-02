from typing import List, Tuple
from app.models.category import Category
from app.schemas.v1.category import CategoryResponse

class CategoryService:
    @staticmethod
    def to_response_list(categories_with_counts: List[Tuple[Category, int]]) -> List[CategoryResponse]:
        return [
            CategoryResponse(
                name=category.name,
                slug=category.slug,
                count=count
            )
            for category, count in categories_with_counts
        ]
