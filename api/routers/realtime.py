from fastapi import APIRouter
from models.schemas import WeeklyTrendResponse, QuarterlyReportResponse
from services.market_service import MarketIntelligence

router = APIRouter(prefix="/api/v1/realtime", tags=["Real-time Trends"])
market = MarketIntelligence()


@router.get("/weekly", response_model=WeeklyTrendResponse)
async def get_weekly_trends():
    return market.get_weekly_trends()


@router.get("/quarterly", response_model=QuarterlyReportResponse)
async def get_quarterly_report():
    return market.get_quarterly_report()
