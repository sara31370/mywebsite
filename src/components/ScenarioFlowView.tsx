import React, { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack } from "lucide-react";
import { EXECUTION_SCENARIO_STEPS } from "../data/academicData";

export const ScenarioFlowView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= EXECUTION_SCENARIO_STEPS.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const currentSpec =
    EXECUTION_SCENARIO_STEPS.find((s) => s.step === activeStep) ??
    EXECUTION_SCENARIO_STEPS[0];

  return (
    <div className="space-y-6">
      {/* Header + Playback Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            سناریوی اجرای مرحله‌به‌مرحله سامانه (گام ۱ تا ۸)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            شبیه‌سازی جریان کامل از لحظه ورود کاربر و بارگذاری سند PDF تا استخراج دانش و
            پاسخ‌گویی مستند همراه با شماره صفحه.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (activeStep >= EXECUTION_SCENARIO_STEPS.length) setActiveStep(1);
              setIsPlaying((p) => !p);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-xs font-medium transition-colors whitespace-nowrap"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "توقف پخش" : "اجرای خودکار سناریو"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((s) =>
                s < EXECUTION_SCENARIO_STEPS.length ? s + 1 : 1
              );
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-xs font-medium transition-colors whitespace-nowrap"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span>گام بعدی</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(1);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی</span>
          </button>
        </div>
      </section>

      {/* Interactive SVG Flowchart */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 overflow-x-auto">
        <svg viewBox="0 0 920 220" className="w-full min-w-[740px] h-auto">
          <defs>
            <marker id="flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#0891B2" />
            </marker>
          </defs>

          {/* Row 1 (Steps 1-4 right-to-left) & Row 2 (Steps 5-8 left-to-right snake) */}
          {EXECUTION_SCENARIO_STEPS.map((step, idx) => {
            const isTopRow = idx < 4;
            const col = isTopRow ? 3 - idx : idx - 4;
            const x = 35 + col * 222;
            const y = isTopRow ? 22 : 126;
            const isActive = step.step === activeStep;
            const isCompleted = step.step < activeStep;

            return (
              <g key={step.step}>
                {/* Connectors */}
                {idx < 3 && (
                  <line
                    x1={x}
                    y1={y + 34}
                    x2={x - 36}
                    y2={y + 34}
                    stroke={isCompleted ? "#0891B2" : "#CBD5E1"}
                    strokeWidth="2"
                    markerEnd="url(#flow-arrow)"
                  />
                )}
                {idx === 3 && (
                  <line
                    x1={x + 90}
                    y1={y + 68}
                    x2={x + 90}
                    y2={122}
                    stroke={isCompleted ? "#0891B2" : "#CBD5E1"}
                    strokeWidth="2"
                    markerEnd="url(#flow-arrow)"
                  />
                )}
                {idx >= 4 && idx < 7 && (
                  <line
                    x1={x + 184}
                    y1={y + 34}
                    x2={x + 218}
                    y2={y + 34}
                    stroke={isCompleted ? "#0891B2" : "#CBD5E1"}
                    strokeWidth="2"
                    markerEnd="url(#flow-arrow)"
                  />
                )}

                <g
                  transform={`translate(${x}, ${y})`}
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStep(step.step);
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    width="184"
                    height="68"
                    rx="10"
                    fill={
                      isActive
                        ? "#0B172A"
                        : isCompleted
                          ? "#ECFEFF"
                          : "#FFFFFF"
                    }
                    stroke={
                      isActive
                        ? "#06B6D4"
                        : isCompleted
                          ? "#0891B2"
                          : "#CBD5E1"
                    }
                    strokeWidth={isActive ? 2.4 : 1.3}
                  />
                  <text
                    x="92"
                    y="25"
                    textAnchor="middle"
                    fill={isActive ? "#67E8F9" : "#0E7490"}
                    fontSize="10"
                    fontWeight="700"
                  >
                    گام {step.step.toLocaleString("fa-IR")}
                  </text>
                  <text
                    x="92"
                    y="46"
                    textAnchor="middle"
                    fill={isActive ? "#FFFFFF" : "#0F172A"}
                    fontSize="11"
                    fontWeight="700"
                  >
                    {step.title.length > 26
                      ? step.title.slice(0, 26) + "..."
                      : step.title}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </section>

      {/* Active Step Details & Step List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="text-xs font-semibold text-cyan-700 tabular-nums">
            جزئیات گام {currentSpec.step.toLocaleString("fa-IR")} از ۸
          </div>
          <h3 className="text-lg font-bold text-slate-900">{currentSpec.title}</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {currentSpec.description}
          </p>

          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            <div>
              <span className="text-slate-500">کنشگر: </span>
              <strong className="text-slate-900">{currentSpec.actor}</strong>
            </div>
            <div>
              <span className="text-slate-500">ماژول درگیر: </span>
              <strong className="text-slate-900">{currentSpec.component}</strong>
            </div>
            <div>
              <span className="text-slate-500">الگو / مکانیزم: </span>
              <strong className="text-blue-800 font-mono">
                {currentSpec.patternInvolved}
              </strong>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-slate-500">
              نمونه داده عبوری در این مرحله
            </div>
            <pre
              dir="ltr"
              className="bg-[#0B172A] text-cyan-200 rounded-lg p-3 text-[11px] font-mono overflow-x-auto"
            >
              {currentSpec.technicalPayload}
            </pre>
          </div>
        </section>

        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            نمای مرحله‌ای فرآیند از ابتدا تا پاسخ مستند
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXECUTION_SCENARIO_STEPS.map((st) => {
              const isActive = st.step === activeStep;
              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStep(st.step);
                  }}
                  className={`text-right p-3.5 rounded-lg border transition-colors ${
                    isActive
                      ? "bg-cyan-50/70 border-cyan-500"
                      : "bg-slate-50 border-slate-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-blue-800 tabular-nums">
                      مرحله {st.step.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {st.patternInvolved}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{st.title}</div>
                  <div className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {st.description}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
