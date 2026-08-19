import random
from fastapi import APIRouter, Query
from models.schemas import (
    SalaryRequest,
    SalaryResponse,
    SalaryExplainResponse,
    SalaryDistributionResponse,
)
from services.salary_service import SalaryPredictor

router = APIRouter(prefix="/api/v1/salary", tags=["Salary"])
predictor = SalaryPredictor()


@router.get("/distribution", response_model=SalaryDistributionResponse)
async def get_salary_distribution(role: str = Query(None), country: str = Query(None)):
    random.seed(hash(f"{role}-{country}") % 2 ** 31 if role or country else 42)

    bins = [
        {"range": "₹0-₹5 LPA", "count": random.randint(1000, 4000)},
        {"range": "₹5-₹10 LPA", "count": random.randint(3000, 8000)},
        {"range": "₹10-₹15 LPA", "count": random.randint(4000, 10000)},
        {"range": "₹15-₹25 LPA", "count": random.randint(3000, 7000)},
        {"range": "₹25-₹40 LPA", "count": random.randint(1500, 4500)},
        {"range": "₹40-₹60 LPA", "count": random.randint(600, 2000)},
        {"range": "₹60 LPA+", "count": random.randint(200, 800)},
    ]

    by_exp = [
        {"level": "Entry (0-2 yrs)", "avg_salary": 750000, "count": 4500},
        {"level": "Mid (3-5 yrs)", "avg_salary": 1450000, "count": 8500},
        {"level": "Senior (5-8 yrs)", "avg_salary": 2650000, "count": 6200},
        {"level": "Lead (8+ yrs)", "avg_salary": 4500000, "count": 2800},
    ]

    return {
        "distribution": bins,
        "avg_salary": 1450000,
        "median_salary": 1250000,
        "percentile_25": 750000,
        "percentile_75": 1850000,
        "by_experience": by_exp,
    }


@router.post("/predict", response_model=SalaryResponse)
async def predict_salary(req: SalaryRequest):
    return predictor.predict(
        role=req.role,
        experience=req.experience,
        location=req.location,
        education=req.education,
        industry=req.industry,
        skills=req.skills,
    )


@router.post("/explain", response_model=SalaryExplainResponse)
async def explain_salary(req: SalaryRequest):
    return predictor.explain(
        role=req.role,
        experience=req.experience,
        location=req.location,
        education=req.education,
        industry=req.industry,
        skills=req.skills,
    )
