from fastapi import APIRouter, Query
from models.schemas import GeographicResponse
from services.geographic_service import GeographicIntelligence

router = APIRouter(prefix="/api/v1/geographic", tags=["Geographic"])
geo = GeographicIntelligence()


@router.get("", response_model=GeographicResponse)
async def get_geographic_data(metric: str = Query("hiring", pattern="^(hiring|salary|remote)$")):
    return geo.get_location_data(metric=metric)
