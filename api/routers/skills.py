from fastapi import APIRouter, Query
from models.schemas import TrendingSkillsResponse, SkillScarcityResponse
from services.market_service import MarketIntelligence

router = APIRouter(prefix="/api/v1/skills", tags=["Skills"])
market = MarketIntelligence()


@router.get("/trending", response_model=TrendingSkillsResponse)
async def get_trending_skills(months: int = Query(12, ge=1, le=36)):
    return market.get_trending_skills(months=months)


@router.get("/scarcity", response_model=SkillScarcityResponse)
async def get_skill_scarcity(top_k: int = Query(10, ge=1, le=50)):
    trending = market.get_trending_skills(months=3)
    skills = trending["skills"]

    scarcity_skills = []
    for s in skills[:top_k]:
        demand_supply = round(1.5 + (hash(s["name"]) % 100) / 100, 2)
        scarcity_skills.append({
            "name": s["name"],
            "scarcity_score": round(min(s["growth_rate"] * 150 + 20, 100), 1),
            "demand_supply_ratio": demand_supply,
            "category": s["category"],
        })

    return {"skills": scarcity_skills}
