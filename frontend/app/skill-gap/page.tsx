'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { getSkillGap, getRoadmap } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { RoleSelect } from '@/components/forms/RoleSelect';
import { cn, formatPercent } from '@/lib/utils';
import type { SkillGapItem } from '@/lib/types';

export default function SkillGapPage() {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analyze, setAnalyze] = useState(false);

  const { data: gapData, isLoading: gapLoading, error: gapError, refetch: gapRefetch } = useQuery({
    queryKey: ['skillGap', currentRole, targetRole],
    queryFn: () => getSkillGap(currentRole, targetRole),
    enabled: analyze && !!currentRole && !!targetRole,
  });

  const { data: roadmap, isLoading: roadLoading } = useQuery({
    queryKey: ['roadmap', targetRole],
    queryFn: () => getRoadmap(targetRole),
    enabled: !!gapData,
  });

  const handleAnalyze = () => {
    if (currentRole && targetRole) setAnalyze(true);
  };

  const isLoading = gapLoading || (gapData && roadLoading);
  const error = gapError;

  const importanceRank: Record<string, number> = { critical: 5, high: 4, medium: 3, low: 2, optional: 1 };

  const isGap = !!gapData;

  const gapChartData = gapData?.gaps
    .sort((a, b) => (importanceRank[b.importance] || 0) - (importanceRank[a.importance] || 0))
    .slice(0, 8)
    .map((g) => ({
      name: g.skill,
      gap: importanceRank[g.importance] || 3,
      fill: g.importance === 'critical' ? '#E94560' : g.importance === 'high' ? '#F59E0B' : g.importance === 'medium' ? '#5B5FEE' : '#00F5D4',
    })) || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Skill Gap Analysis" description="Bridge Your Career Gap" />

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-xs text-text-secondary">Current Role</label>
              <RoleSelect value={currentRole} onValueChange={setCurrentRole} placeholder="Select current role..." />
            </div>
            <ArrowRight className="h-6 w-6 text-text-secondary hidden sm:block mb-2" />
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-xs text-text-secondary">Target Role</label>
              <RoleSelect value={targetRole} onValueChange={setTargetRole} placeholder="Select target role..." />
            </div>
            <Button onClick={handleAnalyze} disabled={!currentRole || !targetRole} className="w-full sm:w-auto">
              Analyze Gap
            </Button>
          </div>
        </CardContent>
      </Card>

      {!isGap && !isLoading && !error && analyze && (
        <p className="text-text-secondary text-sm py-4 text-center">No gap data available for the selected roles</p>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : error ? (
        <AlertBanner message={(error as Error)?.message || 'Failed to analyze skill gap'} onRetry={() => { setAnalyze(false); setTimeout(() => gapRefetch(), 100); }} />
      ) : gapData ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Skill Match Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a2e" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none" stroke={gapData.match_score >= 70 ? '#00F5D4' : gapData.match_score >= 40 ? '#F59E0B' : '#E94560'}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 45 * gapData.match_score / 100} ${2 * Math.PI * 45 * (1 - gapData.match_score / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold fill-text-primary">
                      {gapData.match_score}
                    </text>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-text-primary">Readiness Score</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {gapData.match_score >= 70 ? 'Great alignment! Minor gaps to close.' :
                     gapData.match_score >= 40 ? 'Moderate gaps — focus on key skills.' :
                     'Significant gaps — structured learning recommended.'}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{gapData.current_skills.length} current skills</Badge>
                    <ArrowRight className="h-4 w-4 text-text-secondary" />
                    <Badge variant="default">{gapData.target_skills.length} target skills</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Gap Analysis</CardTitle>
                <CardDescription>Skills sorted by gap size and importance</CardDescription>
              </CardHeader>
              <CardContent>
                {gapChartData.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gapChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                        <XAxis type="number" stroke="#a0a0a0" fontSize={12} />
                        <YAxis type="category" dataKey="name" stroke="#a0a0a0" fontSize={12} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                        <Bar dataKey="gap" radius={[0, 4, 4, 0]}>
                          {gapChartData.map((entry, i) => (
                            <rect key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-8 text-center">No gaps identified</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Skills</CardTitle>
                <CardDescription>Skills you already have that match the target role</CardDescription>
              </CardHeader>
              <CardContent>
                {gapData.common_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {gapData.common_skills.map((s) => (
                      <Badge key={s} variant="default">{s}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-6 text-center">No overlapping skills found</p>
                )}
              </CardContent>
            </Card>
          </div>

          {roadmap && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Roadmap — {roadmap.role}</CardTitle>
                <CardDescription>Total stages: {roadmap.stages.length}</CardDescription>
              </CardHeader>
              <CardContent>
                {roadmap.stages.length > 0 ? (
                  <div className="relative pl-8 space-y-6">
                    <div className="absolute left-3.5 top-2 bottom-2 w-px bg-gray-700" />
                    {roadmap.stages.map((stage, i) => (
                      <div key={i} className="relative">
                        <div className={cn(
                          'absolute -left-5 w-3 h-3 rounded-full border-2 mt-1.5',
                          i === 0 ? 'border-primary bg-primary/20' : 'border-gray-600 bg-surface'
                        )} />
                        <div className="p-4 rounded-lg bg-surface/30 border border-gray-800/60">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-sm font-semibold text-text-primary">Stage {stage.order}: {stage.title}</h4>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-text-secondary shrink-0">
                              <Clock className="h-3 w-3" />
                              {stage.duration_weeks} weeks
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {stage.skills.map((s) => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                          {stage.resources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-800/60">
                              <div className="flex items-center gap-1 text-xs text-text-secondary mb-1">
                                <BookOpen className="h-3 w-3" />
                                Resources
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {stage.resources.map((r, j) => (
                                  <a key={j} href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{r.name}</a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm py-6 text-center">No roadmap stages available</p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}
