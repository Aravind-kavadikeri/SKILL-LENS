'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  Download,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Award,
  Zap,
  Briefcase,
  GraduationCap,
  ListChecks,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { analyzeResume } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { cn } from '@/lib/utils';

const TARGET_ROLES = [
  'Software Engineer',
  'Data Scientist',
  'ML Engineer',
  'DevOps Engineer',
  'Data Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Product Manager',
  'Data Analyst',
  'Cloud Architect',
  'Security Engineer',
  'AI Researcher',
  'Business Analyst',
  'QA Engineer',
];

const SAMPLE_RESUME = `Jane Doe
Email: jane.doe@example.com | Phone: +1 (555) 234-5678
LinkedIn: linkedin.com/in/janedoe | GitHub: github.com/janedoe

Professional Summary:
Results-driven Senior Data Scientist with 6+ years of experience in machine learning, NLP, and predictive analytics.

Work Experience:
Senior Data Scientist - TechCorp (2021 - Present)
- Architected scalable machine learning pipelines using Python, PyTorch, and Docker, serving 1M+ daily users.
- Spearheaded a customer churn prediction model that reduced churn by 18% and saved $450k annually.
- Optimized NLP feature extraction speed by 40% using SpaCy and Transformers.
- Mentored a team of 4 junior data scientists and conducted code reviews.

Data Analyst - DataInc (2018 - 2021)
- Engineered SQL queries and Tableau dashboards for executive decision making.
- Conducted A/B testing on product recommendation algorithms.

Education:
M.Tech in Computer Science - IIT Bombay (2016 - 2018)
B.Tech in Information Technology - NIT Trichy (2012 - 2016)

Skills:
Python, SQL, PyTorch, TensorFlow, Scikit-Learn, Docker, AWS, Spark, Tableau, Git, NLP, Deep Learning, Statistics
`;

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState<string>('Software Engineer');
  const [showJdInput, setShowJdInput] = useState<boolean>(false);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'checklist' | 'keywords' | 'impact' | 'roles'>('checklist');

  const mutation = useMutation({
    mutationFn: (f: File) => analyzeResume(f, targetRole, jobDescription.trim() || undefined),
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const handleAnalyze = () => {
    if (file) mutation.mutate(file);
  };

  const handleSample = () => {
    const blob = new Blob([SAMPLE_RESUME], { type: 'text/plain' });
    const sampleFile = new File([blob], 'jane-doe-sample-resume.txt', { type: 'text/plain' });
    setFile(sampleFile);
    mutation.mutate(sampleFile);
  };

  const analysis = mutation.data;
  const breakdown = analysis?.ats_breakdown;
  const contact = analysis?.contact_info;

  return (
    <div className="space-y-6">
      <PageHeader
        title="ATS Resume Analyzer"
        description="Multi-Pillar ATS Scoring, Keyword Gap Analysis & Impact Optimization"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Configuration & File Upload */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
                  isDragActive ? 'border-primary bg-primary/5' : 'border-gray-700 hover:border-gray-500'
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                <p className="text-sm font-medium text-text-primary">
                  {isDragActive ? 'Drop resume here' : 'Drag & drop PDF, DOCX, or TXT'}
                </p>
                <p className="text-xs text-text-secondary mt-1">Maximum file size: 10MB</p>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-surface/30 border border-gray-800/60">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-text-primary flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-text-secondary">{(file.size / 1024).toFixed(0)} KB</span>
                </div>
              )}

              {/* Target Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-primary" />
                  Target Role Strategy
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-surface/50 border border-gray-800/80 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  {TARGET_ROLES.map((r) => (
                    <option key={r} value={r} className="bg-background text-text-primary">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle Job Description */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowJdInput(!showJdInput)}
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  {showJdInput ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {showJdInput ? 'Hide Job Description' : '+ Paste Target Job Description (Optional)'}
                </button>

                {showJdInput && (
                  <div className="mt-2.5 space-y-1">
                    <textarea
                      rows={4}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste target job description text here for precise JD skill gap analysis..."
                      className="w-full bg-surface/50 border border-gray-800/80 rounded-lg p-2.5 text-xs text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                )}
              </div>

              <Button className="w-full gap-2 font-semibold" onClick={handleAnalyze} disabled={!file || mutation.isPending}>
                <Sparkles className="h-4 w-4" />
                {mutation.isPending ? 'Analyzing ATS Output...' : 'Analyze Resume'}
              </Button>

              <Button variant="outline" className="w-full gap-2 text-xs" onClick={handleSample} disabled={mutation.isPending}>
                <Download className="h-3.5 w-3.5" />
                Load Sample Candidate Resume
              </Button>
            </CardContent>
          </Card>

          {/* Quick Guide Card */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                ATS Optimization Pillars
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-text-secondary">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">40%</span>
                <span>Keyword & Technical Skill Density for Target Role</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">25%</span>
                <span>Quantifiable Impact (%, $, numbers) & Action Verbs</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">20%</span>
                <span>Formatting & Parser Compatibility</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">15%</span>
                <span>Standard Section Headers & Experience Alignment</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Results & Multi-Pillar Dashboard */}
        <div className="lg:col-span-2 space-y-4">
          {mutation.isPending ? (
            <div className="space-y-4">
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          ) : mutation.error ? (
            <AlertBanner message={(mutation.error as Error)?.message || 'Analysis failed'} onRetry={handleAnalyze} />
          ) : analysis ? (
            <>
              {/* Overall ATS Score Header Card */}
              <Card className="border-primary/20 bg-surface/40">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-28 h-28 shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a2e" strokeWidth="8" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={
                              analysis.ats_score >= 75
                                ? '#00F5D4'
                                : analysis.ats_score >= 50
                                ? '#F59E0B'
                                : '#E94560'
                            }
                            strokeWidth="8"
                            strokeDasharray={`${(2 * Math.PI * 45 * analysis.ats_score) / 100} ${
                              (2 * Math.PI * 45 * (100 - analysis.ats_score)) / 100
                            }`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                          <text
                            x="50"
                            y="50"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-3xl font-extrabold fill-text-primary"
                          >
                            {Math.round(analysis.ats_score)}
                          </text>
                        </svg>
                      </div>

                      <div className="space-y-1.5 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <StatusBadge
                            status={
                              analysis.ats_score >= 75
                                ? 'success'
                                : analysis.ats_score >= 50
                                ? 'warning'
                                : 'error'
                            }
                            label={
                              analysis.ats_score >= 75
                                ? 'Well Optimized'
                                : analysis.ats_score >= 50
                                ? 'Needs Optimization'
                                : 'Low ATS Compatibility'
                            }
                          />
                          <Badge variant="outline" className="text-xs border-primary/40 text-primary">
                            Target: {analysis.target_role || targetRole}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed max-w-md">
                          {analysis.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4 Pillars Sub-Score Progress Bars */}
                  {breakdown && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-gray-800/60">
                      <div className="p-2.5 rounded-lg bg-surface/30 border border-gray-800/40 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">Keywords</span>
                          <span className="font-semibold text-text-primary">{Math.round(breakdown.keyword_score)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, breakdown.keyword_score)}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface/30 border border-gray-800/40 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">Impact</span>
                          <span className="font-semibold text-text-primary">{Math.round(breakdown.impact_score)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, breakdown.impact_score)}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface/30 border border-gray-800/40 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">Formatting</span>
                          <span className="font-semibold text-text-primary">{Math.round(breakdown.formatting_score)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, breakdown.formatting_score)}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface/30 border border-gray-800/40 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">Sections</span>
                          <span className="font-semibold text-text-primary">{Math.round(breakdown.section_score)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-400 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, breakdown.section_score)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-800/80 gap-4 overflow-x-auto text-sm">
                <button
                  onClick={() => setActiveTab('checklist')}
                  className={cn(
                    'pb-3 pt-1 px-1 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap',
                    activeTab === 'checklist'
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  )}
                >
                  <ListChecks className="h-4 w-4" />
                  ATS Recommendations & Audit
                </button>

                <button
                  onClick={() => setActiveTab('keywords')}
                  className={cn(
                    'pb-3 pt-1 px-1 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap',
                    activeTab === 'keywords'
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  )}
                >
                  <Target className="h-4 w-4" />
                  Skills & Keyword Gap
                </button>

                <button
                  onClick={() => setActiveTab('impact')}
                  className={cn(
                    'pb-3 pt-1 px-1 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap',
                    activeTab === 'impact'
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  )}
                >
                  <Zap className="h-4 w-4" />
                  Impact & Action Verbs
                </button>

                <button
                  onClick={() => setActiveTab('roles')}
                  className={cn(
                    'pb-3 pt-1 px-1 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap',
                    activeTab === 'roles'
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  )}
                >
                  <Briefcase className="h-4 w-4" />
                  Role Fit & DNA
                </button>
              </div>

              {/* TAB 1: ATS Recommendations & Audit */}
              {activeTab === 'checklist' && (
                <div className="space-y-4">
                  {/* Actionable Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Priority Action Items for ATS Optimization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(analysis.ats_recommendations || []).length > 0 ? (
                        (analysis.ats_recommendations || []).map((rec, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-lg bg-surface/30 border border-gray-800/60 text-sm"
                          >
                            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                            <span className="text-text-primary leading-snug">{rec}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-text-secondary">No critical ATS issues detected!</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contact Info & Section Audit Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Info Audit */}
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">Contact Details Check</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded bg-surface/20">
                          <span className="flex items-center gap-2 text-text-secondary">
                            <Mail className="h-3.5 w-3.5 text-primary" /> Email Address
                          </span>
                          {contact?.email ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" /> {contact.email}
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle className="h-3.5 w-3.5" /> Missing
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-2 rounded bg-surface/20">
                          <span className="flex items-center gap-2 text-text-secondary">
                            <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
                          </span>
                          {contact?.phone ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" /> {contact.phone}
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle className="h-3.5 w-3.5" /> Missing
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-2 rounded bg-surface/20">
                          <span className="flex items-center gap-2 text-text-secondary">
                            <Linkedin className="h-3.5 w-3.5 text-primary" /> LinkedIn Profile
                          </span>
                          {contact?.linkedin ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-medium truncate max-w-[160px]">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Verified
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1">
                              <AlertCircle className="h-3.5 w-3.5" /> Not Found
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-2 rounded bg-surface/20">
                          <span className="flex items-center gap-2 text-text-secondary">
                            <Github className="h-3.5 w-3.5 text-primary" /> GitHub Profile
                          </span>
                          {contact?.github ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-medium truncate max-w-[160px]">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Verified
                            </span>
                          ) : (
                            <span className="text-text-secondary flex items-center gap-1">
                              Optional
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Section Headers Audit */}
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">Standard Sections Check</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        {['Experience', 'Education', 'Skills', 'Projects', 'Certifications'].map((sec) => {
                          const isFound = (breakdown?.sections_found || []).includes(sec);
                          return (
                            <div key={sec} className="flex items-center justify-between p-2 rounded bg-surface/20">
                              <span className="text-text-secondary font-medium">{sec} Section</span>
                              {isFound ? (
                                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Detected
                                </span>
                              ) : (
                                <span className="text-rose-400 flex items-center gap-1">
                                  <XCircle className="h-3.5 w-3.5" /> Missing / Unclear
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* TAB 2: Skills & Keyword Gap */}
              {activeTab === 'keywords' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Found Skills */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>Skills Detected in Resume</span>
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/40">
                            {(analysis.skills_found || []).length} Total
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(analysis.skills_found || []).length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {(analysis.skills_found || []).map((s) => (
                              <Badge key={s} variant="default" className="bg-primary/10 text-primary border-primary/30">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-text-secondary text-sm">No standard technical skills detected</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Missing Skills */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>Missing Key Skills for {analysis.target_role || targetRole}</span>
                          <Badge variant="outline" className="text-rose-400 border-rose-500/40">
                            {(analysis.missing_skills || []).length} Gaps
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(analysis.missing_skills || []).length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {(analysis.missing_skills || []).map((s) => (
                              <Badge key={s} variant="destructive" className="bg-rose-500/10 text-rose-400 border-rose-500/30">
                                + {s}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-text-secondary text-sm">No critical skill gaps identified!</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* TAB 3: Impact & Action Verbs */}
              {activeTab === 'impact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-surface/30">
                      <CardContent className="p-4 space-y-1">
                        <span className="text-xs text-text-secondary font-medium">Action Verbs Count</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold text-text-primary">
                            {breakdown?.action_verbs_count || 0}
                          </span>
                          <span className="text-xs text-emerald-400 font-medium">
                            {(breakdown?.action_verbs_count || 0) >= 5 ? 'Strong Impact' : 'Needs Action Verbs'}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary pt-1">
                          Action verbs like <em>Architected, Spearheaded, Scaled, Optimized</em> improve recruiter engagement.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-surface/30">
                      <CardContent className="p-4 space-y-1">
                        <span className="text-xs text-text-secondary font-medium">Quantifiable Metrics Found</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold text-text-primary">
                            {breakdown?.metrics_count || 0}
                          </span>
                          <span className="text-xs text-emerald-400 font-medium">
                            {(breakdown?.metrics_count || 0) >= 3 ? 'High Credibility' : 'Add %, $, numbers'}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary pt-1">
                          Resumes with metrics receive up to 40% higher response rates from automated screening.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bullet Rewrite Advice */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-400" />
                        Impact Optimization Formula
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs text-text-secondary">
                      <div className="p-3 rounded-lg bg-surface/20 border border-gray-800/40">
                        <p className="font-semibold text-text-primary mb-1">Standard Weak Bullet:</p>
                        <p className="italic text-rose-300 font-mono">"Responsible for building machine learning models for customer churn."</p>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                        <p className="font-semibold text-emerald-400 mb-1">ATS High-Impact Bullet Formula:</p>
                        <p className="font-mono text-emerald-300">
                          [Strong Action Verb] + [Core Skill / Technology] + [Quantifiable Metric / Impact]
                        </p>
                        <p className="mt-1.5 text-text-primary font-mono italic">
                          "Architected XGBoost churn prediction model using Python & AWS, reducing customer churn by 18% and saving $450k annually."
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 4: Role Fit & Candidate DNA */}
              {activeTab === 'roles' && (
                <div className="space-y-4">
                  {/* Candidate DNA Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        Candidate DNA Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-3.5 rounded-xl bg-surface/30 border border-gray-800/60">
                          <p className="text-xs text-text-secondary">Total Experience</p>
                          <p className="text-xl font-bold text-text-primary mt-1">
                            {analysis.experience_years} years
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-surface/30 border border-gray-800/60">
                          <p className="text-xs text-text-secondary">Highest Education Level</p>
                          <p className="text-xl font-bold text-text-primary mt-1 capitalize">
                            {analysis.education_level || 'N/A'}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-surface/30 border border-gray-800/60">
                          <p className="text-xs text-text-secondary">Identified Tech Skills</p>
                          <p className="text-xl font-bold text-text-primary mt-1">
                            {(analysis.skills_found || []).length} skills
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Best Match Roles Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Top Best-Fit Roles</CardTitle>
                      <CardDescription>Roles matching your current resume skills and background</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(analysis.suggested_roles || []).length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-800/60">
                                <th className="text-left py-3 pr-4 text-text-secondary font-medium">Role</th>
                                <th className="text-right py-3 text-text-secondary font-medium">Match Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(analysis.suggested_roles || []).map((r, i) => (
                                <tr key={i} className="border-b border-gray-800/30 hover:bg-white/5 transition-colors">
                                  <td className="py-3 pr-4 text-text-primary font-medium">{r.role}</td>
                                  <td className="py-3 text-right">
                                    <StatusBadge
                                      status={i === 0 ? 'success' : i < 3 ? 'warning' : 'info'}
                                      value={`${Math.round(r.match_score)}%`}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-text-secondary text-sm">No role suggestions available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

            </>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="h-12 w-12 text-text-secondary/30 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-text-primary">No Resume Uploaded Yet</h3>
                <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                  Upload your resume in PDF or DOCX format or click "Load Sample Candidate Resume" to analyze ATS compatibility instantly.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

