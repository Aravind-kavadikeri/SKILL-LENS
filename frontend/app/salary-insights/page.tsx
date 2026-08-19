'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { predictSalary, explainSalary } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { Input } from '@/components/ui/input';
import { RoleSelect } from '@/components/forms/RoleSelect';
import { LocationSelect } from '@/components/forms/LocationSelect';
import { ExperienceSlider } from '@/components/forms/ExperienceSlider';
import { EducationSelect } from '@/components/forms/EducationSelect';
import { MetricDelta } from '@/components/feedback/MetricDelta';
import { cn, formatCurrency } from '@/lib/utils';

export default function SalaryInsightsPage() {
  const { selectedRole, setRole } = useAppStore();
  const [location, setLocation] = useState('United States');
  const [experience, setExperience] = useState(5);
  const [education, setEducation] = useState("Bachelor's Degree");
  const [industry, setIndustry] = useState('');

  const predictMutation = useMutation({
    mutationFn: () =>
      predictSalary({
        role: selectedRole || '',
        location,
        experience,
        education,
        industry: industry || '',
        skills: [],
      }),
  });

  const explainMutation = useMutation({
    mutationFn: () =>
      explainSalary({
        role: selectedRole || '',
        location,
        experience,
        education,
        industry: industry || '',
        skills: [],
      }),
  });

  const handlePredict = () => {
    if (!selectedRole) return;
    predictMutation.mutate();
    explainMutation.mutate();
  };

  const prediction = predictMutation.data;
  const explanation = explainMutation.data;

  const expChartData = [
    { level: '0-2 yrs', salary: prediction ? prediction.predicted_salary * 0.6 : 0 },
    { level: '3-5 yrs', salary: prediction ? prediction.predicted_salary * 0.85 : 0 },
    { level: '5-7 yrs', salary: prediction ? prediction.predicted_salary : 0 },
    { level: '7-10 yrs', salary: prediction ? prediction.predicted_salary * 1.15 : 0 },
    { level: '10+ yrs', salary: prediction ? prediction.predicted_salary * 1.35 : 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Salary Insights" description="Compensation Analysis & Prediction" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictor</CardTitle>
              <CardDescription>Enter your details to estimate salary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary">Role</label>
                <RoleSelect value={selectedRole || ''} onValueChange={(v) => setRole(v)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary">Location</label>
                <LocationSelect value={location} onValueChange={setLocation} />
              </div>
              <ExperienceSlider value={experience} onValueChange={setExperience} />
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary">Education</label>
                <EducationSelect value={education} onValueChange={setEducation} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary">Industry (optional)</label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., FinTech, Healthcare"
                  className="h-10"
                />
              </div>
              <Button className="w-full gap-2" onClick={handlePredict} disabled={!selectedRole || predictMutation.isPending}>
                <Calculator className="h-4 w-4" />
                {predictMutation.isPending ? 'Calculating...' : 'Predict Salary'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {prediction ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Predicted Salary</span>
                    <span className="text-text-primary font-medium">{formatCurrency(prediction.predicted_salary)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Confidence Range</span>
                    <span className="text-text-primary font-medium">
                      {formatCurrency(prediction.confidence_interval[0])} – {formatCurrency(prediction.confidence_interval[1])}
                    </span>
                  </div>
                  {prediction.factors?.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-text-secondary capitalize">{f.name.replace(/_/g, ' ')}</span>
                      <span className="text-text-primary">{f.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary text-sm py-6 text-center">Select a role and predict to see distribution</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {predictMutation.isPending || explainMutation.isPending ? (
            <div className="space-y-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          ) : predictMutation.error ? (
            <AlertBanner message={(predictMutation.error as Error)?.message || 'Prediction failed'} onRetry={handlePredict} />
          ) : prediction ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Predicted Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-primary">{formatCurrency(prediction.predicted_salary)}</span>
                    <span className="text-sm text-text-secondary">/annum (CTC)</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-text-secondary">Confidence:</span>
                      <span className="text-text-primary font-medium">
                        {formatCurrency(prediction.confidence_interval[0])} – {formatCurrency(prediction.confidence_interval[1])}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Factor Impacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {prediction.factors && prediction.factors.length > 0 ? (
                      <div className="h-48 space-y-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={prediction.factors
                              .filter((f) => !f.name.includes('Base'))
                              .map((f) => ({ name: f.name.replace(/ Impact| Multiplier| Premium| Bonus/g, ''), impact: f.impact }))}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                            <XAxis type="number" stroke="#a0a0a0" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <YAxis type="category" dataKey="name" stroke="#a0a0a0" fontSize={11} width={90} />
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} formatter={(v: number) => formatCurrency(v)} />
                            <Bar dataKey="impact" fill="#00F5D4" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-text-secondary text-sm py-6 text-center">No factor data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Experience Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={expChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                          <XAxis dataKey="level" stroke="#a0a0a0" fontSize={12} />
                          <YAxis stroke="#a0a0a0" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} formatter={(v: number) => formatCurrency(v)} />
                          <Bar dataKey="salary" fill="#5B5FEE" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {explanation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Impact (SHAP)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {explanation.features.slice(0, 6).map((f, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm text-text-primary">{f.name}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-800 rounded-full h-2">
                              <div
                                className={cn('h-2 rounded-full', f.impact_direction === 'positive' ? 'bg-emerald-400' : 'bg-accent')}
                                style={{ width: `${Math.min(Math.abs(f.shap_value) * 50, 100)}%` }}
                              />
                            </div>
                            <span className={cn('text-xs font-medium w-20 text-right', f.impact_direction === 'positive' ? 'text-emerald-400' : 'text-accent')}>
                              {f.impact_direction === 'positive' ? '+' : ''}{formatCurrency(f.shap_value)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-800/60">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Base Value</span>
                        <span className="text-text-primary font-medium">{formatCurrency(explanation.base_value)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-text-secondary">Prediction</span>
                        <span className="text-primary font-medium">{formatCurrency(prediction.predicted_salary)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <DollarSign className="h-12 w-12 text-text-secondary/30 mx-auto mb-3" />
                <p className="text-text-secondary">Select a role and click "Predict Salary" to see insights</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
