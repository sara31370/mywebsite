import React, { useState } from "react";
import {
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  AI_PATTERNS_DATA,
  AIPatternSpec,
  SUPPLEMENTARY_GOF_PATTERNS,
} from "../data/aiPatternsData";
import { CapabilityStatusLabel, NavSectionId } from "../types/documind";

const STATUS_STYLE: Record<CapabilityStatusLabel, string> = {
  "پیاده‌سازی‌شده": "text-emerald-800 bg-emerald-50 border-emerald-200",
  "شبیهسازی آموزشی": "text-amber-800 bg-amber-50 border-amber-200",
  "پیشنهاد معماری": "text-blue-800 bg-blue-50 border-blue-200",
};

const PatternFlowSvg: React.FC<{ pattern: AIPatternSpec }> = ({ pattern }) => {
  const steps = pattern.flowSteps;
  const width = 880;
  const stepCount = steps.length;
  const boxW = Math.min(165, Math.floor((width - 60 - (stepCount - 1) * 28) / stepCount));
  const gap = 28;
  const totalW = stepCount * boxW + (stepCount - 1) * gap;
  const startX = (width - totalW) / 2;

  return (
    <svg
      viewBox={`0 0 ${width} 118`}
      className="w-full min-w-[620px] h-auto bg-slate-50 rounded-lg border border-slate-200"
    >
      <defs>
        <marker
          id={`pf-arrow-${pattern.id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#0891B2" />
        </marker>
      </defs>

      {steps.map((stepText, idx) => {
        // Right-to-left visual progression for Persian reading order
        const rtlIdx = stepCount - 1 - idx;
        const x = startX + rtlIdx * (boxW + gap);
        const y = 24;
        const isFirst = idx === 0;
        const isLast = idx === stepCount - 1;

        return (
          <g key={stepText}>
            {idx < stepCount - 1 && (
              <line
                x1={x}
                y1={y + 34}
                x2={x - gap + 3}
                y2={y + 34}
                stroke="#0891B2"
                strokeWidth="1.8"
                markerEnd={`url(#pf-arrow-${pattern.id})`}
              />
            )}
            <rect
              x={x}
              y={y}
              width={boxW}
              height={68}
              rx={8}
              fill={isFirst ? "#0B172A" : isLast ? "#ECFEFF" : "#FFFFFF"}
              stroke={isFirst ? "#0B172A" : isLast ? "#0891B2" : "#CBD5E1"}
              strokeWidth={isLast ? 1.8 : 1.2}
            />
            <text
              x={x + boxW / 2}
              y={y + 20}
              textAnchor="middle"
              fill={isFirst ? "#67E8F9" : "#0E7490"}
              fontSize="10"
              fontWeight="700"
            >
              گام {(idx + 1).toLocaleString("fa-IR")}
            </text>
            <foreignObject x={x + 6} y={y + 26} width={boxW - 12} height={38}>
              <div
                style={{
                  fontSize: "10px",
                  lineHeight: "1.35",
                  textAlign: "center",
                  color: isFirst ? "#FFFFFF" : "#0F172A",
                  fontWeight: 600,
                }}
              >
                {stepText}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
};

export const DesignPatternsView: React.FC<{
  onNavigate?: (section: NavSectionId) => void;
}> = ({ onNavigate }) => {
  const [selectedPatternId, setSelectedPatternId] = useState<AIPatternSpec["id"]>("rag");
  const [scenarioTab, setScenarioTab] = useState<"success" | "failure">("success");

  const reliabilityGroup = AI_PATTERNS_DATA.filter((p) => p.group === "reliability");
  const knowledgeGroup = AI_PATTERNS_DATA.filter((p) => p.group === "model-knowledge");

  const activePattern =
    AI_PATTERNS_DATA.find((p) => p.id === selectedPatternId) ?? AI_PATTERNS_DATA[0];

  const corePatterns = AI_PATTERNS_DATA.filter((p) => p.architectureRole === "core");
  const complementaryPatterns = AI_PATTERNS_DATA.filter(
    (p) => p.architectureRole === "complementary"
  );

  return (
    <div className="space-y-6">
      {/* Lab Intro & Core vs Complementary Selection */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-cyan-700">
              مبتنی بر جزوه دوم: الگوهای طراحی نرم‌افزارهای مبتنی بر هوش مصنوعی (AI Software Design Patterns)
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              آزمایشگاه الگوهای طراحی مبتنی بر هوش مصنوعی (۹ الگو در ۲ گروه)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              در طراحی سامانه DocuMind AI، چهار الگو به عنوان هسته اصلی معماری انتخاب شده‌اند و
              پنج الگوی دیگر به‌عنوان الگوهای مکمل با تحلیل محل ضرورت (ضروری / مفید / غیرضروری)
              بررسی می‌شوند. الگوهای عمومی شیءگرا در بخش تکمیلی انتهای صفحه با برچسب صریح تفکیک
              گردیده‌اند.
            </p>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate("pattern-interactions")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0"
            >
              <span>مشاهده تعامل میان الگوها</span>
              <ArrowLeft className="w-4 h-4 text-cyan-300" />
            </button>
          )}
        </div>

        {/* Two Pattern Groups Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
          {/* Group A */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>الف) قابلیت اطمینان و کنترل خروجی (۴ الگو)</span>
              <ShieldCheck className="w-4 h-4 text-blue-700" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reliabilityGroup.map((p) => {
                const isSelected = p.id === activePattern.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPatternId(p.id)}
                    className={`p-3 rounded-lg border text-right transition-colors space-y-1 ${
                      isSelected
                        ? "bg-[#0B172A] text-white border-[#0B172A]"
                        : "bg-white text-slate-800 border-slate-200 hover:border-cyan-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold truncate">{p.nameFa}</span>
                      <span
                        className={`text-[10px] shrink-0 ${
                          isSelected ? "text-cyan-300" : "text-blue-700"
                        }`}
                      >
                        {p.architectureRole === "core" ? "هسته اصلی" : "مکمل"}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] font-mono truncate ${
                        isSelected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {p.nameEn}
                    </div>
                    <div
                      className={`text-[10px] ${
                        isSelected ? "text-cyan-200" : "text-slate-500"
                      }`}
                    >
                      وضعیت: {p.statusLabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group B */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>ب) مدیریت مدل و دانش (۵ الگو)</span>
              <Cpu className="w-4 h-4 text-cyan-700" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {knowledgeGroup.map((p) => {
                const isSelected = p.id === activePattern.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPatternId(p.id)}
                    className={`p-3 rounded-lg border text-right transition-colors space-y-1 ${
                      isSelected
                        ? "bg-[#0B172A] text-white border-[#0B172A]"
                        : "bg-white text-slate-800 border-slate-200 hover:border-cyan-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold truncate">{p.nameFa}</span>
                      <span
                        className={`text-[10px] shrink-0 ${
                          isSelected ? "text-cyan-300" : "text-blue-700"
                        }`}
                      >
                        {p.architectureRole === "core" ? "هسته اصلی" : "مکمل"}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] font-mono truncate ${
                        isSelected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {p.nameEn}
                    </div>
                    <div
                      className={`text-[10px] ${
                        isSelected ? "text-cyan-200" : "text-slate-500"
                      }`}
                    >
                      وضعیت: {p.statusLabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Selected Pattern Comprehensive Interactive Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        {/* Pattern Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{activePattern.groupLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-blue-800">
                {activePattern.architectureRole === "core"
                  ? "الگوی منتخب هسته اصلی معماری DocuMind AI"
                  : "الگوی مکمل معماری"}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {activePattern.order.toLocaleString("fa-IR")}. {activePattern.nameFa} (
              <span className="font-mono text-lg text-blue-800">
                {activePattern.nameEn}
              </span>
              )
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold ${
                STATUS_STYLE[activePattern.statusLabel]
              }`}
            >
              وضعیت در سامانه: {activePattern.statusLabel}
            </span>
          </div>
        </div>

        {/* 1. Problem & Scientific Definition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5">
            <div className="text-xs font-bold text-slate-900">مسئله‌ای که الگو حل می‌کند</div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activePattern.problemSolved}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5">
            <div className="text-xs font-bold text-slate-900">تعریف علمی و منطق عملکرد</div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activePattern.scientificDefinition}
            </p>
          </div>
        </div>

        {/* 2. Execution Flow Diagram */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-900">
            نمودار جریان اجرای الگو
          </div>
          <div className="overflow-x-auto">
            <PatternFlowSvg pattern={activePattern} />
          </div>
        </div>

        {/* 3. Structure/Components & Architecture Interaction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-900">ساختار و اجزای اصلی</div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {activePattern.coreComponents.map((c) => (
                <div key={c.name} className="p-3 bg-white space-y-0.5">
                  <div className="text-xs font-mono font-bold text-blue-800">{c.name}</div>
                  <div className="text-xs text-slate-600">{c.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5">
              <div className="text-xs font-bold text-slate-900">
                نحوه تعامل با سایر اجزای معماری
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activePattern.architectureInteraction}
              </p>
            </div>
            <div className="bg-cyan-50/60 border border-cyan-200 rounded-lg p-4 space-y-1.5">
              <div className="text-xs font-bold text-cyan-950">
                نقش مشخص الگو در سامانه DocuMind AI
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activePattern.documindRole}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Real Enterprise Example */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 space-y-1.5">
          <div className="text-xs font-bold text-blue-950">
            مثال واقعی از کاربرد الگو در تحلیل اسناد سازمانی
          </div>
          <p className="text-xs text-slate-800 leading-relaxed">
            {activePattern.enterpriseExample}
          </p>
        </div>

        {/* 5. Advantages / Limitations & Suitable / Unsuitable Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-emerald-800">مزایا</div>
              <ul className="space-y-1 text-xs text-slate-700">
                {activePattern.advantages.map((a) => (
                  <li key={a}>· {a}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="text-xs font-bold text-amber-800">محدودیت‌ها</div>
              <ul className="space-y-1 text-xs text-slate-700">
                {activePattern.limitations.map((l) => (
                  <li key={l}>· {l}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-blue-900">شرایط مناسب استفاده</div>
              <ul className="space-y-1 text-xs text-slate-700">
                {activePattern.suitableConditions.map((s) => (
                  <li key={s}>· {s}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="text-xs font-bold text-red-800">شرایط نامناسب استفاده</div>
              <ul className="space-y-1 text-xs text-slate-700">
                {activePattern.unsuitableConditions.map((u) => (
                  <li key={u}>· {u}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 6. Interactive Success vs Failure Scenario */}
        <div className="border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs font-bold text-slate-900">
              سناریوی اجرایی الگو (موفق و شکست)
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setScenarioTab("success")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  scenarioTab === "success"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-600"
                }`}
              >
                سناریوی موفق
              </button>
              <button
                type="button"
                onClick={() => setScenarioTab("failure")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  scenarioTab === "failure"
                    ? "bg-white text-red-800 shadow-xs"
                    : "text-slate-600"
                }`}
              >
                سناریوی شکست
              </button>
            </div>
          </div>

          {scenarioTab === "success" ? (
            <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-xs text-emerald-950 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{activePattern.successScenario}</span>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3.5 text-xs text-red-950 leading-relaxed">
              <AlertOctagon className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <span>{activePattern.failureScenario}</span>
            </div>
          )}
        </div>
      </section>

      {/* Core Architecture Selection & Complementary Necessity Matrix */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-700" />
            <span>الگوهای منتخب معماری اصلی DocuMind AI و تحلیل ضرورت الگوهای مکمل</span>
          </h3>
          <p className="text-xs text-slate-500">
            تمایز میان ۴ الگوی هسته اصلی که بدون آن‌ها سامانه کارایی علمی ندارد و ۵ الگوی مکمل
            بر اساس اینکه در کدام بخش ضروری، مفید یا غیرضروری هستند.
          </p>
        </div>

        {/* 4 Core Patterns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {corePatterns.map((cp) => (
            <button
              key={cp.id}
              type="button"
              onClick={() => setSelectedPatternId(cp.id)}
              className="text-right bg-[#0B172A] text-white rounded-xl p-4 space-y-1.5 hover:bg-slate-800 transition-colors"
            >
              <div className="text-[11px] text-cyan-300 font-semibold">
                هسته اصلی · {cp.statusLabel}
              </div>
              <div className="text-sm font-bold">{cp.nameEn}</div>
              <div className="text-xs text-slate-300 line-clamp-2">{cp.documindRole}</div>
            </button>
          ))}
        </div>

        {/* 5 Complementary Patterns Necessity Matrix */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-right text-xs border-collapse min-w-[740px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">الگوی مکمل</th>
                <th className="py-2.5 px-3 font-semibold">حکم کلی در DocuMind AI</th>
                <th className="py-2.5 px-3 font-semibold text-emerald-800">بخش ضروری</th>
                <th className="py-2.5 px-3 font-semibold text-blue-800">بخش مفید</th>
                <th className="py-2.5 px-3 font-semibold text-slate-600">بخش غیرضروری</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complementaryPatterns.map((comp) => (
                <tr key={comp.id} className="align-top hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    <div>{comp.nameFa}</div>
                    <div className="font-mono text-[11px] text-slate-500 font-normal">
                      {comp.nameEn}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-cyan-800 whitespace-nowrap">
                    {comp.necessityAnalysis?.overallVerdict} · {comp.statusLabel}
                  </td>
                  <td className="py-3 px-3 text-slate-700 leading-relaxed">
                    {comp.necessityAnalysis?.essentialIn}
                  </td>
                  <td className="py-3 px-3 text-slate-700 leading-relaxed">
                    {comp.necessityAnalysis?.usefulIn}
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">
                    {comp.necessityAnalysis?.unnecessaryIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Supplementary OOP Patterns Section — Explicitly Labeled Outside Handout List */}
      <section className="bg-slate-100 border border-slate-300 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-amber-800">
              بخش تکمیلی مهندسی نرم‌افزار — الگوی خارج از فهرست جزوه
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              الگوهای عمومی زیرساخت کدنویسی (Strategy، Factory Method، Observer)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md px-3 py-1 shrink-0">
            وضعیت در ساختار پروژه: پیاده‌سازی‌شده (خارج از فهرست جزوه AI)
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          طبق چارچوب درس، الگوهای اصلی پروژه منحصراً ۹ الگوی هوش مصنوعی جزوه دوم هستند. سه الگوی
          کلاسیک زیر صرفاً به‌عنوان ابزارهای پیاده‌سازی شیءگرا در زیرساخت کد کاربرد دارند و به
          عنوان الگوهای اصلی پروژه معرفی نمی‌شوند:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUPPLEMENTARY_GOF_PATTERNS.map((g) => (
            <div
              key={g.id}
              className="bg-white border border-slate-200 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">{g.nameEn}</span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 shrink-0">
                  {g.tag}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">{g.category}</div>
              <p className="text-xs text-slate-700 leading-relaxed">{g.roleNote}</p>
              <div className="text-[11px] font-mono text-blue-800 bg-slate-50 rounded p-2">
                {g.codeUsage}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
