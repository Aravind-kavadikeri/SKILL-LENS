// ==================== Dashboard ====================

export interface DashboardSummary {
  total_jobs: number;
  total_skills: number;
  avg_salary: number;
  market_pulse_score: number;
  job_growth_rate: number;
  top_skills: { name: string; growth: number; demand: number; category: string }[];
  salary_trend: { month: string; salary: number }[];
}

export interface MarketPulsePoint {
  date: string;
  value: number;
  label: string;
}

export interface MarketPulseResponse {
  data: MarketPulsePoint[];
}

// ==================== Job Market ====================

export interface LocationData {
  name: string;
  count: number;
  percentage: number;
}

export interface IndustryData {
  name: string;
  count: number;
  percentage: number;
}

export interface RemoteStats {
  remote_percent: number;
  hybrid_percent: number;
  onsite_percent: number;
}

export interface JobMarketData {
  locations: LocationData[];
  industries: IndustryData[];
  remote_stats: RemoteStats;
  total_jobs: number;
  country: string;
}

// ==================== Trending Skills ====================

export interface SkillTrend {
  date: string;
  value: number;
}

export interface TrendingSkill {
  name: string;
  growth_rate: number;
  category: string;
  trend: SkillTrend[];
}

export interface SkillScarcity {
  name: string;
  scarcity_score: number;
  demand_supply_ratio: number;
  category: string;
}

// ==================== Salary ====================

export interface SalaryRequest {
  role: string;
  experience: number;
  location: string;
  education: string;
  industry: string;
  skills: string[];
}

export interface SalaryResponse {
  predicted_salary: number;
  confidence_interval: [number, number];
  factors: { name: string; impact: number; value: string }[];
}

export interface SHAPFeature {
  name: string;
  value: number;
  shap_value: number;
  impact_direction: string;
}

export interface SHAPWaterfall {
  feature: string;
  contribution: number;
  cumulative: number;
}

export interface SalaryExplainResponse {
  base_value: number;
  features: SHAPFeature[];
  waterfall: SHAPWaterfall[];
}

// ==================== Forecasting ====================

export interface ForecastPoint {
  date: string;
  value: number;
  lower_bound?: number | null;
  upper_bound?: number | null;
}

export interface ForecastMetrics {
  mae: number;
  rmse: number;
  mape: number;
}

export interface ForecastResponse {
  skill: string;
  model: string;
  historical: ForecastPoint[];
  forecast: ForecastPoint[];
  metrics: ForecastMetrics;
}

// ==================== Resume ====================

export interface ContactInfo {
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
}

export interface ATSBreakdown {
  keyword_score: number;
  impact_score: number;
  formatting_score: number;
  section_score: number;
  experience_score: number;
  action_verbs_count: number;
  metrics_count: number;
  contact_info: ContactInfo;
  sections_found: string[];
  sections_missing: string[];
}

export interface ResumeAnalysis {
  ats_score: number;
  skills_found: string[];
  missing_skills: string[];
  experience_years: number;
  education_level: string;
  suggested_roles: { role: string; match_score: number }[];
  summary: string;
  formatting_score?: number;
  impact_score?: number;
  ats_breakdown?: ATSBreakdown;
  ats_recommendations?: string[];
  ats_sample_resumes?: Record<string, string>;
  contact_info?: ContactInfo;
  target_role?: string;
  match_score?: number;
}


export interface ResumeMatchRequest {
  resume_text: string;
  target_role: string;
}

export interface ResumeMatchResponse {
  match_score: number;
  matching_skills: string[];
  gap_skills: string[];
  recommendations: string[];
}

// ==================== Skill Gap / Roadmap ====================

export interface SkillGapItem {
  skill: string;
  importance: string;
  learning_effort: string;
}

export interface SkillGapResponse {
  current_skills: string[];
  target_skills: string[];
  common_skills: string[];
  gaps: SkillGapItem[];
  match_score: number;
}

export interface RoadmapResource {
  name: string;
  url: string;
}

export interface RoadmapStage {
  order: number;
  title: string;
  skills: string[];
  duration_weeks: number;
  resources: RoadmapResource[];
}

export interface RoadmapResponse {
  role: string;
  stages: RoadmapStage[];
}

// ==================== Skill Graph ====================

export interface SkillGraphNode {
  id: string;
  name: string;
  category: string;
  weight: number;
  cluster: string;
}

export interface SkillGraphEdge {
  source: string;
  target: string;
  weight: number;
  relationship: string;
}

export interface SkillGraphResponse {
  nodes: SkillGraphNode[];
  edges: SkillGraphEdge[];
}

export interface CareerPathNode {
  skill: string;
  level: string;
}

export interface CareerPath {
  nodes: CareerPathNode[];
  total_effort: number;
}

// ==================== Geographic ====================

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  value: number;
  count: number;
  growth: number;
}

export interface GeographicResponse {
  locations: GeoLocation[];
  summary: { total: number; avg_value: number; top_region: string };
}

// ==================== Trends ====================

export interface WeeklyTrendEntry {
  name: string;
  rank: number;
  change: number;
}

export interface WeeklyTrendWeek {
  week_start: string;
  top_skills: WeeklyTrendEntry[];
  market_pulse: number;
  new_jobs: number;
}

export interface WeeklyTrend {
  weeks: WeeklyTrendWeek[];
  summary: { total_change: number; fastest_growing: string; fastest_declining: string };
}

export interface QuarterlySkill {
  name: string;
  growth_rate: number;
  demand_score: number;
}

export interface QuarterlyReportQuarter {
  quarter: string;
  skills: QuarterlySkill[];
  industry_trends: { industry: string; growth: number }[];
}

export interface QuarterlyReport {
  quarters: QuarterlyReportQuarter[];
  summary: { top_skill: string; top_industry: string; avg_growth: number };
}

// ==================== Executive ====================

export interface ExecutiveViewData {
  top_roles?: { role: string; growth: number; avg_salary: number }[];
  salary_benchmarks?: { role: string; p25: number; p50: number; p75: number }[];
  skill_gaps?: { skill: string; demand: number; supply: number }[];
  market_outlook?: { outlook: string; hiring_intent: number; avg_salary_growth: number; top_industries_hiring: string[] };
  talent_scarcity?: { role: string; scarcity_index: number; avg_days_to_hire: number }[];
  hiring_trends?: { quarter: string; tech_hires: number; avg_salary: number }[];
  salary_ranges?: { role: string; min: number; max: number; median: number }[];
  candidate_clusters?: { cluster: string; count: number; traits: string[] }[];
  workforce_trends?: { trend: string; impact: string; workforce_affected_pct: number }[];
  strategic_insights?: string[];
  competitive_landscape?: { company: string; hiring_volume: number; avg_salary: number; top_focus: string }[];
  kpi_summary?: { total_jobs_market: number; avg_salary_yoy_growth: number; talent_scarcity_index: number; market_health_score: number; projected_growth_next_quarter: number };
}

// ==================== Chat ====================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
  sources?: { title: string; relevance: number }[];
  suggested_questions: string[];
}

// ==================== UI Types ====================

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  format?: 'currency' | 'percent' | 'number';
}
