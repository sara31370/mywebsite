import React from "react";
import {
  ArrowUpLeft,
  BookMarked,
  Clock,
  FileCheck2,
  FileText,
  Lightbulb,
  MessageCircleQuestion,
  Network,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { WEEKLY_ACTIVITY_SERIES } from "../data/corpusData";
import {
  EnterpriseDocument,
  NavSectionId,
  ObserverEvent,
  SystemActivityItem,
} from "../types/documind";

interface DashboardViewProps {
  documents: EnterpriseDocument[];
  answeredQuestionsCount: number;
  activities: SystemActivityItem[];
  observerEvents: ObserverEvent[];
  geminiConfigured: boolean | null;
  onNavigate: (section: NavSectionId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  answeredQuestionsCount,
  activities,
  observerEvents,
  geminiConfigured,
  onNavigate,
}) => {
  const analyzedDocs = documents.filter((d) => d.status === "تحلیل‌شده");
  const uniqueConcepts = new Set<string>();
  documents.forEach((doc) => {
    doc.analysis.concepts.forEach((c) => uniqueConcepts.add(c));
    doc.analysis.keywords.forEach((k) => uniqueConcepts.add(k));
  });

  const kpis = [
    {
      label: "کل اسناد ثبت‌شده",
      value: documents.length,
      unit: "سند سازمانی",
      icon: FileText,
      accent: "text-blue-700 bg-blue-50",
    },
    {
      label: "اسناد تحلیل‌شده",
      value: analyzedDocs.length,
      unit: `${Math.round((analyzedDocs.length / Math.max(1, documents.length)) * 100)}٪ تکمیل پردازش`,
      icon: FileCheck2,
      accent: "text-cyan-700 bg-cyan-50",
    },
    {
      label: "مفاهیم و کلیدواژه‌های استخراج‌شده",
      value: uniqueConcepts.size,
      unit: "گره معنایی یکتا",
      icon: Lightbulb,
      accent: "text-slate-800 bg-slate-100",
    },
    {
      label: "پرسش‌های پاسخ‌داده‌شده",
      value: answeredQuestionsCount,
      unit: "پاسخ مستند با منبع",
      icon: MessageCircleQuestion,
      accent: "text-blue-700 bg-blue-50",
    },
  ];

  const series = WEEKLY_ACTIVITY_SERIES.map((item, idx) =>
    idx === WEEKLY_ACTIVITY_SERIES.length - 1
      ? {
          ...item,
          uploads: documents.length,
          analyses: analyzedDocs.length,
          queries: answeredQuestionsCount,
        }
      : item
  );

  const maxQueryVal = Math.max(...series.map((s) => s.queries), 20);

  return (
    <div className="space-y-6">
      {/* Hero Academic Overview Banner */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-medium text-cyan-700">
              آزمایشگاه الگوهای طراحی نرم‌افزارهای مبتنی بر هوش مصنوعی (جزوه دوم) · مسئله شماره ۷
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-snug text-balance">
              سامانه هوشمند تحلیل اسناد و استخراج دانش سازمانی
            </h1>
            <p className="text-sm lg:text-[15px] text-slate-600 leading-relaxed">
              معماری هسته اصلی <span className="font-semibold text-slate-800">DocuMind AI</span> بر
              پایه چهار الگوی محوری هوش مصنوعی شامل{" "}
              <span className="font-mono text-xs text-blue-700">RAG</span>،{" "}
              <span className="font-mono text-xs text-blue-700">Model Gateway</span>،{" "}
              <span className="font-mono text-xs text-blue-700">Structured Output</span> و{" "}
              <span className="font-mono text-xs text-blue-700">Guardrails</span> طراحی شده و از
              الگوهای مکمل <span className="font-mono text-xs text-cyan-800">Prompt Template</span>،{" "}
              <span className="font-mono text-xs text-cyan-800">Semantic Cache</span>،{" "}
              <span className="font-mono text-xs text-cyan-800">Fallback Model</span>،{" "}
              <span className="font-mono text-xs text-cyan-800">Human-in-the-Loop</span> و{" "}
              <span className="font-mono text-xs text-cyan-800">Agentic Planning</span> بهره می‌برد.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
              <span>
                وضعیت درگاه مدل (Model Gateway):{" "}
                <strong className="text-slate-800">
                  {geminiConfigured
                    ? "پیاده‌سازی‌شده (متصل به Gemini API و پشتیبانی شبیهسازی آموزشی)"
                    : "شبیهسازی آموزشی (RAG محلی فعال — درگاه سرور آماده اتصال کلید API)"}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>ذخیره‌سازی نشست: localStorage مرورگر</span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate("design-patterns")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B172A] text-white text-sm font-medium hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <BookMarked className="w-4 h-4 text-cyan-300" />
              <span>آزمایشگاه ۹ الگوی طراحی AI</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("pattern-interactions")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200 text-sm font-medium hover:bg-cyan-100 transition-colors whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>تحلیل تعامل الگوها</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("documents")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-700 border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>بارگذاری و مدیریت اسناد</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-slate-500">{kpi.label}</div>
                <div className="text-3xl font-bold text-slate-900 tabular-nums">
                  {kpi.value.toLocaleString("fa-IR")}
                </div>
                <div className="text-xs text-slate-500 tabular-nums">{kpi.unit}</div>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${kpi.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Analytics Grid: Activity Chart + Core AI Patterns Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                نمودار فعالیت سامانه در هفته جاری
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                مقایسه پرسش‌های مستند (RAG) و اسناد تحلیل‌شده با Structured Output
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                <span>پرسش‌های پاسخ‌داده‌شده</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-cyan-500 inline-block" />
                <span>اسناد تحلیل‌شده</span>
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 border-b border-slate-200 pb-3 px-1">
              {series.map((day) => {
                const queryHeightPct = Math.max(12, Math.round((day.queries / maxQueryVal) * 100));
                const analysisHeightPct = Math.max(
                  10,
                  Math.round((day.analyses / maxQueryVal) * 100)
                );
                return (
                  <div key={day.day} className="flex flex-col items-center h-full justify-end gap-2">
                    <div className="text-[11px] font-medium text-slate-600 tabular-nums">
                      {day.queries.toLocaleString("fa-IR")}
                    </div>
                    <div className="w-full flex items-end justify-center gap-1.5 flex-1 max-h-40">
                      <div
                        className="w-3 sm:w-4 bg-blue-600 rounded-t-sm transition-all duration-300"
                        style={{ height: `${queryHeightPct}%` }}
                      />
                      <div
                        className="w-3 sm:w-4 bg-cyan-500 rounded-t-sm transition-all duration-300"
                        style={{ height: `${analysisHeightPct}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-600 whitespace-nowrap">{day.day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Core 4 Selected AI Patterns */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              ۴ الگوی هسته اصلی در معماری سامانه
            </h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="pb-2.5 border-b border-slate-100">
                <div className="font-semibold text-slate-800">۱. Retrieval-Augmented Generation (RAG)</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  بازیابی مستندات مرتبط و پاسخ‌گویی مقید به نام فایل و شماره صفحه.
                </div>
              </li>
              <li className="pb-2.5 border-b border-slate-100">
                <div className="font-semibold text-slate-800">۲. Model Gateway</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  درگاه امن سرور برای مدیریت ارتباط با مدل‌ها، کلیدها و مسیر Fallback.
                </div>
              </li>
              <li className="pb-2.5 border-b border-slate-100">
                <div className="font-semibold text-slate-800">۳. Structured Output</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  تولید خروجی JSON ساختاریافته برای استخراج موجودیت‌ها و تغذیه گراف دانش.
                </div>
              </li>
              <li>
                <div className="font-semibold text-slate-800">۴. Guardrails</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  پالایش ورودی‌های تزریق پرامپت و کنترل آستانه اطمینان و استناد خروجی.
                </div>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("knowledge-graph")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Network className="w-4 h-4 text-cyan-700" />
            <span>مشاهده گراف دانش استخراج‌شده</span>
          </button>
        </section>
      </div>

      {/* Bottom 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">آخرین اسناد اضافه‌شده</h2>
            <button
              type="button"
              onClick={() => onNavigate("documents")}
              className="text-xs font-medium text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              <span>مشاهده همه</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {documents.slice(0, 4).map((doc) => (
              <div key={doc.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                <div className="text-sm font-semibold text-slate-800 line-clamp-1">
                  {doc.title}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{doc.fileType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{doc.sizeKB.toLocaleString("fa-IR")} KB</span>
                  <span aria-hidden="true">·</span>
                  <span>{doc.uploadedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-700 font-medium">
                    {doc.isSimulatedExtraction ? "شبیهسازی آموزشی" : "پیاده‌سازی‌شده"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">آخرین فعالیت‌های کاربران</h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 space-y-0.5">
                <div className="text-sm text-slate-800">
                  <span className="font-semibold">{act.user}</span>{" "}
                  <span className="text-slate-600">{act.action}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
                  <span className="truncate">{act.target}</span>
                  <span className="shrink-0">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              ثبت وقایع کنترلی و ابطال کش
            </h2>
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-xs text-slate-500">
            رویدادهای تغییر مخزن اسناد، بررسی Guardrails و ابطال Semantic Cache:
          </p>
          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
            {observerEvents.slice(0, 5).map((evt) => (
              <div key={evt.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-blue-700">
                    {evt.eventType}
                  </span>
                  <span className="tabular-nums text-slate-400">{evt.timestamp}</span>
                </div>
                <div className="text-xs text-slate-700">{evt.payloadSummary}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
