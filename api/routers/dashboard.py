from fastapi import APIRouter
from models.schemas import DashboardSummary, MarketPulseResponse
from services.market_service import MarketIntelligence

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])
market = MarketIntelligence()


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary():
    return market.get_summary()


@router.get("/market-pulse", response_model=MarketPulseResponse)
async def get_market_pulse():
    return market.get_market_pulse()
