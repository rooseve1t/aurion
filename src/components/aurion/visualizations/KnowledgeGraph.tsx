import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: string;
  val?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

interface GraphData {
  nodes: Node[];
  edges: Link[];
}

interface Props {
  data: GraphData;
  width?: number;
  height?: number;
}

export default function KnowledgeGraph({ data, width = 600, height = 400 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.edges).id((d: any) => d.id).distance(60))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(20));

    const link = svg.append("g")
      .attr("stroke", "oklch(0.55 0.25 290 / 30%)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.edges)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Node circles
    node.append("circle")
      .attr("r", (d) => d.type === 'concept' ? 8 : 5)
      .attr("fill", (d) => 
        d.type === 'concept' ? 'oklch(0.55 0.25 290)' : 
        d.type === 'event' ? 'oklch(0.72 0.18 200)' : 
        d.type === 'device' ? 'oklch(0.78 0.16 80)' : 'oklch(0.72 0.18 162)'
      )
      .attr("stroke", "oklch(0.12 0.02 240)")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      });

    // Node labels
    node.append("text")
      .text(d => d.label)
      .attr("x", 10)
      .attr("y", 3)
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "9px")
      .style("fill", "oklch(0.75 0.04 200)")
      .style("pointer-events", "none")
      .style("opacity", 0.7);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

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
  }, [data, width, height]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-[oklch(0.07_0.01_240_/_40%)] border border-[oklch(0.55_0.25_290_/_20%)]">
      <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} />
      
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 p-3 rounded bg-[oklch(0.09_0.015_240_/_90%)] border border-[oklch(0.55_0.25_290_/_40%)] backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-xs font-bold text-[oklch(0.78_0.25_290)] font-mono mb-1">{selectedNode.label}</h4>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[oklch(0.55_0.25_290_/_20%)] text-[oklch(0.55_0.25_290)] font-mono uppercase">
                {selectedNode.type}
              </span>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-[oklch(0.45_0.04_220)] hover:text-[oklch(0.75_0.04_200)]"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
