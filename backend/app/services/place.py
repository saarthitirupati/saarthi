from typing import List, Optional
from app.models.place import Place
from app.schemas.v1.place import PlaceResponse, Coordinates

class PlaceService:
    @staticmethod
    def _to_response(place: Place) -> PlaceResponse:
        # Load metadata as base dictionary
        meta = place.db_metadata if isinstance(place.db_metadata, dict) else {}
        
        # Helper to get value from column or metadata fallback
        def get_val(col_val, meta_key, default=None):
            if col_val is not None:
                return col_val
            return meta.get(meta_key, default)

        # Handle timings string/dict
        timings_val = place.timings
        if isinstance(timings_val, dict):
            timings_str = timings_val.get("display") or timings_val.get("timings") or str(timings_val)
        else:
            timings_str = timings_val or meta.get("timings")

        # Handle entry_fee string/dict
        entry_fee_val = place.entry_fee
        if isinstance(entry_fee_val, dict):
            entry_fee_str = entry_fee_val.get("display") or entry_fee_val.get("entry_fee") or str(entry_fee_val)
        else:
            entry_fee_str = entry_fee_val or meta.get("entryFee")

        # Parse coordinates
        coords_dict = place.coordinates if isinstance(place.coordinates, dict) else {}
        if not coords_dict and "coordinates" in meta:
            coords_dict = meta["coordinates"] or {}
        lat_val = coords_dict.get("lat") or 0.0
        lng_val = coords_dict.get("lng") or 0.0

        # Tags and images
        tags = place.tags if place.tags else meta.get("tags", [])
        images = place.images if place.images else meta.get("images", [])
        # Fallback to gallery jsonb if images is empty
        if not images and place.gallery:
            if isinstance(place.gallery, list):
                images = [item.get("image_url") or item.get("url") if isinstance(item, dict) else str(item) for item in place.gallery]
            elif isinstance(place.gallery, dict):
                images = place.gallery.get("images", [])

        # Category name
        category_name = place.category.name if place.category else meta.get("category", "")

        # Extract practical_info / spiritual_info / travel_estimates from metadata
        practical = meta.get("practicalInfo") or {}
        spiritual = meta.get("spiritualInfo") or {}
        visitor_tips = meta.get("visitorTips") or {}
        travel_est = meta.get("travelEstimates") or {}

        # Travel info mapping
        travel = place.travel_info if isinstance(place.travel_info, dict) and place.travel_info else meta.get("travelInfo", {})

        # Why visit string
        why_visit_str = ""
        if place.why_visit:
            if isinstance(place.why_visit, list):
                why_visit_str = "\n".join(place.why_visit)
            else:
                why_visit_str = str(place.why_visit)
        else:
            why_visit_meta = meta.get("whyVisit")
            if isinstance(why_visit_meta, list):
                why_visit_str = "\n".join(why_visit_meta)
            else:
                why_visit_str = str(why_visit_meta or "")

        # Interests
        interests = meta.get("interests", [])
        if not interests and place.keywords:
            interests = place.keywords

        # Duration mins
        vd = place.visit_duration if isinstance(place.visit_duration, dict) else {}
        if not vd and "visitDuration" in meta:
            vd = meta["visitDuration"] or {}
        duration_mins = vd.get("minutes") or meta.get("durationMins")

        # Map to Response object
        return PlaceResponse(
            id=place.slug,
            name=place.name,
            category=category_name,
            place_type=meta.get("placeType") or meta.get("place_type"),
            location=meta.get("location"),
            distance_kms=meta.get("distanceKms") or meta.get("distance_kms"),
            duration_mins=duration_mins,
            budget_level=meta.get("budgetLevel") or meta.get("budget_level"),
            entry_fee_num=meta.get("entryFeeNum") or 0.0,
            is_must_visit=get_val(place.featured, "isMustVisit", False),
            description=get_val(place.description, "description"),
            history=get_val(place.history, "history"),
            timings=timings_str,
            entry_fee=entry_fee_str,
            address=meta.get("address"),
            rating=meta.get("rating", 0.0),
            review_count=meta.get("reviewCount", 0),
            image=get_val(place.hero_image, "image"),
            coordinates=Coordinates(lat=lat_val, lng=lng_val),
            best_time=meta.get("bestTime"),
            short_intro=meta.get("shortIntro"),
            why_visit=why_visit_str,
            opening_time=meta.get("openingTime"),
            closing_time=meta.get("closingTime"),
            duration=meta.get("duration"),
            open_from=meta.get("openFrom", 0),
            open_to=meta.get("openTo", 24),
            video_url=meta.get("videoUrl"),
            interests=interests,
            tags=tags,
            images=images,
            travel_info=travel,
            practical_info=practical,
            spiritual_info=spiritual,
            visitor_tips=visitor_tips,
            travel_estimates=travel_est
        )

    @staticmethod
    def to_response_list(places: List[Place]) -> List[PlaceResponse]:
        return [PlaceService._to_response(p) for p in places]

    @staticmethod
    def to_response(place: Place) -> PlaceResponse:
        return PlaceService._to_response(place)
