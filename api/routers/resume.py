from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form
from models.schemas import ResumeAnalysisResponse, ResumeMatchRequest, ResumeMatchResponse
from services.resume_service import ResumeAnalyzer

router = APIRouter(prefix="/api/v1/resume", tags=["Resume"])
analyzer = ResumeAnalyzer()


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None)
):
    content = await file.read()
    return analyzer.analyze(
        content,
        file.filename or "resume.pdf",
        target_role=target_role,
        job_description=job_description
    )



@router.post("/match", response_model=ResumeMatchResponse)
async def match_resume(req: ResumeMatchRequest):
    return analyzer.match_role(req.resume_text, req.target_role)
