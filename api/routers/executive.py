from fastapi import APIRouter, Query
from models.schemas import ExecutiveResponse
from services.market_service import MarketIntelligence

router = APIRouter(prefix="/api/v1/executive", tags=["Executive"])
market = MarketIntelligence()


@router.get("", response_model=ExecutiveResponse)
async def get_executive_view(view: str = Query("executive", pattern="^(seeker|recruiter|executive)$")):
    data = market.get_executive_view(view=view)
    return {view: data}
