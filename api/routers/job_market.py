import random
from fastapi import APIRouter, Query
from models.schemas import JobMarketResponse

router = APIRouter(prefix="/api/v1/job-market", tags=["Job Market"])


@router.get("", response_model=JobMarketResponse)
async def get_job_market(country: str = Query("india", pattern="^(india|us|global)$")):
    random.seed(hash(country) % 2 ** 31)

    if country == "india":
        locations = [
            {"name": "Bangalore", "count": 12500, "percentage": 28.5},
            {"name": "Mumbai", "count": 8500, "percentage": 19.4},
            {"name": "Delhi/NCR", "count": 7200, "percentage": 16.4},
            {"name": "Hyderabad", "count": 6800, "percentage": 15.5},
            {"name": "Pune", "count": 4500, "percentage": 10.3},
            {"name": "Chennai", "count": 3200, "percentage": 7.3},
            {"name": "Kolkata", "count": 1200, "percentage": 2.7},
        ]
        industries = [
            {"name": "Information Technology", "count": 18500, "percentage": 42.2},
            {"name": "Financial Services", "count": 6500, "percentage": 14.8},
            {"name": "E-commerce", "count": 5200, "percentage": 11.9},
            {"name": "Healthcare", "count": 3800, "percentage": 8.7},
            {"name": "Consulting", "count": 3200, "percentage": 7.3},
            {"name": "Manufacturing", "count": 2800, "percentage": 6.4},
            {"name": "Education", "count": 1800, "percentage": 4.1},
        ]
        remote_stats = {"remote_percent": 18.5, "hybrid_percent": 35.2, "onsite_percent": 46.3}
    elif country == "us":
        locations = [
            {"name": "San Francisco Bay Area", "count": 28500, "percentage": 22.8},
            {"name": "New York Metro", "count": 22000, "percentage": 17.6},
            {"name": "Seattle", "count": 14500, "percentage": 11.6},
            {"name": "Boston", "count": 9800, "percentage": 7.8},
            {"name": "Austin", "count": 7200, "percentage": 5.8},
            {"name": "Los Angeles", "count": 6800, "percentage": 5.4},
            {"name": "Chicago", "count": 5500, "percentage": 4.4},
            {"name": "Denver", "count": 4200, "percentage": 3.4},
            {"name": "Washington DC", "count": 3800, "percentage": 3.0},
        ]
        industries = [
            {"name": "Technology", "count": 52000, "percentage": 41.6},
            {"name": "Financial Services", "count": 18500, "percentage": 14.8},
            {"name": "Healthcare", "count": 12000, "percentage": 9.6},
            {"name": "E-commerce", "count": 9800, "percentage": 7.8},
            {"name": "Consulting", "count": 7500, "percentage": 6.0},
            {"name": "Media & Entertainment", "count": 5200, "percentage": 4.2},
            {"name": "Education", "count": 3800, "percentage": 3.0},
        ]
        remote_stats = {"remote_percent": 28.5, "hybrid_percent": 42.3, "onsite_percent": 29.2}
    else:
        locations = [
            {"name": "San Francisco Bay Area", "count": 28500, "percentage": 12.5},
            {"name": "New York Metro", "count": 22000, "percentage": 9.7},
            {"name": "London", "count": 18500, "percentage": 8.1},
            {"name": "Bangalore", "count": 12500, "percentage": 5.5},
            {"name": "Seattle", "count": 14500, "percentage": 6.4},
            {"name": "Berlin", "count": 8500, "percentage": 3.7},
            {"name": "Singapore", "count": 9500, "percentage": 4.2},
            {"name": "Tokyo", "count": 7800, "percentage": 3.4},
            {"name": "Toronto", "count": 6200, "percentage": 2.7},
            {"name": "Sydney", "count": 5500, "percentage": 2.4},
        ]
        industries = [
            {"name": "Technology", "count": 95000, "percentage": 41.8},
            {"name": "Financial Services", "count": 32000, "percentage": 14.1},
            {"name": "Healthcare", "count": 21000, "percentage": 9.2},
            {"name": "E-commerce", "count": 16500, "percentage": 7.3},
            {"name": "Consulting", "count": 14000, "percentage": 6.2},
            {"name": "Manufacturing", "count": 11000, "percentage": 4.8},
            {"name": "Media & Entertainment", "count": 8500, "percentage": 3.7},
        ]
        remote_stats = {"remote_percent": 25.8, "hybrid_percent": 38.5, "onsite_percent": 35.7}

    return {
        "locations": locations,
        "industries": industries,
        "remote_stats": remote_stats,
        "total_jobs": sum(loc["count"] for loc in locations),
        "country": country,
    }
