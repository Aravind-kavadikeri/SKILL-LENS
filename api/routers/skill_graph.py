from fastapi import APIRouter, Query
from models.schemas import SkillGraphResponse, CareerPathResponse
from services.skill_graph_service import SkillGraphAnalyzer

router = APIRouter(prefix="/api/v1/skill-graph", tags=["Skill Graph"])
analyzer = SkillGraphAnalyzer()


@router.get("/nodes", response_model=SkillGraphResponse)
async def get_skill_graph():
    return analyzer.get_graph()


@router.get("/paths", response_model=CareerPathResponse)
async def get_career_paths(
    role: str = Query("software-engineer"),
    target_role: str = Query("ml-engineer"),
):
    return analyzer.find_paths(role=role, target_role=target_role)
