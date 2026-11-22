import React, { useMemo, useState } from "react";
import { Boxes, Layers } from "lucide-react";
import {
  ARCHITECTURE_COMPONENTS,
  ARCHITECTURE_FLOWS,
} from "../data/academicData";

const LAYER_STYLES: Record<
  string,
  { fill: string; stroke: string; badge: string }
> = {
  presentation: {
    fill: "#0B172A",
    stroke: "#1E3A8A",
    badge: "text-white",
  },
  application: {
    fill: "#EFF6FF",
    stroke: "#1D4ED8",
    badge: "text-blue-900",
  },
  "ai-core": {
    fill: "#ECFEFF",
    stroke: "#0891B2",
    badge: "text-cyan-950",
  },
  storage: {
    fill: "#F8FAFC",
    stroke: "#475569",
    badge: "text-slate-900",
  },
};

export const ArchitectureView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("ui");

  const compMap = useMemo(() => {
    const m = new Map<string, (typeof ARCHITECTURE_COMPONENTS)[number]>();
    ARCHITECTURE_COMPONENTS.forEach((c) => m.set(c.id, c));
    return m;
  }, []);

  const selected = compMap.get(selectedId) ?? ARCHITECTURE_COMPONENTS[0];

  const relatedFlows = useMemo(
    () =>
      ARCHITECTURE_FLOWS.filter(
        (f) => f.from === selected.id || f.to === selected.id
      ),
    [selected]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              معماری نرم‌افزاری سامانه DocuMind AI (۹ جزء اصلی)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              روی هر یک از ۹ جزء در نمودار کلیک کنید تا مسئولیت‌ها، ورودی/خروجی، الگوهای طراحی
              به‌کاررفته و جریان انتقال داده با فلش‌های جهت‌دار بررسی شود.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#0B172A] inline-block" />
              <span>لایه ارائه</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-100 border border-blue-700 inline-block" />
              <span>لایه کاربرد</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-cyan-50 border border-cyan-600 inline-block" />
              <span>هسته پردازش و AI</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-100 border border-slate-600 inline-block" />
              <span>لایه داده و دانش</span>
            </span>
          </div>
        </div>
      </section>

      {/* Interactive SVG Diagram + Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-4 overflow-x-auto">
          <svg viewBox="0 0 880 510" className="w-full min-w-[660px] h-auto">
            <defs>
              <marker
                id="arch-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748B" />
              </marker>
              <marker
                id="arch-arrow-active"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#0891B2" />
              </marker>
            </defs>

            {/* Layer Background Bands */}
            <rect x="20" y="16" width="840" height="92" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <rect x="20" y="124" width="840" height="228" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <rect x="20" y="368" width="840" height="122" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />

            {/* Flow Arrows */}
            {ARCHITECTURE_FLOWS.map((flow, idx) => {
              const from = compMap.get(flow.from);
              const to = compMap.get(flow.to);
              if (!from || !to) return null;

              const x1 = from.x + 88;
              const y1 = from.y + 30;
              const x2 = to.x + 88;
              const y2 = to.y + 30;
              const isActive =
                flow.from === selected.id || flow.to === selected.id;

              const dx = x2 - x1;
              const dy = y2 - y1;
              const len = Math.hypot(dx, dy) || 1;
              const sx = x1 + (dx / len) * 52;
              const sy = y1 + (dy / len) * 28;
              const ex = x2 - (dx / len) * 56;
              const ey = y2 - (dy / len) * 30;

              return (
                <g key={`${flow.from}-${flow.to}-${idx}`}>
                  <line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke={isActive ? "#0891B2" : "#94A3B8"}
                    strokeWidth={isActive ? 2.2 : 1.2}
                    strokeDasharray={isActive ? undefined : "4 3"}
                    markerEnd={
                      isActive ? "url(#arch-arrow-active)" : "url(#arch-arrow)"
                    }
                    opacity={isActive ? 1 : 0.65}
                  />
                  {isActive && (
                    <text
                      x={(sx + ex) / 2}
                      y={(sy + ey) / 2 - 5}
                      textAnchor="middle"
                      fill="#0E7490"
                      fontSize="10"
                      fontWeight="700"
                    >
                      {flow.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* 9 Component Nodes */}
            {ARCHITECTURE_COMPONENTS.map((comp) => {
              const style = LAYER_STYLES[comp.layer];
              const isSelected = comp.id === selected.id;
              return (
                <g
                  key={comp.id}
                  transform={`translate(${comp.x}, ${comp.y})`}
                  onClick={() => setSelectedId(comp.id)}
                  className="cursor-pointer"
                >
                  <rect
                    width="176"
                    height="62"
                    rx="10"
                    fill={style.fill}
                    stroke={isSelected ? "#06B6D4" : style.stroke}
                    strokeWidth={isSelected ? 2.8 : 1.4}
                  />
                  <text
                    x="88"
                    y="24"
                    textAnchor="middle"
                    fill={comp.layer === "presentation" ? "#FFFFFF" : "#0F172A"}
                    fontSize="12"
                    fontWeight="700"
                  >
                    {comp.order.toLocaleString("fa-IR")}. {comp.titleFa}
                  </text>
                  <text
                    x="88"
                    y="44"
                    textAnchor="middle"
                    fill={comp.layer === "presentation" ? "#CBD5E1" : "#475569"}
                    fontSize="10"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {comp.titleEn}
                  </text>
                </g>
              );
            })}
          </svg>
        </section>

        {/* Component Detail Inspector */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs text-cyan-700 font-medium">
                {selected.layerFa}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selected.order.toLocaleString("fa-IR")}. {selected.titleFa}
              </h3>
              <div className="text-xs font-mono text-slate-500">
                {selected.titleEn}
              </div>
            </div>
            <Boxes className="w-5 h-5 text-blue-700 shrink-0" />
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {selected.summary}
          </p>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">مسئولیت‌های کلیدی</div>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              {selected.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
              <div className="text-[11px] font-bold text-slate-700">ورودی‌ها</div>
              {selected.inputs.map((i) => (
                <div key={i} className="text-[11px] text-slate-600">
                  · {i}
                </div>
              ))}
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
              <div className="text-[11px] font-bold text-slate-700">خروجی‌ها</div>
              {selected.outputs.map((o) => (
                <div key={o} className="text-[11px] text-slate-600">
                  · {o}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-700" />
              <span>الگوهای طراحی و جریان داده مرتبط</span>
            </div>
            <div className="text-xs text-blue-800 font-medium">
              {selected.patternsApplied.join(" · ")}
            </div>
            <div className="text-xs text-slate-500 space-y-1 pt-1">
              {relatedFlows.map((rf, i) => (
                <div key={i}>
                  {rf.label}:{" "}
                  <span className="text-slate-700">
                    {compMap.get(rf.from)?.titleFa} ←{" "}
                    {compMap.get(rf.to)?.titleFa}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
