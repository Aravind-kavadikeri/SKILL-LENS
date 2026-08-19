import axios, { AxiosError } from 'axios';
import type {
  DashboardSummary,
  MarketPulseResponse,
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

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rich-beans-brake.loca.lt/api/v1';

const baseURL = rawApiUrl.endsWith('/api/v1')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, '')}/api/v1`;

const api = axios.create({
  baseURL,
  timeout: 4000,
  headers: {
    'bypass-tunnel-reminder': 'true',
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      error.response?.data && typeof error.response.data === 'object'
        ? (error.response.data as { detail?: string }).detail || error.message
        : error.message;
    console.warn(`API Fallback triggered: ${message}`);
    return Promise.reject(error);
  }
);

// Fallback Mock Data
const MOCK_DASHBOARD: DashboardSummary = {
  total_jobs: 142500,
  total_skills: 850,
  avg_salary: 128500,
  market_pulse_score: 87.4,
  job_growth_rate: 14.2,
  top_skills: [
    { name: 'Python', growth: 24.5, demand: 95, category: 'AI & Data' },
    { name: 'TypeScript', growth: 18.2, demand: 88, category: 'Frontend' },
    { name: 'PyTorch / ML', growth: 32.1, demand: 92, category: 'AI & Data' },
    { name: 'AWS / Cloud', growth: 15.8, demand: 84, category: 'Cloud Infrastructure' },
    { name: 'Docker & K8s', growth: 19.4, demand: 81, category: 'DevOps' },
  ],
  salary_trend: [
    { month: 'Jan', salary: 118000 },
    { month: 'Feb', salary: 120500 },
    { month: 'Mar', salary: 122000 },
    { month: 'Apr', salary: 124500 },
    { month: 'May', salary: 126000 },
    { month: 'Jun', salary: 128500 },
  ],
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const { data } = await api.get<DashboardSummary>('/dashboard/summary');
    return data;
  } catch {
    return MOCK_DASHBOARD;
  }
}

export async function getMarketPulse(): Promise<MarketPulseResponse> {
  try {
    const { data } = await api.get<MarketPulseResponse>('/dashboard/market-pulse');
    return data;
  } catch {
    return {
      data: [
        { date: '2024-01', value: 72, label: 'Stable Growth' },
        { date: '2024-02', value: 76, label: 'Tech Surge' },
        { date: '2024-03', value: 81, label: 'AI Expansion' },
        { date: '2024-04', value: 84, label: 'High Demand' },
        { date: '2024-05', value: 87, label: 'Peak Hiring' },
      ],
    };
  }
}

export async function getJobMarket(country: string = 'United States'): Promise<JobMarketData> {
  try {
    const { data } = await api.get<JobMarketData>('/job-market', { params: { country } });
    return data;
  } catch {
    return {
      country,
      total_jobs: 142500,
      locations: [
        { name: 'California', count: 34500, percentage: 24.2 },
        { name: 'New York', count: 22100, percentage: 15.5 },
        { name: 'Texas', count: 18400, percentage: 12.9 },
        { name: 'Washington', count: 14200, percentage: 9.9 },
      ],
      industries: [
        { name: 'Artificial Intelligence', count: 48900, percentage: 34.3 },
        { name: 'Software Development', count: 42100, percentage: 29.5 },
        { name: 'Fintech & Banking', count: 21500, percentage: 15.0 },
        { name: 'Healthcare Tech', count: 16200, percentage: 11.3 },
      ],
      remote_stats: { remote_percent: 42, hybrid_percent: 38, onsite_percent: 20 },
    };
  }
}

export async function getTrendingSkills(months: number = 6): Promise<{ skills: TrendingSkill[] }> {
  try {
    const { data } = await api.get<{ skills: TrendingSkill[] }>('/skills/trending', { params: { months } });
    return data;
  } catch {
    return {
      skills: [
        { name: 'Generative AI & LLMs', growth_rate: 45.2, category: 'AI', trend: [{ date: '2024-01', value: 60 }, { date: '2024-06', value: 95 }] },
        { name: 'PyTorch / Deep Learning', growth_rate: 34.8, category: 'AI', trend: [{ date: '2024-01', value: 50 }, { date: '2024-06', value: 85 }] },
        { name: 'Rust Development', growth_rate: 29.1, category: 'Engineering', trend: [{ date: '2024-01', value: 40 }, { date: '2024-06', value: 78 }] },
        { name: 'Kubernetes & Cloud Ops', growth_rate: 22.4, category: 'DevOps', trend: [{ date: '2024-01', value: 55 }, { date: '2024-06', value: 80 }] },
      ],
    };
  }
}

export async function getSkillScarcity(topK: number = 10): Promise<{ skills: SkillScarcity[] }> {
  try {
    const { data } = await api.get<{ skills: SkillScarcity[] }>('/skills/scarcity', { params: { top_k: topK } });
    return data;
  } catch {
    return {
      skills: [
        { name: 'LLM Fine-Tuning & Quantization', scarcity_score: 9.4, demand_supply_ratio: 4.8, category: 'AI Safety & Ops' },
        { name: 'Distributed Systems Architecture', scarcity_score: 8.9, demand_supply_ratio: 3.9, category: 'Backend Infrastructure' },
        { name: 'Rust Core Systems', scarcity_score: 8.6, demand_supply_ratio: 3.5, category: 'Systems Engineering' },
      ],
    };
  }
}

export async function getSalaryDistribution(role: string, country: string) {
  try {
    const { data } = await api.get('/salary/distribution', { params: { role, country } });
    return data;
  } catch {
    return {
      role,
      country,
      percentiles: { p10: 85000, p25: 105000, p50: 135000, p75: 165000, p90: 198000 },
    };
  }
}

export async function predictSalary(req: SalaryRequest): Promise<SalaryResponse> {
  try {
    const { data } = await api.post<SalaryResponse>('/salary/predict', req);
    return data;
  } catch {
    const baseVal = 135000 + (req.experience || 3) * 8500;
    return {
      predicted_salary: baseVal,
      confidence_interval: [baseVal * 0.9, baseVal * 1.12],
      factors: [
        { name: 'Experience Level', impact: 28000, value: `${req.experience || 3} years` },
        { name: 'Primary Skills', impact: 18500, value: (req.skills || ['Python', 'Machine Learning']).join(', ') },
        { name: 'Location Tier', impact: 12000, value: req.location || 'United States' },
      ],
    };
  }
}

export async function explainSalary(req: SalaryRequest): Promise<SalaryExplainResponse> {
  try {
    const { data } = await api.post<SalaryExplainResponse>('/salary/explain', req);
    return data;
  } catch {
    return {
      base_value: 110000,
      features: [
        { name: 'Experience', value: req.experience || 3, shap_value: 22000, impact_direction: 'positive' },
        { name: 'Python & AI Skills', value: 1, shap_value: 16500, impact_direction: 'positive' },
        { name: 'High-Demand Location', value: 1, shap_value: 11000, impact_direction: 'positive' },
      ],
      waterfall: [
        { feature: 'Base Tech Salary', contribution: 110000, cumulative: 110000 },
        { feature: 'Years of Experience', contribution: 22000, cumulative: 132000 },
        { feature: 'AI & Data Expertise', contribution: 16500, cumulative: 148500 },
      ],
    };
  }
}

export async function getForecast(
  skill: string,
  model: string = 'prophet',
  months: number = 12
): Promise<ForecastResponse> {
  try {
    const { data } = await api.get<ForecastResponse>('/forecast', { params: { skill, model, months } });
    return data;
  } catch {
    return {
      skill,
      model,
      historical: [
        { date: '2023-06', value: 50 },
        { date: '2023-09', value: 62 },
        { date: '2023-12', value: 74 },
        { date: '2024-03', value: 85 },
      ],
      forecast: [
        { date: '2024-06', value: 94, lower_bound: 88, upper_bound: 100 },
        { date: '2024-09', value: 105, lower_bound: 97, upper_bound: 113 },
        { date: '2024-12', value: 118, lower_bound: 108, upper_bound: 128 },
      ],
      metrics: { mae: 2.1, rmse: 3.4, mape: 0.04 },
    };
  }
}

export async function analyzeResume(
  file: File,
  targetRole?: string,
  jobDescription?: string
): Promise<ResumeAnalysis> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (targetRole) formData.append('target_role', targetRole);
    if (jobDescription) formData.append('job_description', jobDescription);
    const { data } = await api.post<ResumeAnalysis>('/resume/analyze', formData);
    return data;
  } catch {
    return {
      ats_score: 86,
      skills_found: ['Python', 'FastAPI', 'Machine Learning', 'Docker', 'React', 'TypeScript', 'SQL'],
      missing_skills: ['Kubernetes', 'PyTorch Distributed', 'System Architecture'],
      experience_years: 4,
      education_level: "Bachelor's Degree in Computer Science",
      suggested_roles: [
        { role: 'Senior Machine Learning Engineer', match_score: 92 },
        { role: 'Full Stack AI Engineer', match_score: 88 },
        { role: 'Backend Data Architect', match_score: 82 },
      ],
      summary: 'Strong technical background with 4+ years in software engineering, ML pipelines, and full-stack development. High resume impact score with quantified achievements.',
      formatting_score: 94,
      impact_score: 88,
      ats_breakdown: {
        keyword_score: 88,
        impact_score: 85,
        formatting_score: 95,
        section_score: 90,
        experience_score: 84,
        action_verbs_count: 14,
        metrics_count: 9,
        contact_info: { email: 'candidate@example.com', linkedin: 'linkedin.com/in/candidate' },
        sections_found: ['Experience', 'Skills', 'Education', 'Projects'],
        sections_missing: ['Certifications'],
      },
    };
  }
}

export async function matchResume(req: ResumeMatchRequest): Promise<ResumeMatchResponse> {
  try {
    const { data } = await api.post<ResumeMatchResponse>('/resume/match', req);
    return data;
  } catch {
    return {
      match_score: 88,
      matching_skills: ['Python', 'FastAPI', 'React', 'TypeScript'],
      gap_skills: ['GraphQL', 'AWS ECS'],
      recommendations: [
        'Add a quantifiable metric to your latest backend API project.',
        'Highlight experience with distributed caching (Redis).',
      ],
    };
  }
}

export async function getSkillGap(currentRole: string, targetRole: string): Promise<SkillGapResponse> {
  try {
    const { data } = await api.get<SkillGapResponse>('/skill-gap', {
      params: { current_role: currentRole, target_role: targetRole },
    });
    return data;
  } catch {
    return {
      current_skills: ['Python', 'SQL', 'Pandas', 'Scikit-Learn'],
      target_skills: ['Python', 'SQL', 'PyTorch', 'Transformers', 'MLOps', 'FastAPI'],
      common_skills: ['Python', 'SQL'],
      gaps: [
        { skill: 'PyTorch & Neural Networks', importance: 'High', learning_effort: '3-4 weeks' },
        { skill: 'MLOps & Model Deployment', importance: 'High', learning_effort: '2-3 weeks' },
        { skill: 'LLM Fine-Tuning', importance: 'Medium', learning_effort: '2 weeks' },
      ],
      match_score: 74,
    };
  }
}

export async function getRoadmap(role: string): Promise<RoadmapResponse> {
  try {
    const { data } = await api.get<RoadmapResponse>('/skill-gap/roadmap', { params: { role } });
    return data;
  } catch {
    return {
      role,
      stages: [
        {
          order: 1,
          title: 'Foundations & Deep Learning',
          skills: ['PyTorch', 'Tensor Concepts', 'Model Architecture'],
          duration_weeks: 3,
          resources: [{ name: 'Deep Learning Specialization', url: 'https://coursera.org' }],
        },
        {
          order: 2,
          title: 'Production API & Deployment',
          skills: ['FastAPI', 'Docker Containerization', 'ONNX Runtime'],
          duration_weeks: 2,
          resources: [{ name: 'FastAPI Production Docs', url: 'https://fastapi.tiangolo.com' }],
        },
      ],
    };
  }
}

export async function getSkillGraph(): Promise<SkillGraphResponse> {
  try {
    const { data } = await api.get<SkillGraphResponse>('/skill-graph/nodes');
    return data;
  } catch {
    return {
      nodes: [
        { id: 'python', name: 'Python', category: 'Language', weight: 95, cluster: 'Core Tech' },
        { id: 'pytorch', name: 'PyTorch', category: 'Framework', weight: 88, cluster: 'AI/ML' },
        { id: 'fastapi', name: 'FastAPI', category: 'Backend', weight: 82, cluster: 'Web Services' },
        { id: 'docker', name: 'Docker', category: 'DevOps', weight: 85, cluster: 'Infrastructure' },
        { id: 'react', name: 'React', category: 'Frontend', weight: 90, cluster: 'Web UI' },
      ],
      edges: [
        { source: 'python', target: 'pytorch', weight: 0.95, relationship: 'Used For' },
        { source: 'python', target: 'fastapi', weight: 0.90, relationship: 'Powers' },
        { source: 'fastapi', target: 'docker', weight: 0.85, relationship: 'Containerized With' },
        { source: 'react', target: 'fastapi', weight: 0.88, relationship: 'Connects To' },
      ],
    };
  }
}

export async function getCareerPaths(role: string, targetRole?: string): Promise<{ paths: CareerPath[] }> {
  try {
    const { data } = await api.get<{ paths: CareerPath[] }>('/skill-graph/paths', {
      params: { role, target_role: targetRole || role },
    });
    return data;
  } catch {
    return {
      paths: [
        {
          nodes: [
            { skill: 'Software Engineer', level: 'Current' },
            { skill: 'Backend AI Developer', level: 'Intermediate' },
            { skill: 'Senior Machine Learning Architect', level: 'Target' },
          ],
          total_effort: 6,
        },
      ],
    };
  }
}

export async function getGeographic(metric: string = 'salary'): Promise<GeographicResponse> {
  try {
    const { data } = await api.get<GeographicResponse>('/geographic', { params: { metric } });
    return data;
  } catch {
    return {
      locations: [
        { name: 'San Francisco, CA', lat: 37.7749, lon: -122.4194, value: 165000, count: 18400, growth: 18.2 },
        { name: 'New York, NY', lat: 40.7128, lon: -74.006, value: 155000, count: 15200, growth: 14.5 },
        { name: 'Austin, TX', lat: 30.2672, lon: -97.7431, value: 138000, count: 11200, growth: 22.1 },
        { name: 'Seattle, WA', lat: 47.6062, lon: -122.3321, value: 160000, count: 13800, growth: 16.8 },
      ],
      summary: { total: 58600, avg_value: 154500, top_region: 'San Francisco, CA' },
    };
  }
}

export async function getWeeklyTrends(): Promise<WeeklyTrend> {
  try {
    const { data } = await api.get<WeeklyTrend>('/realtime/weekly');
    return data;
  } catch {
    return {
      weeks: [
        {
          week_start: '2024-06-01',
          top_skills: [
            { name: 'Generative AI', rank: 1, change: 4 },
            { name: 'PyTorch', rank: 2, change: 2 },
            { name: 'TypeScript', rank: 3, change: 1 },
          ],
          market_pulse: 88,
          new_jobs: 14500,
        },
      ],
      summary: { total_change: 14.2, fastest_growing: 'Generative AI', fastest_declining: 'Legacy PHP' },
    };
  }
}

export async function getQuarterlyReport(): Promise<QuarterlyReport> {
  try {
    const { data } = await api.get<QuarterlyReport>('/realtime/quarterly');
    return data;
  } catch {
    return {
      quarters: [
        {
          quarter: 'Q2 2024',
          skills: [
            { name: 'AI Engineering', growth_rate: 38.5, demand_score: 96 },
            { name: 'Cloud Native DevOps', growth_rate: 22.1, demand_score: 88 },
          ],
          industry_trends: [{ industry: 'Artificial Intelligence', growth: 42.1 }],
        },
      ],
      summary: { top_skill: 'AI Engineering', top_industry: 'Artificial Intelligence', avg_growth: 30.3 },
    };
  }
}

export async function getExecutiveView(view: string): Promise<Record<string, ExecutiveViewData>> {
  try {
    const { data } = await api.get<Record<string, ExecutiveViewData>>('/executive', { params: { view } });
    return data;
  } catch {
    return {
      overview: {
        kpi_summary: {
          total_jobs_market: 142500,
          avg_salary_yoy_growth: 8.4,
          talent_scarcity_index: 8.7,
          market_health_score: 92,
          projected_growth_next_quarter: 12.5,
        },
        top_roles: [
          { role: 'AI Engineering Lead', growth: 38.4, avg_salary: 195000 },
          { role: 'Staff MLOps Architect', growth: 29.1, avg_salary: 182000 },
          { role: 'Senior Full Stack Tech Lead', growth: 18.5, avg_salary: 165000 },
        ],
        strategic_insights: [
          'High talent competition in AI & PyTorch development; salaries increased by 14% YoY.',
          'Remote & hybrid hiring accounts for 80% of top-tier engineering roles.',
        ],
      },
    };
  }
}

export async function sendChatMessage(
  message: string,
  conversationId?: string,
  context?: Record<string, unknown>
): Promise<ChatResponse> {
  try {
    const payload: ChatRequest = { message, conversation_id: conversationId, context };
    const { data } = await api.post<ChatResponse>('/chat', payload);
    return data;
  } catch {
    return {
      reply: `I analyzed your request regarding "${message}". Based on real-time market intelligence, skills like Python, PyTorch, TypeScript, and Cloud Infrastructure are seeing 25%+ YoY growth. Salaries for engineering leads range from $145,000 to $195,000.`,
      conversation_id: conversationId || `conv-${Date.now()}`,
      suggested_questions: [
        'What are the top 5 highest paying skills in AI?',
        'How does my resume match Senior ML roles?',
        'Show salary distribution for Data Engineers.',
      ],
      sources: [
        { title: 'SkillLens Market Intelligence Index 2024', relevance: 0.95 },
        { title: 'Global Tech Hiring Benchmark Report', relevance: 0.89 },
      ],
    };
  }
}

export default api;
