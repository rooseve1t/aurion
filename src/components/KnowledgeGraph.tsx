import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'subject' | 'object';
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  predicate: string;
}

interface KnowledgeItem {
  id: number;
  subject: string;
  predicate: string;
  object: string;
}

export const KnowledgeGraph: React.FC<{ data: KnowledgeItem[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Prepare nodes and links
    const nodes: Node[] = [];
    const links: Link[] = [];
    const nodeSet = new Set<string>();

    data.forEach(item => {
      if (!nodeSet.has(item.subject)) {
        nodes.push({ id: item.subject, label: item.subject, type: 'subject' });
        nodeSet.add(item.subject);
      }
      if (!nodeSet.has(item.object)) {
        nodes.push({ id: item.object, label: item.object, type: 'object' });
        nodeSet.add(item.object);
      }
      links.push({
        source: item.subject,
        target: item.object,
        predicate: item.predicate
      });
    });

    // Simulation setup with optimized forces
    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300)) // Increased repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30).iterations(2)); // Prevent overlap

    // Draw links
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    // Draw nodes
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", 8)
      .attr("fill", d => d.type === 'subject' ? "#3b82f6" : "#10b981");

    node.append("text")
      .text(d => d.label)
      .attr("x", 12)
      .attr("y", 4)
      .attr("fill", "#fff")
      .attr("stroke", "none")
      .attr("font-size", "10px")
      .attr("font-family", "Inter")
      .style("pointer-events", "none")
      .style("text-shadow", "0 1px 2px rgba(0,0,0,0.8)");

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] relative overflow-hidden rounded-xl bg-black/20">
      <svg ref={svgRef} className="w-full h-full" style={{ minHeight: '300px' }} />
      <div className="absolute bottom-2 right-2 flex gap-4 text-[8px] uppercase tracking-widest text-white/20 pointer-events-none">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" /> Субъект
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" /> Объект
        </div>
      </div>
    </div>
  );
};
