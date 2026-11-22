import React, { useMemo, useState } from "react";
import { Network, ZoomIn, ZoomOut } from "lucide-react";
import { buildKnowledgeGraph } from "../patterns/documindPatterns";
import {
  EnterpriseDocument,
  KnowledgeNode,
  KnowledgeNodeType,
} from "../types/documind";

interface KnowledgeGraphViewProps {
  documents: EnterpriseDocument[];
}

const TYPE_META: Record<
  KnowledgeNodeType,
  { label: string; fill: string; stroke: string; text: string }
> = {
  document: {
    label: "سند سازمانی",
    fill: "#0B172A",
    stroke: "#1E3A8A",
    text: "#FFFFFF",
  },
  concept: {
    label: "مفهوم اصلی",
    fill: "#ECFEFF",
    stroke: "#0891B2",
    text: "#155E75",
  },
  person: {
    label: "شخص",
    fill: "#EFF6FF",
    stroke: "#1D4ED8",
    text: "#1E3A8A",
  },
  organization: {
    label: "سازمان / نهاد",
    fill: "#F8FAFC",
    stroke: "#475569",
    text: "#0F172A",
  },
  topic: {
    label: "موضوع / دسته",
    fill: "#F0FDFA",
    stroke: "#0D9488",
    text: "#115E59",
  },
};

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  documents,
}) => {
  const [filterType, setFilterType] = useState<"all" | KnowledgeNodeType>("all");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const { nodes, edges } = useMemo(
    () => buildKnowledgeGraph(documents),
    [documents]
  );

  // Deterministic radial/layered layout for crisp academic readability
  const positionedNodes = useMemo(() => {
    const filtered =
      filterType === "all"
        ? nodes
        : nodes.filter((n) => n.type === filterType || n.type === "document");

    const groups: Record<KnowledgeNodeType, KnowledgeNode[]> = {
      document: [],
      topic: [],
      concept: [],
      person: [],
      organization: [],
    };
    filtered.forEach((n) => groups[n.type].push(n));

    const coords = new Map<string, { x: number; y: number }>();
    const cx = 480;
    const cy = 290;

    // Place documents on inner ring, topics top-arc, concepts outer-right, people/orgs outer-left
    const placeRing = (
      list: KnowledgeNode[],
      rx: number,
      ry: number,
      startAngle: number,
      endAngle: number
    ) => {
      list.forEach((node, idx) => {
        const span = endAngle - startAngle;
        const angle =
          list.length === 1
            ? startAngle + span / 2
            : startAngle + (idx / Math.max(1, list.length - 1)) * span;
        coords.set(node.id, {
          x: Math.round(cx + Math.cos(angle) * rx),
          y: Math.round(cy + Math.sin(angle) * ry),
        });
      });
    };

    placeRing(groups.document, 145, 110, 0, Math.PI * 1.78);
    placeRing(groups.topic, 355, 225, -Math.PI * 0.85, -Math.PI * 0.15);
    placeRing(groups.concept, 410, 235, -Math.PI * 0.08, Math.PI * 0.55);
    placeRing(groups.person, 385, 230, Math.PI * 0.62, Math.PI * 0.95);
    placeRing(groups.organization, 415, 235, Math.PI * 1.02, Math.PI * 1.48);

    return filtered.map((n) => ({
      ...n,
      pos: coords.get(n.id) ?? { x: cx, y: cy },
    }));
  }, [nodes, filterType]);

  const posLookup = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    positionedNodes.forEach((n) => m.set(n.id, n.pos));
    return m;
  }, [positionedNodes]);

  const visibleEdges = useMemo(
    () => edges.filter((e) => posLookup.has(e.source) && posLookup.has(e.target)),
    [edges, posLookup]
  );

  const selectedNode = useMemo(
    () =>
      positionedNodes.find((n) => n.id === selectedNodeId) ??
      positionedNodes[0] ??
      null,
    [positionedNodes, selectedNodeId]
  );

  const connectedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return visibleEdges.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id
    );
  }, [visibleEdges, selectedNode]);

  const nodeLabelById = useMemo(() => {
    const m = new Map<string, string>();
    nodes.forEach((n) => m.set(n.id, n.label));
    return m;
  }, [nodes]);

  return (
    <div className="space-y-6">
      {/* Controls & Legend */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              استخراج دانش و گراف ارتباطات سازمانی
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              نمایش شبکه پویا میان اسناد، مفاهیم اصلی، اشخاص، سازمان‌ها و موضوعات (با افزودن یا
              حذف سند، گراف توسط الگوی Observer بازسازی می‌شود)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(
                [
                  ["all", "همه گره‌ها"],
                  ["concept", "مفاهیم"],
                  ["person", "اشخاص"],
                  ["organization", "سازمان‌ها"],
                  ["topic", "موضوعات"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilterType(key)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    filterType === key
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))}
                title="کوچک‌نمایی"
                className="p-1.5 rounded hover:bg-white text-slate-700"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs px-1.5 tabular-nums text-slate-600">
                {Math.round(zoom * 100)}٪
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.45, +(z + 0.15).toFixed(2)))}
                title="بزرگ‌نمایی"
                className="p-1.5 rounded hover:bg-white text-slate-700"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 pt-1">
          {(Object.entries(TYPE_META) as [KnowledgeNodeType, typeof TYPE_META.document][]).map(
            ([type, meta]) => (
              <span key={type} className="inline-flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full inline-block border"
                  style={{ backgroundColor: meta.fill, borderColor: meta.stroke }}
                />
                <span>{meta.label}</span>
              </span>
            )
          )}
          <span className="text-slate-400">·</span>
          <span className="tabular-nums">
            مجموع گره‌ها: {positionedNodes.length.toLocaleString("fa-IR")} · یال‌ها:{" "}
            {visibleEdges.length.toLocaleString("fa-IR")}
          </span>
        </div>
      </section>

      {/* Interactive SVG Graph + Selected Node Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-4 overflow-hidden">
          <div className="w-full overflow-auto bg-slate-50/70 rounded-lg border border-slate-100">
            <svg
              viewBox="0 0 960 580"
              className="w-full h-[500px] transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
            >
              {/* Subtle grid */}
              <defs>
                <pattern id="kg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path
                    d="M 32 0 L 0 0 0 32"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="0.6"
                  />
                </pattern>
              </defs>
              <rect width="960" height="580" fill="url(#kg-grid)" />

              {/* Edges */}
              {visibleEdges.map((edge) => {
                const p1 = posLookup.get(edge.source);
                const p2 = posLookup.get(edge.target);
                if (!p1 || !p2) return null;
                const isHighlighted =
                  selectedNode &&
                  (edge.source === selectedNode.id || edge.target === selectedNode.id);

                return (
                  <g key={edge.id}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isHighlighted ? "#0891B2" : "#CBD5E1"}
                      strokeWidth={isHighlighted ? 2.2 : 1}
                      strokeOpacity={selectedNode && !isHighlighted ? 0.35 : 0.9}
                    />
                    {isHighlighted && (
                      <text
                        x={(p1.x + p2.x) / 2}
                        y={(p1.y + p2.y) / 2 - 4}
                        textAnchor="middle"
                        fill="#0E7490"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {positionedNodes.map((node) => {
                const meta = TYPE_META[node.type];
                const isSelected = selectedNode?.id === node.id;
                const isNeighbor = connectedEdges.some(
                  (e) => e.source === node.id || e.target === node.id
                );
                const dimmed = selectedNode && !isSelected && !isNeighbor;
                const boxWidth = Math.min(164, Math.max(88, node.label.length * 6.2 + 22));

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.pos.x}, ${node.pos.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer"
                    opacity={dimmed ? 0.35 : 1}
                  >
                    <rect
                      x={-boxWidth / 2}
                      y={-16}
                      width={boxWidth}
                      height={32}
                      rx={node.type === "document" ? 8 : 16}
                      fill={meta.fill}
                      stroke={isSelected ? "#0284C7" : meta.stroke}
                      strokeWidth={isSelected ? 2.5 : 1.3}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={meta.text}
                      fontSize="11"
                      fontWeight={node.type === "document" ? "700" : "600"}
                    >
                      {node.label.length > 22
                        ? node.label.slice(0, 22) + "..."
                        : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Inspector Panel */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">بازرس گره دانش</h3>
            <Network className="w-4 h-4 text-cyan-700" />
          </div>

          {!selectedNode ? (
            <div className="text-xs text-slate-500 py-8 text-center">
              روی هر گره در گراف کلیک کنید تا ارتباطات و اسناد مرتبط نمایش داده شوند.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-cyan-700 font-medium">
                  نوع گره: {TYPE_META[selectedNode.type].label}
                </div>
                <div className="text-base font-bold text-slate-900">
                  {selectedNode.label}
                </div>
                <div className="text-xs text-slate-500 tabular-nums">
                  تعداد اسناد مرتبط: {selectedNode.documentIds.length.toLocaleString("fa-IR")} ·
                  تعداد ارتباطات: {connectedEdges.length.toLocaleString("fa-IR")}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  ارتباطات استخراج‌شده
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {connectedEdges.map((edge) => {
                    const otherId =
                      edge.source === selectedNode.id ? edge.target : edge.source;
                    const otherLabel = nodeLabelById.get(otherId) ?? otherId;
                    return (
                      <button
                        key={edge.id}
                        type="button"
                        onClick={() => setSelectedNodeId(otherId)}
                        className="w-full text-right p-2.5 rounded-lg bg-slate-50 hover:bg-cyan-50 border border-slate-200 text-xs transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="text-cyan-800 font-medium shrink-0">
                          {edge.label}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">
                          {otherLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
