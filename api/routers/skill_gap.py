from fastapi import APIRouter, Query
from models.schemas import SkillGapResponse, RoadmapResponse
from services.skill_graph_service import SkillGraphAnalyzer

router = APIRouter(prefix="/api/v1/skill-gap", tags=["Skill Gap"])
analyzer = SkillGraphAnalyzer()


@router.get("", response_model=SkillGapResponse)
async def get_skill_gap(
    current_role: str = Query("software-engineer"),
    target_role: str = Query("ml-engineer"),
):
    return analyzer.analyze_gaps(current_role=current_role, target_role=target_role)


@router.get("/roadmap", response_model=RoadmapResponse)
async def get_learning_roadmap(role: str = Query("ml-engineer")):
    return analyzer.get_learning_roadmap(role=role)
