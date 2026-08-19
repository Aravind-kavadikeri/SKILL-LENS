from fastapi import APIRouter, Query
from models.schemas import ForecastResponse
from services.forecast_service import ForecastEngine

router = APIRouter(prefix="/api/v1/forecast", tags=["Forecast"])
engine = ForecastEngine()


@router.get("", response_model=ForecastResponse)
async def get_forecast(
    skill: str = Query("python"),
    model: str = Query("prophet", pattern="^(prophet|xgboost|lstm)$"),
    months: int = Query(12, ge=1, le=36),
):
    return engine.forecast_skill_demand(skill=skill, model=model, months=months)
