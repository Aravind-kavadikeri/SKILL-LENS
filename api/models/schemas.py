from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import date


class DashboardSummary(BaseModel):
    total_jobs: int
    total_skills: int
    avg_salary: float
    market_pulse_score: float
    job_growth_rate: float
    top_skills: List[dict]
    salary_trend: List[dict]


class MarketPulsePoint(BaseModel):
    date: str
    value: float
    label: str


class MarketPulseResponse(BaseModel):
    data: List[MarketPulsePoint]


class JobMarketResponse(BaseModel):
    locations: List[dict]
    industries: List[dict]
    remote_stats: dict
    total_jobs: int
    country: str


class SkillTrend(BaseModel):
    date: str
    value: float


class TrendingSkill(BaseModel):
    name: str
    growth_rate: float
    category: str
    trend: List[SkillTrend]


class TrendingSkillsResponse(BaseModel):
    skills: List[TrendingSkill]


class ScarcitySkill(BaseModel):
    name: str
    scarcity_score: float
    demand_supply_ratio: float
    category: str


class SkillScarcityResponse(BaseModel):
    skills: List[ScarcitySkill]


class SalaryRequest(BaseModel):
    role: str
    experience: float
    location: str
    education: str
    industry: str
    skills: List[str] = Field(default_factory=list)


class SalaryDistributionResponse(BaseModel):
    distribution: List[dict]
    avg_salary: float
    median_salary: float
    percentile_25: float
    percentile_75: float
    by_experience: List[dict]


class SalaryResponse(BaseModel):
    predicted_salary: float
    confidence_interval: List[float]
    factors: List[dict]


class SHAPFeature(BaseModel):
    name: str
    value: Any
    shap_value: float
    impact_direction: str


class SHAPWaterfall(BaseModel):
    feature: str
    contribution: float
    cumulative: float


class SalaryExplainResponse(BaseModel):
    base_value: float
    features: List[SHAPFeature]
    waterfall: List[SHAPWaterfall]


class ForecastPoint(BaseModel):
    date: str
    value: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None


class ForecastMetric(BaseModel):
    mae: float
    rmse: float
    mape: float


class ForecastResponse(BaseModel):
    skill: str
    model: str
    historical: List[ForecastPoint]
    forecast: List[ForecastPoint]
    metrics: ForecastMetric


class ResumeAnalysisResponse(BaseModel):
    ats_score: float
    skills_found: List[str]
    missing_skills: List[str]
    experience_years: float
    education_level: str
    suggested_roles: List[dict]
    summary: str
    formatting_score: Optional[float] = 95.0
    impact_score: Optional[float] = 90.0
    ats_breakdown: Optional[dict] = None
    ats_recommendations: Optional[List[str]] = None
    ats_sample_resumes: Optional[dict] = None
    contact_info: Optional[dict] = None
    target_role: Optional[str] = None
    match_score: Optional[float] = None




class ResumeMatchRequest(BaseModel):
    resume_text: str
    target_role: str


class ResumeMatchResponse(BaseModel):
    match_score: float
    matching_skills: List[str]
    gap_skills: List[str]
    recommendations: List[str]


class SkillGapItem(BaseModel):
    skill: str
    importance: str
    learning_effort: str


class SkillGapResponse(BaseModel):
    current_skills: List[str]
    target_skills: List[str]
    common_skills: List[str]
    gaps: List[SkillGapItem]
    match_score: float


class RoadmapResource(BaseModel):
    name: str
    url: str


class RoadmapStage(BaseModel):
    order: int
    title: str
    skills: List[str]
    duration_weeks: int
    resources: List[RoadmapResource]


class RoadmapResponse(BaseModel):
    role: str
    stages: List[RoadmapStage]


class SkillGraphEdge(BaseModel):
    source: str
    target: str
    weight: float
    relationship: str


class SkillGraphNode(BaseModel):
    id: str
    name: str
    category: str
    weight: float
    cluster: str


class SkillGraphResponse(BaseModel):
    nodes: List[SkillGraphNode]
    edges: List[SkillGraphEdge]


class CareerPathNode(BaseModel):
    skill: str
    level: str


class CareerPath(BaseModel):
    nodes: List[CareerPathNode]
    total_effort: float


class CareerPathResponse(BaseModel):
    paths: List[CareerPath]


class GeographicLocation(BaseModel):
    name: str
    lat: float
    lon: float
    value: float
    count: int
    growth: float


class GeographicSummary(BaseModel):
    total: int
    avg_value: float
    top_region: str


class GeographicResponse(BaseModel):
    locations: List[GeographicLocation]
    summary: GeographicSummary


class WeeklyTopSkill(BaseModel):
    name: str
    rank: int
    change: float


class WeeklyTrend(BaseModel):
    week_start: str
    top_skills: List[WeeklyTopSkill]
    market_pulse: float
    new_jobs: int


class WeeklySummary(BaseModel):
    total_change: float
    fastest_growing: str
    fastest_declining: str


class WeeklyTrendResponse(BaseModel):
    weeks: List[WeeklyTrend]
    summary: WeeklySummary


class QuarterlySkill(BaseModel):
    name: str
    growth_rate: float
    demand_score: float


class QuarterlyIndustry(BaseModel):
    industry: str
    growth: float


class QuarterlyData(BaseModel):
    quarter: str
    skills: List[QuarterlySkill]
    industry_trends: List[QuarterlyIndustry]


class QuarterlySummary(BaseModel):
    top_skill: str
    top_industry: str
    avg_growth: float


class QuarterlyReportResponse(BaseModel):
    quarters: List[QuarterlyData]
    summary: QuarterlySummary


class SeekerView(BaseModel):
    top_roles: List[dict]
    salary_benchmarks: List[dict]
    skill_gaps: List[dict]
    market_outlook: dict


class RecruiterCandidateCluster(BaseModel):
    cluster: str
    count: int
    traits: List[str]


class RecruiterView(BaseModel):
    talent_scarcity: List[dict]
    hiring_trends: List[dict]
    salary_ranges: List[dict]
    candidate_clusters: List[RecruiterCandidateCluster]


class ExecutiveView(BaseModel):
    workforce_trends: List[dict]
    strategic_insights: List[str]
    competitive_landscape: List[dict]
    kpi_summary: dict


class ExecutiveResponse(BaseModel):
    seeker: Optional[SeekerView] = None
    recruiter: Optional[RecruiterView] = None
    executive: Optional[ExecutiveView] = None


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    context: Optional[dict] = None


class ChatSource(BaseModel):
    title: str
    relevance: float


class ChatResponse(BaseModel):
    reply: str
    sources: List[ChatSource]
    conversation_id: str
    suggested_questions: List[str]


class JobMarketQueryParams(BaseModel):
    country: str = "global"


class SkillTrendQueryParams(BaseModel):
    months: int = 12


class SkillScarcityQueryParams(BaseModel):
    top_k: int = 10


class SalaryDistributionQueryParams(BaseModel):
    role: Optional[str] = None
    country: Optional[str] = None


class ForecastQueryParams(BaseModel):
    skill: str = "python"
    model: str = "prophet"
    months: int = 12


class SkillGapQueryParams(BaseModel):
    current_role: str
    target_role: str


class RoadmapQueryParams(BaseModel):
    role: str


class CareerPathQueryParams(BaseModel):
    role: str
    target_role: str


class GeographicQueryParams(BaseModel):
    metric: str = "hiring"


class ExecutiveQueryParams(BaseModel):
    view: str = "executive"
