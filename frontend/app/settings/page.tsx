'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Globe, Clock, LayoutPanelLeft, Trash2, Briefcase, User, Database } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { RoleSelect } from '@/components/forms/RoleSelect';
import { cn } from '@/lib/utils';

const COUNTRIES = [
  { value: 'global', label: 'Global' },
  { value: 'us', label: 'United States' },
  { value: 'india', label: 'India' },
];

const TIME_RANGES = [
  { value: '6m', label: 'Last 6 months' },
  { value: '12m', label: 'Last 12 months' },
  { value: '24m', label: 'Last 24 months' },
];

export default function SettingsPage() {
  const {
    selectedCountry, setCountry,
    selectedRole, setRole,
    selectedTimeRange, setTimeRange,
    sidebarCollapsed, toggleSidebar,
    chatHistory, clearChat,
  } = useAppStore();

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Preferences, data & workspace configuration" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Market Preferences
            </CardTitle>
            <CardDescription>Set your default market and analysis time range</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                Default Role
              </label>
              <RoleSelect value={selectedRole || ''} onValueChange={(v) => setRole(v || null)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Default Country
              </label>
              <Select value={selectedCountry} onValueChange={(v) => setCountry(v as typeof selectedCountry)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Time Range
              </label>
              <Select value={selectedTimeRange} onValueChange={(v) => setTimeRange(v as typeof selectedTimeRange)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_RANGES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutPanelLeft className="h-4 w-4 text-primary" />
              Workspace
            </CardTitle>
            <CardDescription>Customize the app shell and manage local data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-surface/30 border border-gray-800/60 hover:bg-white/5 transition-colors"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">Collapsed Sidebar</p>
                <p className="text-xs text-text-secondary mt-0.5">Use a compact navigation rail</p>
              </div>
              <div
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  sidebarCollapsed ? 'bg-primary' : 'bg-gray-700'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all',
                    sidebarCollapsed ? 'left-5.5' : 'left-0.5'
                  )}
                  style={{ left: sidebarCollapsed ? '22px' : '2px' }}
                />
              </div>
            </button>

            <div className="p-4 rounded-lg bg-surface/30 border border-gray-800/60">
              <p className="text-sm font-medium text-text-primary flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Chat History
              </p>
              <p className="text-xs text-text-secondary mt-0.5 mb-3">
                {chatHistory.length} messages stored locally in this session
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={clearChat}
                disabled={chatHistory.length === 0}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Chat History
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-surface/30 border border-gray-800/60">
              <p className="text-sm font-medium text-text-primary flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Data Source
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                SkillLens API · http://localhost:8000 — synthetic market intelligence data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Save Preferences</p>
              <p className="text-xs text-text-secondary">Changes apply instantly across the app</p>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            {saved ? 'Preferences Saved' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}