'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3Force from 'd3-force';
import { cn } from '@/lib/utils';

interface NetworkNode {
  id: string;
  name: string;
  category: string;
  weight: number;
}

interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
  relationship: string;
}

interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  width?: number;
  height?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#00F5D4',
  backend: '#5B5FEE',
  data: '#E94560',
  devops: '#FFD700',
  ml: '#A78BFA',
  cloud: '#4ECDC4',
  security: '#FF6B6B',
  mobile: '#F97316',
  default: '#a0a0a0',
};

interface SimNode extends d3Force.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  weight: number;
}

interface SimEdge {
  source: SimNode;
  target: SimNode;
  weight: number;
  relationship: string;
}

export function NetworkGraph({
  nodes,
  edges,
  width = 800,
  height = 600,
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => {
      const newScale = Math.min(Math.max(prev.scale * delta, 0.3), 4);
      return { ...prev, scale: newScale };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    if (!nodes.length) return;

    const simNodes: SimNode[] = nodes.map((n) => ({
      id: n.id,
      name: n.name,
      category: n.category,
      weight: n.weight,
      x: width / 2 + (Math.random() - 0.5) * width * 0.5,
      y: height / 2 + (Math.random() - 0.5) * height * 0.5,
    }));

    const nodeMap = new Map(simNodes.map((n) => [n.id, n]));

    const simEdges: SimEdge[] = edges
      .filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))
      .map((e) => ({
        source: nodeMap.get(e.source)!,
        target: nodeMap.get(e.target)!,
        weight: e.weight,
        relationship: e.relationship,
      }));

    const simulation = d3Force
      .forceSimulation(simNodes)
      .force(
        'link',
        d3Force
          .forceLink<SimNode, SimEdge>(simEdges)
          .id((d) => d.id)
          .distance(100)
          .strength((d) => d.weight * 0.5)
      )
      .force('charge', d3Force.forceManyBody().strength(-200))
      .force('center', d3Force.forceCenter(width / 2, height / 2))
      .force('collision', d3Force.forceCollide().radius(25));

    simulation.on('tick', () => {
      if (svgRef.current) {
        const linksGroup = svgRef.current.querySelector('#links') as SVGGElement;
        const nodesGroup = svgRef.current.querySelector('#nodes') as SVGGElement;

        if (linksGroup) {
          linksGroup.querySelectorAll('line').forEach((line, i) => {
            const edge = simEdges[i];
            if (edge) {
              line.setAttribute('x1', String(edge.source.x ?? 0));
              line.setAttribute('y1', String(edge.source.y ?? 0));
              line.setAttribute('x2', String(edge.target.x ?? 0));
              line.setAttribute('y2', String(edge.target.y ?? 0));
            }
          });
        }

        if (nodesGroup) {
          nodesGroup.querySelectorAll('g').forEach((g, i) => {
            const node = simNodes[i];
            if (node) {
              g.setAttribute(
                'transform',
                `translate(${node.x ?? 0}, ${node.y ?? 0})`
              );
            }
          });
        }
      }
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, width, height]);

  if (!nodes.length) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-gray-800/60 bg-surface/50"
        style={{ height }}
      >
        <p className="text-sm text-text-secondary">No data available</p>
      </div>
    );
  }

  const maxWeight = Math.max(...nodes.map((n) => n.weight), 1);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-gray-800/60 bg-surface/50"
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="cursor-grab active:cursor-grabbing"
      >
        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
        >
          <g id="links">
            {edges
              .filter(
                (e) =>
                  nodes.some((n) => n.id === e.source) &&
                  nodes.some((n) => n.id === e.target)
              )
              .map((edge, i) => (
                <line
                  key={`edge-${i}`}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={Math.max(1, edge.weight * 3)}
                  strokeOpacity={Math.min(1, edge.weight * 0.8)}
                />
              ))}
          </g>
          <g id="nodes">
            {nodes.map((node) => {
              const color =
                CATEGORY_COLORS[node.category] ?? CATEGORY_COLORS.default;
              const r = Math.max(6, (node.weight / maxWeight) * 20);
              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    setHoveredNode({
                      ...node,
                      x: 0,
                      y: 0,
                      vx: 0,
                      vy: 0,
                    } as SimNode);
                    const rect = (
                      e.currentTarget as SVGGElement
                    ).getBoundingClientRect();
                    const containerRect = containerRef.current?.getBoundingClientRect();
                    if (containerRect) {
                      setTooltipPos({
                        x: rect.left - containerRect.left + rect.width / 2,
                        y: rect.top - containerRect.top - 10,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle r={r} fill={color} fillOpacity={0.8} stroke={color} strokeWidth={1} />
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    fill="#F8FAFC"
                    fontSize={Math.min(11, r * 0.8)}
                    fontFamily="Inter, system-ui, sans-serif"
                    pointerEvents="none"
                  >
                    {node.name.charAt(0)}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
      {hoveredNode && (
        <div
          className="absolute z-10 px-3 py-1.5 rounded-lg bg-surface border border-gray-700 shadow-xl pointer-events-none text-xs"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="font-medium text-text-primary">{hoveredNode.name}</p>
          <p className="text-text-secondary mt-0.5">
            {hoveredNode.category} &middot; weight: {hoveredNode.weight.toFixed(1)}
          </p>
        </div>
      )}
    </div>
  );
}
