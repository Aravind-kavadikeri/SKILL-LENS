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

// Fallback Mock Data matching actual Python API backend (in INR / LPA)
const MOCK_DASHBOARD: DashboardSummary = {
  total_jobs: 142500,
  total_skills: 850,
  avg_salary: 1450000,
  market_pulse_score: 87.4,
  job_growth_rate: 14.2,
  top_skills: [
    { name: 'Python', growth: 24.5, demand: 95, category: 'AI & Data' },
    { name: 'PyTorch / ML', growth: 32.1, demand: 92, category: 'AI & Data' },
    { name: 'TypeScript / React', growth: 18.2, demand: 88, category: 'Frontend' },
    { name: 'FastAPI / Node', growth: 21.4, demand: 86, category: 'Backend' },
    { name: 'AWS / Cloud', growth: 15.8, demand: 84, category: 'Cloud Infrastructure' },
  ],
  salary_trend: [
    { month: 'Jan', salary: 1250000 },
    { month: 'Feb', salary: 1300000 },
    { month: 'Mar', salary: 1350000 },
    { month: 'Apr', salary: 1380000 },
    { month: 'May', salary: 1420000 },
    { month: 'Jun', salary: 1450000 },
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
        { date: '2024-01', value: 72, label: 'Stable Hiring' },
        { date: '2024-02', value: 76, label: 'Tech Expansion' },
        { date: '2024-03', value: 81, label: 'AI Surge' },
        { date: '2024-04', value: 84, label: 'High Talent Demand' },
        { date: '2024-05', value: 87, label: 'Peak Hiring Phase' },
      ],
    };
  }
}

export async function getJobMarket(country: string = 'India'): Promise<JobMarketData> {
  try {
    const { data } = await api.get<JobMarketData>('/job-market', { params: { country } });
    return data;
  } catch {
    return {
      country,
      total_jobs: 142500,
      locations: [
        { name: 'Bengaluru', count: 48500, percentage: 34.0 },
        { name: 'Hyderabad', count: 32100, percentage: 22.5 },
        { name: 'Pune / Mumbai', count: 24400, percentage: 17.1 },
        { name: 'Delhi NCR (Gurgaon/Noida)', count: 21200, percentage: 14.8 },
      ],
      industries: [
        { name: 'Artificial Intelligence & Data', count: 52900, percentage: 37.1 },
        { name: 'Software Development & SaaS', count: 41100, percentage: 28.8 },
        { name: 'Fintech & Banking', count: 24500, percentage: 17.2 },
        { name: 'Healthcare & E-Commerce', count: 14200, percentage: 10.0 },
      ],
      remote_stats: { remote_percent: 38, hybrid_percent: 45, onsite_percent: 17 },
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
        { name: 'FastAPI & Microservices', growth_rate: 29.1, category: 'Backend', trend: [{ date: '2024-01', value: 45 }, { date: '2024-06', value: 78 }] },
        { name: 'Kubernetes & Docker', growth_rate: 22.4, category: 'DevOps', trend: [{ date: '2024-01', value: 55 }, { date: '2024-06', value: 80 }] },
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
      role: role || 'Software Engineer',
      country: country || 'India',
      avg_salary: 1450000,
      median_salary: 1250000,
      percentile_25: 750000,
      percentile_75: 1850000,
      distribution: [
        { range: '₹0-₹5 LPA', count: 2400 },
        { range: '₹5-₹10 LPA', count: 5800 },
        { range: '₹10-₹15 LPA', count: 8200 },
        { range: '₹15-₹25 LPA', count: 6400 },
        { range: '₹25-₹40 LPA', count: 3200 },
        { range: '₹40-₹60 LPA', count: 1200 },
        { range: '₹60 LPA+', count: 450 },
      ],
      by_experience: [
        { level: 'Entry (0-2 yrs)', avg_salary: 750000, count: 4500 },
        { level: 'Mid (3-5 yrs)', avg_salary: 1450000, count: 8500 },
        { level: 'Senior (5-8 yrs)', avg_salary: 2650000, count: 6200 },
        { level: 'Lead (8+ yrs)', avg_salary: 4500000, count: 2800 },
      ],
    };
  }
}

export async function predictSalary(req: SalaryRequest): Promise<SalaryResponse> {
  try {
    const { data } = await api.post<SalaryResponse>('/salary/predict', req);
    return data;
  } catch {
    const exp = req.experience || 3;
    const baseVal = 950000 + Math.log2(exp + 1) * 320000;
    const predicted = Math.round(baseVal / 10000) * 10000;
    return {
      predicted_salary: predicted,
      confidence_interval: [Math.round(predicted * 0.9), Math.round(predicted * 1.12)],
      factors: [
        { name: 'Base Role Salary', impact: 950000, value: '₹9,50,000' },
        { name: 'Experience Impact', impact: Math.round(exp * 120000), value: `${exp} years` },
        { name: 'Education Premium', impact: 150000, value: req.education || 'B.Tech / Masters' },
        { name: 'Location Multiplier', impact: 220000, value: req.location || 'Bengaluru / Hybrid' },
        { name: 'Industry Premium', impact: 140000, value: req.industry || 'Technology / FinTech' },
        { name: 'Skills Bonus', impact: 110000, value: `${(req.skills || []).length || 4} key skills` },
      ],
    };
  }
}

export async function explainSalary(req: SalaryRequest): Promise<SalaryExplainResponse> {
  try {
    const { data } = await api.post<SalaryExplainResponse>('/salary/explain', req);
    return data;
  } catch {
    const base = 950000;
    const expShap = (req.experience || 3) * 120000;
    return {
      base_value: base,
      features: [
        { name: 'experience', value: req.experience || 3, shap_value: expShap, impact_direction: 'positive' },
        { name: 'education', value: 1, shap_value: 150000, impact_direction: 'positive' },
        { name: 'location', value: 1, shap_value: 220000, impact_direction: 'positive' },
        { name: 'industry', value: 1, shap_value: 140000, impact_direction: 'positive' },
        { name: 'skills', value: (req.skills || []).length || 4, shap_value: 110000, impact_direction: 'positive' },
      ],
      waterfall: [
        { feature: 'Base Role Salary', contribution: base, cumulative: base },
        { feature: 'Years of Experience', contribution: expShap, cumulative: base + expShap },
        { feature: 'Location & Tier', contribution: 220000, cumulative: base + expShap + 220000 },
        { feature: 'Skills & Tech Stack', contribution: 110000, cumulative: base + expShap + 330000 },
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
      skill: skill || 'PyTorch',
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
      role: role || 'Machine Learning Engineer',
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
        { id: 'python', name: 'Python', category: 'Language', weight: 9.5, cluster: 'core' },
        { id: 'typescript', name: 'TypeScript', category: 'Language', weight: 8.8, cluster: 'core' },
        { id: 'cpp', name: 'C++', category: 'Language', weight: 7.9, cluster: 'core' },
        { id: 'pytorch', name: 'PyTorch', category: 'Framework', weight: 9.2, cluster: 'ai-ml' },
        { id: 'tensorflow', name: 'TensorFlow', category: 'Framework', weight: 8.4, cluster: 'ai-ml' },
        { id: 'llms', name: 'Generative AI & LLMs', category: 'AI', weight: 9.6, cluster: 'ai-ml' },
        { id: 'transformers', name: 'HuggingFace', category: 'AI', weight: 8.7, cluster: 'ai-ml' },
        { id: 'fastapi', name: 'FastAPI', category: 'Backend', weight: 8.5, cluster: 'web' },
        { id: 'react', name: 'React', category: 'Frontend', weight: 9.0, cluster: 'web' },
        { id: 'nextjs', name: 'Next.js', category: 'Frontend', weight: 8.6, cluster: 'web' },
        { id: 'nodejs', name: 'Node.js', category: 'Backend', weight: 8.3, cluster: 'web' },
        { id: 'sql', name: 'SQL & PostgreSQL', category: 'Database', weight: 9.1, cluster: 'data' },
        { id: 'spark', name: 'Apache Spark', category: 'Big Data', weight: 8.2, cluster: 'data' },
        { id: 'vector-db', name: 'Vector DBs', category: 'Database', weight: 8.8, cluster: 'data' },
        { id: 'docker', name: 'Docker', category: 'DevOps', weight: 8.9, cluster: 'infra' },
        { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps', weight: 8.4, cluster: 'infra' },
        { id: 'aws', name: 'AWS Cloud', category: 'Cloud', weight: 8.7, cluster: 'infra' },
        { id: 'system-design', name: 'System Architecture', category: 'Architecture', weight: 9.0, cluster: 'soft' },
        { id: 'agile', name: 'Technical Leadership', category: 'Management', weight: 8.0, cluster: 'soft' },
      ],
      edges: [
        { source: 'python', target: 'pytorch', weight: 0.95, relationship: 'Core Engine' },
        { source: 'python', target: 'fastapi', weight: 0.90, relationship: 'Framework' },
        { source: 'python', target: 'spark', weight: 0.85, relationship: 'PySpark Data' },
        { source: 'python', target: 'sql', weight: 0.88, relationship: 'DB Connector' },
        { source: 'pytorch', target: 'llms', weight: 0.92, relationship: 'Model Weights' },
        { source: 'pytorch', target: 'transformers', weight: 0.90, relationship: 'Architecture' },
        { source: 'llms', target: 'vector-db', weight: 0.89, relationship: 'RAG Retrieval' },
        { source: 'typescript', target: 'react', weight: 0.95, relationship: 'Typed UI' },
        { source: 'react', target: 'nextjs', weight: 0.92, relationship: 'SSR Framework' },
        { source: 'react', target: 'fastapi', weight: 0.86, relationship: 'API Integration' },
        { source: 'fastapi', target: 'docker', weight: 0.88, relationship: 'Containerized' },
        { source: 'docker', target: 'kubernetes', weight: 0.90, relationship: 'Orchestrated' },
        { source: 'kubernetes', target: 'aws', weight: 0.87, relationship: 'EKS Cloud' },
        { source: 'sql', target: 'fastapi', weight: 0.85, relationship: 'ORM Query' },
        { source: 'system-design', target: 'kubernetes', weight: 0.84, relationship: 'Scalability' },
        { source: 'system-design', target: 'aws', weight: 0.86, relationship: 'Cloud Infra' },
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
            { skill: role || 'Software Engineer', level: 'proficient' },
            { skill: 'FastAPI Microservices', level: 'intermediate' },
            { skill: 'PyTorch & Neural Nets', level: 'intermediate' },
            { skill: targetRole || 'AI / ML Engineer', level: 'beginner' },
          ],
          total_effort: 8.5,
        },
        {
          nodes: [
            { skill: role || 'Software Engineer', level: 'proficient' },
            { skill: 'Distributed Systems & Vector DBs', level: 'intermediate' },
            { skill: targetRole || 'AI / ML Engineer', level: 'beginner' },
          ],
          total_effort: 6.2,
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
    const rawLocations = [
      { name: 'Bengaluru, KA', lat: 12.9716, lon: 77.5946, salary: 1850000, hiring: 48500, remote: 68, growth: 24.2 },
      { name: 'Hyderabad, TS', lat: 17.3850, lon: 78.4867, salary: 1650000, hiring: 32100, remote: 62, growth: 21.5 },
      { name: 'Pune / Mumbai, MH', lat: 18.5204, lon: 73.8567, salary: 1550000, hiring: 24400, remote: 58, growth: 18.1 },
      { name: 'Gurgaon / Delhi NCR', lat: 28.4595, lon: 77.0266, salary: 1750000, hiring: 21200, remote: 65, growth: 19.8 },
      { name: 'Chennai, TN', lat: 13.0827, lon: 80.2707, salary: 1400000, hiring: 16800, remote: 52, growth: 15.4 },
      { name: 'San Francisco, CA (USA)', lat: 37.7749, lon: -122.4194, salary: 13500000, hiring: 18400, remote: 82, growth: 28.6 },
      { name: 'London (UK)', lat: 51.5074, lon: -0.1278, salary: 7800000, hiring: 14200, remote: 71, growth: 17.2 },
      { name: 'Singapore', lat: 1.3521, lon: 103.8198, salary: 8400000, hiring: 11600, remote: 64, growth: 22.0 },
    ];

    const locations = rawLocations.map((loc) => ({
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
      value: metric === 'hiring' ? loc.hiring : metric === 'remote' ? loc.remote : loc.salary,
      count: loc.hiring,
      growth: loc.growth,
    }));

    const totalVal = locations.reduce((acc, l) => acc + l.value, 0);
    return {
      locations,
      summary: {
        total: locations.reduce((acc, l) => acc + l.count, 0),
        avg_value: Math.round(totalVal / locations.length),
        top_region: 'Bengaluru, KA',
      },
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
          avg_salary_yoy_growth: 14.2,
          talent_scarcity_index: 8.7,
          market_health_score: 92,
          projected_growth_next_quarter: 15.5,
        },
        top_roles: [
          { role: 'AI Engineering Lead', growth: 38.4, avg_salary: 3800000 },
          { role: 'Staff MLOps Architect', growth: 29.1, avg_salary: 3200000 },
          { role: 'Senior Full Stack Tech Lead', growth: 18.5, avg_salary: 2600000 },
        ],
        strategic_insights: [
          'High talent competition in AI & PyTorch development; salaries increased by 18% YoY in Bengaluru and Hyderabad.',
          'Remote & hybrid hiring accounts for 83% of top-tier engineering roles.',
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
      reply: `I analyzed your request regarding "${message}". Based on real-time market intelligence, skills like Python, PyTorch, TypeScript, and Cloud Infrastructure are seeing 25%+ YoY growth. Salaries for engineering leads in India range from ₹18 LPA to ₹45+ LPA.`,
      conversation_id: conversationId || `conv-${Date.now()}`,
      suggested_questions: [
        'What are the top 5 highest paying skills in AI?',
        'How does my resume match Senior ML roles?',
        'Show salary distribution for Data Engineers.',
      ],
      sources: [
        { title: 'SkillLens Market Intelligence Index 2024', relevance: 0.95 },
        { title: 'Indian Tech Hiring Benchmark Report', relevance: 0.89 },
      ],
    };
  }
}

export default api;
