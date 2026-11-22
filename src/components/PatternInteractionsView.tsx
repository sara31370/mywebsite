import React, { useState } from "react";
import { AlertTriangle, GitCompareArrows, Play, Scale } from "lucide-react";
import {
  PATTERN_INTERACTIONS_DATA,
  PatternInteractionSpec,
} from "../data/aiPatternsData";

export const PatternInteractionsView: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(
    PATTERN_INTERACTIONS_DATA[0].id
  );
  const [traceLog, setTraceLog] = useState<string | null>(null);

  const selected: PatternInteractionSpec =
    PATTERN_INTERACTIONS_DATA.find((i) => i.id === activeId) ??
    PATTERN_INTERACTIONS_DATA[0];

  const runInteractionTrace = () => {
    const traces: Record<string, string> = {
      "rag-prompt":
        "ردیابی تعامل [پیاده‌سازی‌شده]: پرسش «الزامات رمزنگاری» → بازیابی قطعه آیین‌نامه امنیت صفحه ۳ ← درج در جایگاه {{contexts}} قالب Prompt Template ← تولید دستور یکپارچه با قید ذکر صفحه.",
      "rag-guardrails":
        "ردیابی تعامل [پیاده‌سازی‌شده]: بررسی Input Guardrail (بدون تزریق پرامپت) ← بازیابی RAG (امتیاز ۳۴٪ یا زیر ۲۵٪) ← بررسی Output Guardrail: اگر امتیاز < ۲۵٪ بود پاسخ مسدود و پیام عدم کفایت مدارک نمایش داده می‌شود.",
      "gateway-fallback":
        "ردیابی تعامل [شبیهسازی آموزشی]: ارسال درخواست به مدل اصلی در Model Gateway ← شبیه‌سازی خطای 503 Service Unavailable ← فعال‌سازی زنجیره Fallback Model و هدایت به موتور پشتیبان با اعلام افت سطح سرویس.",
      "structured-hitl":
        "ردیابی تعامل [شبیهسازی آموزشی]: استخراج بندهای قرارداد برون‌سپاری در قالب JSON ساختاریافته ← تشخیص دسته حساس «قراردادها و حقوقی» ← قرارگیری در صف تأیید کارشناس حقوقی پیش از ثبت نهایی.",
      "cache-rag":
        "ردیابی تعامل [پیاده‌سازی‌شده]: پرسش هم‌معنا با کش مطابقت داشت (Hit)؛ بررسی نسخه مخزن اسناد: اگر سند جدیدی اضافه نشده باشد پاسخ کش بازمی‌گردد، اما پس از بارگذاری سند جدید کش به‌طور خودکار باطل و RAG اجرا می‌شود.",
      "agentic-all":
        "ردیابی تعامل [پیشنهاد معماری]: هدف مرکب «مقایسه تعارض قرارداد با آیین‌نامه امنیت» → گام ۱: RAG آیین‌نامه، گام ۲: RAG قرارداد، گام ۳: Structured Output جدول تعارض + کنترل Guardrails + ارجاع به HITL.",
    };
    setTraceLog(traces[selected.id] ?? "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              تحلیل تعامل میان الگوهای طراحی هوش مصنوعی
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              الگوهای طراحی به‌صورت جزیره‌ای عمل نمی‌کنند؛ در این بخش نحوه همکاری، ترتیب
              اجرا، مصالحه‌های معماری و ریسک نبود هر یک از ۶ تعامل کلیدی بررسی می‌شود.
            </p>
          </div>
          <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-1.5 shrink-0">
            ۶ رابطه معماری مستندشده
          </span>
        </div>

        {/* High-Level Interaction Map SVG */}
        <div className="overflow-x-auto pt-1">
          <svg
            viewBox="0 0 900 265"
            className="w-full min-w-[680px] h-auto bg-slate-50 rounded-xl border border-slate-200"
          >
            <defs>
              <marker
                id="int-arrow"
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

            {/* Nodes positioned cleanly */}
            {[
              { id: "cache", x: 690, y: 24, title: "Semantic Cache", sub: "بررسی کش و اعتبار" },
              { id: "rag", x: 465, y: 24, title: "RAG", sub: "بازیابی اسناد و صفحه" },
              { id: "prompt", x: 240, y: 24, title: "Prompt Template", sub: "قالب استاندارد دستور" },
              { id: "gateway", x: 24, y: 24, title: "Model Gateway", sub: "درگاه و مدیریت مدل" },
              { id: "fallback", x: 24, y: 155, title: "Fallback Model", sub: "مدل جایگزین در خطا" },
              { id: "guardrails", x: 240, y: 155, title: "Guardrails", sub: "کنترل ایمنی و اعتبار" },
              { id: "structured", x: 465, y: 155, title: "Structured Output", sub: "خروجی JSON منظم" },
              { id: "hitl", x: 690, y: 155, title: "Human-in-the-Loop", sub: "تأیید موارد حساس" },
            ].map((node) => (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <rect
                  width="186"
                  height="64"
                  rx="9"
                  fill={
                    node.id === "rag" ||
                    node.id === "gateway" ||
                    node.id === "guardrails" ||
                    node.id === "structured"
                      ? "#0B172A"
                      : "#FFFFFF"
                  }
                  stroke="#0891B2"
                  strokeWidth="1.4"
                />
                <text
                  x="93"
                  y="27"
                  textAnchor="middle"
                  fill={
                    node.id === "rag" ||
                    node.id === "gateway" ||
                    node.id === "guardrails" ||
                    node.id === "structured"
                      ? "#FFFFFF"
                      : "#0F172A"
                  }
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {node.title}
                </text>
                <text
                  x="93"
                  y="47"
                  textAnchor="middle"
                  fill={
                    node.id === "rag" ||
                    node.id === "gateway" ||
                    node.id === "guardrails" ||
                    node.id === "structured"
                      ? "#67E8F9"
                      : "#475569"
                  }
                  fontSize="10"
                >
                  {node.sub}
                </text>
              </g>
            ))}

            {/* Interaction Arrows */}
            <line x1="690" y1="56" x2="656" y2="56" stroke="#0891B2" strokeWidth="1.8" markerEnd="url(#int-arrow)" />
            <line x1="465" y1="56" x2="431" y2="56" stroke="#0891B2" strokeWidth="1.8" markerEnd="url(#int-arrow)" />
            <line x1="240" y1="56" x2="215" y2="56" stroke="#0891B2" strokeWidth="1.8" markerEnd="url(#int-arrow)" />
            <line x1="117" y1="88" x2="117" y2="150" stroke="#0891B2" strokeWidth="1.8" markerEnd="url(#int-arrow)" />
            <line x1="210" y1="187" x2="236" y2="187" stroke="#0891B2" strokeWidth="1.8" markerEnd="url(#int-arrow)" />
            <line x1="426" y1="187" x2="460" y2="187" stroke="#0891B2" strokeWidth="1.8" markerEnd="url(#int-arrow)" />
            <line x1="651" y1="187" x2="685" y2="187" stroke="#0891B2" strokeWidth="1.8" markerEnd="url(#int-arrow)" />
            <line x1="558" y1="88" x2="355" y2="152" stroke="#0891B2" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#int-arrow)" />

            <text x="450" y="246" textAnchor="middle" fill="#475569" fontSize="10">
              هماهنگی لایه بالا: Agentic Planning & Execution می‌تواند در وظایف چندمرحله‌ای کل زنجیره بالا را در چند گام هدایت کند
            </text>
          </svg>
        </div>
      </section>

      {/* Selector Grid + Detailed Step-by-Step Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* 6 Interactions List */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-slate-700 px-2 pb-1">
            انتخاب رابطه تعاملی برای بررسی
          </div>
          {PATTERN_INTERACTIONS_DATA.map((item, idx) => {
            const isSelected = item.id === selected.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveId(item.id);
                  setTraceLog(null);
                }}
                className={`w-full text-right p-3.5 rounded-lg border transition-colors space-y-1 ${
                  isSelected
                    ? "bg-[#0B172A] text-white border-[#0B172A]"
                    : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className={isSelected ? "text-cyan-300" : "text-blue-700"}>
                    تعامل {(idx + 1).toLocaleString("fa-IR")}
                  </span>
                  <span className={isSelected ? "text-slate-300" : "text-slate-500"}>
                    {item.statusLabel}
                  </span>
                </div>
                <div className="text-xs font-bold">{item.title}</div>
                <div
                  className={`text-[11px] font-mono ${
                    isSelected ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {item.patterns[0]} ⇄ {item.patterns[1]}
                </div>
              </button>
            );
          })}
        </section>

        {/* Active Interaction Detail */}
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-700 font-semibold">
                <GitCompareArrows className="w-4 h-4" />
                <span>وضعیت در سامانه: {selected.statusLabel}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {selected.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={runInteractionTrace}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5 text-cyan-300" />
              <span>اجرای ردیابی مرحله‌به‌مرحله</span>
            </button>
          </div>

          {traceLog && (
            <div className="bg-cyan-50 border border-cyan-200 text-cyan-950 rounded-lg p-3.5 text-xs leading-relaxed">
              {traceLog}
            </div>
          )}

          <p className="text-sm text-slate-700 leading-relaxed">{selected.summary}</p>

          {/* Step-by-step sequence */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-900">
              جریان گام‌به‌گام تعامل
            </div>
            <div className="space-y-2">
              {selected.steps.map((st, idx) => (
                <div
                  key={st.actor}
                  className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <span className="w-6 h-6 rounded-md bg-[#0B172A] text-cyan-300 font-bold flex items-center justify-center shrink-0 tabular-nums">
                    {(idx + 1).toLocaleString("fa-IR")}
                  </span>
                  <div className="space-y-0.5">
                    <div className="font-mono font-bold text-blue-800">{st.actor}</div>
                    <div className="text-slate-700 leading-relaxed">{st.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tradeoff & Missing Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Scale className="w-4 h-4 text-blue-700" />
                <span>مصالحه معماری (Trade-off)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selected.architecturalTradeoff}
              </p>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>ریسک در صورت نبود این تعامل</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {selected.failureRiskIfMissing}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
