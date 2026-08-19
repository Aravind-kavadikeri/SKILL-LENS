import axios, { AxiosError } from 'axios';
import type {
  DashboardSummary,
  MarketPulseResponse,
  MarketPulsePoint,
  JobMarketData,
  TrendingSkill,
  SkillScarcity,
  SalaryRequest,
  SalaryResponse,
  SalaryExplainResponse,
  ForecastResponse,
  ResumeAnalysis,
  ResumeMatchRequest,
  ResumeMatchResponse,
  SkillGapResponse,
  RoadmapResponse,
  SkillGraphResponse,
  CareerPath,
  GeographicResponse,
  WeeklyTrend,
  QuarterlyReport,
  ExecutiveViewData,
  ChatRequest,
  ChatResponse,
} from './types';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';


const baseURL = rawApiUrl.endsWith('/api/v1')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, '')}/api/v1`;

const api = axios.create({
  baseURL,
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      error.response?.data && typeof error.response.data === 'object'
        ? (error.response.data as { detail?: string }).detail || error.message
        : error.message;
    console.error(`API Error [${error.response?.status || 'network'}]: ${message}`);
    return Promise.reject(error);
  }
);

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>('/dashboard/summary');
  return data;
}

export async function getMarketPulse(): Promise<MarketPulseResponse> {
  const { data } = await api.get<MarketPulseResponse>('/dashboard/market-pulse');
  return data;
}

export async function getJobMarket(country: string): Promise<JobMarketData> {
  const { data } = await api.get<JobMarketData>('/job-market', { params: { country } });
  return data;
}

export async function getTrendingSkills(months: number = 6): Promise<{ skills: TrendingSkill[] }> {
  const { data } = await api.get<{ skills: TrendingSkill[] }>('/skills/trending', { params: { months } });
  return data;
}

export async function getSkillScarcity(topK: number = 10): Promise<{ skills: SkillScarcity[] }> {
  const { data } = await api.get<{ skills: SkillScarcity[] }>('/skills/scarcity', { params: { top_k: topK } });
  return data;
}

export async function getSalaryDistribution(role: string, country: string) {
  const { data } = await api.get('/salary/distribution', {
    params: { role, country },
  });
  return data;
}

export async function predictSalary(req: SalaryRequest): Promise<SalaryResponse> {
  const { data } = await api.post<SalaryResponse>('/salary/predict', req);
  return data;
}

export async function explainSalary(req: SalaryRequest): Promise<SalaryExplainResponse> {
  const { data } = await api.post<SalaryExplainResponse>('/salary/explain', req);
  return data;
}

export async function getForecast(
  skill: string,
  model: string = 'prophet',
  months: number = 12
): Promise<ForecastResponse> {
  const { data } = await api.get<ForecastResponse>('/forecast', {
    params: { skill, model, months },
  });
  return data;
}

export async function analyzeResume(
  file: File,
  targetRole?: string,
  jobDescription?: string
): Promise<ResumeAnalysis> {
  const formData = new FormData();
  formData.append('file', file);
  if (targetRole) formData.append('target_role', targetRole);
  if (jobDescription) formData.append('job_description', jobDescription);
  const { data } = await api.post<ResumeAnalysis>('/resume/analyze', formData);
  return data;
}


export async function matchResume(req: ResumeMatchRequest): Promise<ResumeMatchResponse> {
  const { data } = await api.post<ResumeMatchResponse>('/resume/match', req);
  return data;
}

export async function getSkillGap(currentRole: string, targetRole: string): Promise<SkillGapResponse> {
  const { data } = await api.get<SkillGapResponse>('/skill-gap', {
    params: { current_role: currentRole, target_role: targetRole },
  });
  return data;
}

export async function getRoadmap(role: string): Promise<RoadmapResponse> {
  const { data } = await api.get<RoadmapResponse>('/skill-gap/roadmap', { params: { role } });
  return data;
}

export async function getSkillGraph(): Promise<SkillGraphResponse> {
  const { data } = await api.get<SkillGraphResponse>('/skill-graph/nodes');
  return data;
}

export async function getCareerPaths(role: string, targetRole?: string): Promise<{ paths: CareerPath[] }> {
  const { data } = await api.get<{ paths: CareerPath[] }>('/skill-graph/paths', {
    params: { role, target_role: targetRole || role },
  });
  return data;
}

export async function getGeographic(metric: string = 'salary'): Promise<GeographicResponse> {
  const { data } = await api.get<GeographicResponse>('/geographic', { params: { metric } });
  return data;
}

export async function getWeeklyTrends(): Promise<WeeklyTrend> {
  const { data } = await api.get<WeeklyTrend>('/realtime/weekly');
  return data;
}

export async function getQuarterlyReport(): Promise<QuarterlyReport> {
  const { data } = await api.get<QuarterlyReport>('/realtime/quarterly');
  return data;
}

export async function getExecutiveView(view: string): Promise<Record<string, ExecutiveViewData>> {
  const { data } = await api.get<Record<string, ExecutiveViewData>>('/executive', { params: { view } });
  return data;
}

export async function sendChatMessage(
  message: string,
  conversationId?: string,
  context?: Record<string, unknown>
): Promise<ChatResponse> {
  const payload: ChatRequest = { message, conversation_id: conversationId, context };
  const { data } = await api.post<ChatResponse>('/chat', payload);
  return data;
}

export default api;
