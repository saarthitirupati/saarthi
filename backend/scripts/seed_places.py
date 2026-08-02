"""
Seed script: Import 62 verified places from places_export.json into PostgreSQL.

Usage:
    cd backend
    python scripts/seed_places.py
"""
import asyncio
import json
import os
import sys
from pathlib import Path
from uuid import uuid4

# Add backend root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text
from app.database import engine, async_session_maker, Base
from app.models.category import Category
from app.models.place import Place, PlaceImage, PlaceTag


EXPORT_PATH = Path(__file__).parent / "places_export.json"


def slugify(name: str) -> str:
    return name.lower().replace(" ", "-").replace("&", "and").replace("'", "")


async def seed():
    # Create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    with open(EXPORT_PATH, "r", encoding="utf-8") as f:
        places_data = json.load(f)

    print(f"📦 Loaded {len(places_data)} places from JSON")

    async with async_session_maker() as session:
        # Check if already seeded
        result = await session.execute(text("SELECT COUNT(*) FROM places"))
        existing = result.scalar_one()
        if existing > 0:
            print(f"⚠️  Database already has {existing} places. Skipping seed.")
            print("   Drop tables first if you want to re-seed.")
            return

        # 1. Collect and insert unique categories
        category_names = set()
        for p in places_data:
            cat = p.get("category", "Uncategorized")
            if cat:
                category_names.add(cat)

        category_map = {}  # name -> Category UUID
        for cat_name in sorted(category_names):
            cat = Category(
                id=uuid4(),
                name=cat_name,
                slug=slugify(cat_name),
            )
            session.add(cat)
            category_map[cat_name] = cat.id

        await session.flush()
        print(f"📂 Created {len(category_map)} categories")

        # 2. Insert places
        place_count = 0
        for p in places_data:
            coords = p.get("coordinates", {})
            cat_name = p.get("category", "Uncategorized")

            place = Place(
                id=uuid4(),
                slug=p["id"],
                name=p["name"],
                category_id=category_map.get(cat_name),
                place_type=p.get("placeType"),
                location=p.get("location"),
                distance_kms=p.get("distanceKms"),
                duration_mins=p.get("durationMins"),
                budget_level=p.get("budgetLevel"),
                entry_fee_num=p.get("entryFeeNum", 0),
                is_must_visit=p.get("isMustVisit", False),
                description=p.get("description"),
                history=p.get("history"),
                timings=p.get("timings"),
                entry_fee=p.get("entryFee"),
                address=p.get("address"),
                rating=p.get("rating", 0),
                review_count=p.get("reviewCount", 0),
                hero_image=p.get("image"),
                lat=coords.get("lat", 0),
                lng=coords.get("lng", 0),
                best_time=p.get("bestTime"),
                short_intro=p.get("shortIntro"),
                why_visit=p.get("whyVisit"),
                opening_time=p.get("openingTime"),
                closing_time=p.get("closingTime"),
                duration=p.get("duration"),
                open_from=p.get("openFrom", 0),
                open_to=p.get("openTo", 24),
                video_url=p.get("videoUrl"),
                interests=p.get("interests", []),
                travel_info={
                    "rtc": p.get("travelByRTC"),
                    "car": p.get("travelByCar"),
                    "bike": p.get("travelByBike"),
                    "rtcFare": p.get("approxRTCFare"),
                    "carCost": p.get("approxCarCost"),
                    "bikeCost": p.get("approxBikeCost"),
                },
                practical_info=p.get("practicalInfo", {}),
                spiritual_info=p.get("spiritualInfo", {}),
                visitor_tips=p.get("visitorTips", {}),
                travel_estimates=p.get("travelEstimates", {}),
            )
            session.add(place)

            # Tags
            tags = p.get("tags", [])
            for tag_str in tags:
                session.add(PlaceTag(id=uuid4(), place_id=place.id, tag=tag_str))

            # Gallery images
            images = p.get("images", [])
            for idx, img_url in enumerate(images):
                session.add(PlaceImage(
                    id=uuid4(),
                    place_id=place.id,
                    image_url=img_url,
                    sort_order=idx,
                ))

            place_count += 1

        await session.commit()
        print(f"✅ Seeded {place_count} places into PostgreSQL")

        # Verify
        result = await session.execute(text("SELECT COUNT(*) FROM places"))
        final = result.scalar_one()
        result2 = await session.execute(text("SELECT COUNT(*) FROM place_tags"))
        tags_count = result2.scalar_one()
        result3 = await session.execute(text("SELECT COUNT(*) FROM place_images"))
        images_count = result3.scalar_one()

        print(f"📊 Final counts: {final} places, {tags_count} tags, {images_count} images")


if __name__ == "__main__":
    asyncio.run(seed())
