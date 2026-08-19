'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as d3Force from 'd3-force';
import { Search, ArrowRight, Network, Sparkles, Filter } from 'lucide-react';
import { getSkillGraph, getCareerPaths } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { RoleSelect } from '@/components/forms/RoleSelect';
import { cn } from '@/lib/utils';
import type { SkillGraphNode, SkillGraphEdge } from '@/lib/types';

interface SimNode extends SkillGraphNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

const CLUSTER_COLORS: Record<string, string> = {
  core: '#00F5D4',
  programming: '#00F5D4',
  Programming: '#00F5D4',
  web: '#EC4899',
  Web: '#EC4899',
  Frontend: '#EC4899',
  Backend: '#06B6D4',
  data: '#F59E0B',
  Data: '#F59E0B',
  'data-science': '#F59E0B',
  'ai-ml': '#5B5FEE',
  'ml-ai': '#5B5FEE',
  ML: '#5B5FEE',
  infra: '#10B981',
  devops: '#10B981',
  DevOps: '#10B981',
  cloud: '#E94560',
  Cloud: '#E94560',
  database: '#F97316',
  Database: '#F97316',
  'big-data': '#8B5CF6',
  soft: '#A1A1AA',
  'soft-skills': '#A1A1AA',
  other: '#3B82F6',
};

const DISPLAY_CLUSTERS = [
  { key: 'core', label: 'Programming & Core', color: '#00F5D4' },
  { key: 'ai-ml', label: 'AI & Machine Learning', color: '#5B5FEE' },
  { key: 'web', label: 'Web & Frameworks', color: '#EC4899' },
  { key: 'data', label: 'Data Engineering & DB', color: '#F59E0B' },
  { key: 'infra', label: 'Cloud & DevOps', color: '#10B981' },
  { key: 'soft', label: 'Leadership & Soft Skills', color: '#A1A1AA' },
];

function getNodeStringId(val: any): string {
  if (typeof val === 'object' && val !== null && val.id) {
    return String(val.id);
  }
  return String(val || '');
}

export default function SkillGraphPage() {
  const { selectedRole } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [fromRole, setFromRole] = useState<string>('Software Engineer');
  const [toRole, setToRole] = useState<string>('Data Scientist');
  const [hoveredNode, setHoveredNode] = useState<SkillGraphNode | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const { data: graphData, isLoading: graphLoading, error: graphError, refetch: graphRefetch } = useQuery({
    queryKey: ['skillGraph'],
    queryFn: getSkillGraph,
  });

  const { data: careerPaths, isLoading: pathLoading } = useQuery({
    queryKey: ['careerPaths', fromRole, toRole],
    queryFn: () => getCareerPaths(fromRole, toRole || undefined),
    enabled: !!fromRole,
  });

  const filteredNodes = useMemo(() => {
    if (!graphData) return [];
    let list = graphData.nodes;
    if (selectedCluster !== 'all') {
      list = list.filter((n) => (n.cluster || n.category) === selectedCluster);
    }
    if (search.trim()) {
      list = list.filter((n) => n.name.toLowerCase().includes(search.toLowerCase()));
    }
    return list;
  }, [graphData, search, selectedCluster]);

  useEffect(() => {
    if (!graphData || !svgRef.current || filteredNodes.length === 0) return;

    const width = svgRef.current.clientWidth || 700;
    const height = 450;

    const nodes: SimNode[] = filteredNodes.map((n) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
    }));
    const nodeIds = new Set(nodes.map((n) => n.id));

    // Clone edges to prevent D3 from mutating original graphData.edges in place
    const edgesForSim = graphData.edges
      .filter((e) => {
        const srcId = getNodeStringId(e.source);
        const tgtId = getNodeStringId(e.target);
        return nodeIds.has(srcId) && nodeIds.has(tgtId);
      })
      .map((e) => ({
        source: getNodeStringId(e.source),
        target: getNodeStringId(e.target),
        weight: e.weight,
        relationship: e.relationship,
      }));

    const simulation = d3Force
      .forceSimulation(nodes)
      .alphaDecay(0.06)
      .velocityDecay(0.4)
      .force(
        'link',
        d3Force
          .forceLink(edgesForSim)
          .id((d: any) => d.id)
          .distance(75)
      )
      .force('charge', d3Force.forceManyBody().strength(-120))
      .force('center', d3Force.forceCenter(width / 2, height / 2))
      .force('collision', d3Force.forceCollide().radius(22));


    simulation.on('tick', () => {
      const svg = svgRef.current;
      if (!svg) return;

      edgesForSim.forEach((edge: any) => {
        const srcId = getNodeStringId(edge.source);
        const tgtId = getNodeStringId(edge.target);
        const line = svg.querySelector(`[data-edge="${srcId}-${tgtId}"]`) as SVGLineElement | null;
        if (line && edge.source?.x !== undefined && edge.source?.y !== undefined && edge.target?.x !== undefined && edge.target?.y !== undefined) {
          line.setAttribute('x1', String(edge.source.x));
          line.setAttribute('y1', String(edge.source.y));
          line.setAttribute('x2', String(edge.target.x));
          line.setAttribute('y2', String(edge.target.y));
        }
      });

      nodes.forEach((node) => {
        const group = svg.querySelector(`[data-nodegroup="${node.id}"]`) as SVGGElement | null;
        if (group && node.x !== undefined && node.y !== undefined) {
          group.setAttribute('transform', `translate(${node.x}, ${node.y})`);
        }
      });
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, filteredNodes]);

  const visibleEdges = useMemo(() => {
    if (!graphData) return [];
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    return graphData.edges.filter((e) => {
      const srcId = getNodeStringId(e.source);
      const tgtId = getNodeStringId(e.target);
      return nodeIds.has(srcId) && nodeIds.has(tgtId);
    });
  }, [graphData, filteredNodes]);

  if (graphError) {
    return (
      <div>
        <PageHeader title="Skill Graph & Knowledge Network" description="Interactive Skill Relationship Visualization & Career Path Projections" />
        <AlertBanner message={(graphError as Error)?.message || 'Failed to load skill graph'} onRetry={graphRefetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Graph & Knowledge Network"
        description="Interactive Skill Relationship Network & AI Career Path Projections"
      />

      {graphLoading ? (
        <Skeleton className="h-[450px] rounded-xl" />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Graph Main View */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="border-primary/20 bg-surface/30">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">Skill Taxonomy Network</CardTitle>
                      <CardDescription className="text-xs">
                        Showing {filteredNodes.length} skills & {visibleEdges.length} inter-cluster relationships
                      </CardDescription>
                    </div>
                  </div>

                  {/* Cluster Filter Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setSelectedCluster('all')}
                      className={cn(
                        'px-2.5 py-1 text-xs rounded-full border transition-colors',
                        selectedCluster === 'all'
                          ? 'bg-primary/20 border-primary text-primary font-semibold'
                          : 'border-gray-800 text-text-secondary hover:text-text-primary'
                      )}
                    >
                      All Clusters
                    </button>
                    {DISPLAY_CLUSTERS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setSelectedCluster(selectedCluster === c.key ? 'all' : c.key)}
                        className={cn(
                          'px-2 py-0.5 text-xs rounded-full border transition-colors',
                          selectedCluster === c.key
                            ? 'bg-primary/20 border-primary text-primary font-semibold'
                            : 'border-gray-800/60 text-text-secondary hover:text-text-primary'
                        )}
                        style={
                          selectedCluster === c.key
                            ? { borderColor: c.color, color: c.color, backgroundColor: `${c.color}20` }
                            : {}
                        }
                      >
                        {c.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="p-2 relative overflow-hidden">
                  {graphData && filteredNodes.length > 0 ? (
                    <div className="relative">
                      <svg ref={svgRef} className="w-full h-[440px] bg-background/40 rounded-lg">
                        <defs>
                          {Object.entries(CLUSTER_COLORS).map(([cat, color]) => (
                            <radialGradient key={cat} id={`grad-${cat}`}>
                              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                              <stop offset="100%" stopColor={color} stopOpacity={0.2} />
                            </radialGradient>
                          ))}
                        </defs>
                        {visibleEdges.map((edge, idx) => {
                          const srcId = getNodeStringId(edge.source);
                          const tgtId = getNodeStringId(edge.target);
                          const isConnectedToHovered =
                            hoveredNode && (hoveredNode.id === srcId || hoveredNode.id === tgtId);

                          return (
                            <line
                              key={`edge-${srcId}-${tgtId}-${idx}`}
                              data-edge={`${srcId}-${tgtId}`}
                              className="graph-edge transition-all duration-200"
                              stroke={isConnectedToHovered ? '#00F5D4' : '#2a2a3e'}
                              strokeWidth={isConnectedToHovered ? 2.5 : Math.min(edge.weight || 1, 3)}
                              strokeOpacity={hoveredNode ? (isConnectedToHovered ? 0.9 : 0.15) : 0.5}
                            />
                          );
                        })}
                        {filteredNodes.map((node) => {
                          const color = CLUSTER_COLORS[node.cluster] || CLUSTER_COLORS[node.category] || '#3B82F6';
                          const radius = 9 + (node.weight || 0.5) * 6;
                          const isHovered = hoveredNode?.id === node.id;
                          const isConnected =
                            hoveredNode &&
                            visibleEdges.some((e) => {
                              const s = getNodeStringId(e.source);
                              const t = getNodeStringId(e.target);
                              return (s === hoveredNode.id && t === node.id) || (t === hoveredNode.id && s === node.id);
                            });

                          return (
                            <g
                              key={node.id}
                              data-nodegroup={node.id}
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredNode(node)}
                              onMouseLeave={() => setHoveredNode(null)}
                            >
                              <circle
                                className="graph-node transition-all duration-200"
                                r={isHovered ? radius + 2.5 : radius}
                                fill={`url(#grad-${node.cluster || node.category || 'other'})`}
                                stroke={isHovered ? '#ffffff' : color}
                                strokeWidth={isHovered ? 3 : 2}
                                strokeOpacity={hoveredNode ? (isHovered || isConnected ? 1 : 0.3) : 0.8}
                                cx={0}
                                cy={0}
                              />
                              <text
                                className="graph-label pointer-events-none select-none transition-colors duration-200"
                                textAnchor="middle"
                                fill={isHovered ? '#ffffff' : isConnected ? '#00F5D4' : '#e2e8f0'}
                                fontSize={isHovered ? 11 : 10}
                                fontWeight={isHovered ? '700' : '500'}
                                opacity={hoveredNode ? (isHovered || isConnected ? 1 : 0.35) : 1}
                                x={0}
                                y={radius + 14}
                              >
                                {node.name}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* Floating Hover Info Pill */}
                      {hoveredNode && (
                        <div className="absolute top-4 right-4 p-3 rounded-xl bg-surface/90 border border-gray-800 shadow-xl backdrop-blur-md text-xs space-y-1 z-10 max-w-xs">
                          <p className="font-bold text-text-primary text-sm flex items-center justify-between gap-2">
                            <span>{hoveredNode.name}</span>
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: CLUSTER_COLORS[hoveredNode.cluster] || '#3B82F6' }}
                            />
                          </p>
                          <p className="text-text-secondary">
                            Category: <span className="text-text-primary capitalize">{hoveredNode.category}</span>
                          </p>
                          <p className="text-text-secondary">
                            Cluster: <span className="text-text-primary uppercase font-mono">{hoveredNode.cluster}</span>
                          </p>
                          <p className="text-text-secondary">
                            Market Demand Weight: <span className="text-emerald-400 font-semibold">{hoveredNode.weight}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-text-secondary text-sm py-20 text-center">
                      {search ? 'No skills match your search query' : 'No graph data available'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar: Search & Legend */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="py-3.5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    Skill Explorer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search skill (e.g. Python, Docker)..."
                      className="pl-8 text-xs h-9"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredNodes.slice(0, 25).map((node) => {
                      const color = CLUSTER_COLORS[node.cluster] || CLUSTER_COLORS[node.category] || '#3B82F6';
                      return (
                        <div
                          key={node.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-surface/20 hover:bg-white/5 transition-colors text-xs"
                          onMouseEnter={() => setHoveredNode(node)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <span className="text-text-primary font-medium">{node.name}</span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                            style={{ borderColor: `${color}60`, color: color }}
                          >
                            {node.cluster || node.category}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3.5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Cluster Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {DISPLAY_CLUSTERS.map((c) => (
                    <div
                      key={c.key}
                      onClick={() => setSelectedCluster(selectedCluster === c.key ? 'all' : c.key)}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs',
                        selectedCluster === c.key ? 'bg-primary/10 border border-primary/40' : 'hover:bg-surface/40'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-text-primary font-medium">{c.label}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-text-secondary border-gray-800">
                        {graphData?.nodes.filter((n) => (n.cluster || n.category) === c.key).length || 0}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Card: Career Path Projections */}
          <Card className="border-primary/20 bg-surface/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Career Transition & Skill Path Projections
              </CardTitle>
              <CardDescription className="text-xs">
                Select your starting role and target career destination to compute recommended learning skill steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-end gap-4 p-4 rounded-xl bg-surface/40 border border-gray-800/60">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Current Role</label>
                  <RoleSelect value={fromRole} onValueChange={setFromRole} placeholder="Select starting role..." />
                </div>
                <div className="flex items-center justify-center p-2 rounded-full bg-primary/10 border border-primary/30 shrink-0 self-center sm:self-end mb-1">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Target Role Destination</label>
                  <RoleSelect value={toRole} onValueChange={setToRole} placeholder="Select target role..." />
                </div>
              </div>

              {pathLoading ? (
                <Skeleton className="h-32 rounded-lg" />
              ) : careerPaths && careerPaths.paths.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {careerPaths.paths.map((path, i) => (
                    <Card key={i} className="bg-surface/40 border border-gray-800/60">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            Transition Path {i + 1}
                          </h4>
                          <Badge variant="outline" className="text-xs text-primary border-primary/40">
                            Effort Score: {path.total_effort}
                          </Badge>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          {path.nodes.map((node, j) => (
                            <div
                              key={j}
                              className="flex items-center justify-between p-2 rounded bg-surface/30 border border-gray-800/40"
                            >
                              <span className="text-text-primary font-medium capitalize">
                                {node.skill.replace('-', ' ')}
                              </span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] capitalize',
                                  node.level === 'proficient'
                                    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                    : node.level === 'beginner'
                                    ? 'text-sky-400 border-sky-500/40 bg-sky-500/10'
                                    : node.level === 'intermediate'
                                    ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                                    : 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10'
                                )}
                              >
                                {node.level}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : fromRole ? (
                <p className="text-text-secondary text-sm py-6 text-center">
                  No transition paths calculated for the selected roles
                </p>
              ) : (
                <p className="text-text-secondary text-sm py-6 text-center">
                  Select starting and target roles above to compute career path projections
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

