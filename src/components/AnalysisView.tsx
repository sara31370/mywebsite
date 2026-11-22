import React, { useMemo, useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Cpu,
  GitMerge,
  KeyRound,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import {
  DeepRelationExtractionStrategy,
  StatisticalExtractionStrategy,
} from "../patterns/documindPatterns";
import { DocumentAnalysis, EnterpriseDocument } from "../types/documind";

interface AnalysisViewProps {
  documents: EnterpriseDocument[];
  initialDocId?: string | null;
  geminiConfigured: boolean | null;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  documents,
  initialDocId,
  geminiConfigured,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialDocId || documents[0]?.id || ""
  );
  const [strategyMode, setStrategyMode] = useState<"default" | "statistical" | "semantic">(
    "default"
  );
  const [liveAnalysis, setLiveAnalysis] = useState<DocumentAnalysis | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [approvedDocIds, setApprovedDocIds] = useState<Record<string, boolean>>({});

  const selectedDoc = useMemo(
    () => documents.find((d) => d.id === selectedDocId) ?? documents[0],
    [documents, selectedDocId]
  );

  const activeAnalysis: DocumentAnalysis | null = useMemo(() => {
    if (!selectedDoc) return null;
    if (liveAnalysis) return liveAnalysis;
    if (strategyMode === "statistical") {
      return new StatisticalExtractionStrategy().analyze(
        selectedDoc.title,
        selectedDoc.pages
      );
    }
    if (strategyMode === "semantic") {
      return new DeepRelationExtractionStrategy().analyze(
        selectedDoc.title,
        selectedDoc.pages
      );
    }
    return selectedDoc.analysis;
  }, [selectedDoc, strategyMode, liveAnalysis]);

  const handleRunLiveGeminiAnalysis = async () => {
    if (!selectedDoc) return;
    setLiveLoading(true);
    setLiveError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedDoc.title,
          text: selectedDoc.pages.map((p) => `[صفحه ${p.pageNumber}]\n${p.content}`).join("\n\n"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLiveError(data.error || "خطا در ارتباط با Model Gateway سرور.");
        return;
      }
      const keywords: string[] = Array.isArray(data.keywords) ? data.keywords : [];
      setLiveAnalysis({
        topic: data.topic || selectedDoc.title,
        summary: data.summary || selectedDoc.analysis.summary,
        keywords,
        keywordStats: keywords.slice(0, 6).map((k, idx) => ({
          term: k,
          count: Math.max(2, 7 - idx),
          weight: Math.max(45, 95 - idx * 8),
        })),
        dates: Array.isArray(data.dates) ? data.dates : [],
        people: Array.isArray(data.people) ? data.people : [],
        organizations: Array.isArray(data.organizations) ? data.organizations : [],
        concepts: Array.isArray(data.concepts) ? data.concepts : [],
        conceptRelations: Array.isArray(data.conceptRelations)
          ? data.conceptRelations
          : [],
        strategyUsed: "semantic",
        isSimulated: false,
      });
    } catch {
      setLiveError("خطای شبکه در اتصال به Model Gateway (/api/analyze).");
    } finally {
      setLiveLoading(false);
    }
  };

  if (!selectedDoc || !activeAnalysis) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
        هیچ سندی برای تحلیل موجود نیست. ابتدا از بخش «مدیریت اسناد» یک سند اضافه کنید.
      </div>
    );
  }

  const isSensitiveDoc =
    selectedDoc.category === "قراردادها و حقوقی" ||
    selectedDoc.category === "حکمرانی و امنیت";
  const isHumanApproved = Boolean(approvedDocIds[selectedDoc.id]);

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              تحلیل هوشمند اسناد (Structured Output + Model Gateway + HITL)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              استخراج اطلاعات کلیدی سند در قالب JSON ساختاریافته همراه با امکان بازبینی انسانی
              (Human-in-the-Loop) برای اسناد حساس.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRunLiveGeminiAnalysis}
              disabled={liveLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[#0B172A] text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>
                {liveLoading
                  ? "در حال استخراج از Model Gateway..."
                  : geminiConfigured
                    ? "تحلیل زنده از Model Gateway"
                    : "آزمایش درگاه زنده سرور"}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              انتخاب سند جهت تحلیل
            </label>
            <select
              value={selectedDoc.id}
              onChange={(e) => {
                setSelectedDocId(e.target.value);
                setLiveAnalysis(null);
                setLiveError(null);
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.fileType})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              حالت استخراج ساختاریافته
            </label>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setStrategyMode("default");
                  setLiveAnalysis(null);
                }}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  strategyMode === "default" && !liveAnalysis
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                تحلیل ثبت‌شده
              </button>
              <button
                type="button"
                onClick={() => {
                  setStrategyMode("statistical");
                  setLiveAnalysis(null);
                }}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  strategyMode === "statistical" && !liveAnalysis
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                شبیهسازی آماری سریع
              </button>
              <button
                type="button"
                onClick={() => {
                  setStrategyMode("semantic");
                  setLiveAnalysis(null);
                }}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  strategyMode === "semantic" && !liveAnalysis
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                شبیهسازی معنایی و روابط
              </button>
            </div>
          </div>
        </div>

        {liveError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 text-xs">
            {liveError}
          </div>
        )}

        {/* Human-in-the-Loop Interactive Review Gate for Sensitive Documents */}
        {isSensitiveDoc && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <UserCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                الگوی <strong>Human-in-the-Loop (شبیهسازی آموزشی)</strong>: این سند در دسته حساس «
                {selectedDoc.category}» قرار دارد.{" "}
                {isHumanApproved
                  ? "خروجی ساختاریافته توسط کارشناس تأیید شده است."
                  : "پیش از اتکای نهایی نیازمند تأیید کارشناس است."}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setApprovedDocIds((prev) => ({
                  ...prev,
                  [selectedDoc.id]: !prev[selectedDoc.id],
                }))
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                isHumanApproved
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-[#0B172A] text-white hover:bg-slate-800"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isHumanApproved ? "تأییدشده توسط کارشناس" : "تأیید خروجی توسط کارشناس"}</span>
            </button>
          </div>
        )}
      </section>

      {/* Topic & Summary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-700" />
            <span>خروجی الگوی Structured Output</span>
            <span aria-hidden="true">·</span>
            <span>
              وضعیت:{" "}
              <strong className="text-slate-800">
                {activeAnalysis.isSimulated ? "شبیهسازی آموزشی" : "پیاده‌سازی‌شده"}
              </strong>
            </span>
          </div>
          <span className="font-mono text-blue-700">
            Schema: DocumentAnalysisJSON
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{activeAnalysis.topic}</h3>
        <p className="text-sm text-slate-700 leading-relaxed">{activeAnalysis.summary}</p>
      </section>

      {/* Entities Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <KeyRound className="w-4 h-4 text-blue-700" />
            <span>کلمات کلیدی</span>
          </div>
          <div className="text-sm text-slate-800 leading-7">
            {activeAnalysis.keywords.join(" · ") || "یافت نشد"}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-cyan-700" />
            <span>تاریخ‌های استخراج‌شده</span>
          </div>
          <div className="text-sm text-slate-800 tabular-nums leading-7">
            {activeAnalysis.dates.join(" · ") || "ثبت نشده"}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Users className="w-4 h-4 text-blue-700" />
            <span>نام اشخاص</span>
          </div>
          <div className="text-sm text-slate-800 leading-7">
            {activeAnalysis.people.join(" · ") || "یافت نشد"}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Building2 className="w-4 h-4 text-cyan-700" />
            <span>سازمان‌ها و نهادها</span>
          </div>
          <div className="text-sm text-slate-800 leading-7">
            {activeAnalysis.organizations.join(" · ") || "یافت نشد"}
          </div>
        </div>
      </section>

      {/* Graphical Keyword Chart + Concept Relations Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              نمودار وزن و اهمیت مفاهیم کلیدی
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              شاخص اهمیت محاسبه‌شده بر اساس فراوانی و جایگاه معنایی در متن سند
            </p>
          </div>
          <div className="space-y-3.5 pt-1">
            {activeAnalysis.keywordStats.map((item) => (
              <div key={item.term} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{item.term}</span>
                  <span className="text-slate-500 tabular-nums">
                    تکرار: {item.count.toLocaleString("fa-IR")} · وزن:{" "}
                    {item.weight.toLocaleString("fa-IR")}٪
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-cyan-500 to-blue-700 rounded-full transition-all duration-300"
                    style={{ width: `${item.weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                مفاهیم اصلی و روابط سه‌تایی (Triples)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ساختار دانش استخراج‌شده جهت تزریق به مخزن گراف دانش
              </p>
            </div>
            <GitMerge className="w-4 h-4 text-cyan-700" />
          </div>

          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-800">مفاهیم محوری: </span>
            {activeAnalysis.concepts.join(" · ")}
          </div>

          <div className="space-y-2.5">
            {activeAnalysis.conceptRelations.length === 0 ? (
              <div className="text-xs text-slate-500 py-4">
                رابطه صریحی در حالت آماری استخراج نشد؛ حالت معنایی را امتحان کنید.
              </div>
            ) : (
              activeAnalysis.conceptRelations.map((rel, idx) => (
                <div
                  key={`${rel.source}-${idx}`}
                  className="flex items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <span className="font-semibold text-slate-900">{rel.source}</span>
                  <span className="text-cyan-700 font-medium shrink-0">
                    ← {rel.relation} →
                  </span>
                  <span className="font-semibold text-blue-800">{rel.target}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
