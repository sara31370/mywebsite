import React, { useMemo, useState } from "react";
import { FileText, Search, SlidersHorizontal } from "lucide-react";
import {
  KeywordTfIdfStrategy,
  SemanticConceptStrategy,
} from "../patterns/documindPatterns";
import { EnterpriseDocument } from "../types/documind";

interface SearchViewProps {
  documents: EnterpriseDocument[];
  onSearchExecuted?: (query: string, strategyName: string, hitCount: number) => void;
}

const SAMPLE_QUERIES = [
  "محرمانگی اسناد و کنترل دسترسی",
  "معماری ماژولار و الگوهای هوشمند",
  "توهم هوش مصنوعی در RAG فارسی",
  "مالکیت معنوی قراردادهای برون‌سپاری",
];

export const SearchView: React.FC<SearchViewProps> = ({
  documents,
  onSearchExecuted,
}) => {
  const [query, setQuery] = useState("محرمانگی اسناد و کنترل دسترسی");
  const [retrievalMode, setRetrievalMode] = useState<"semantic" | "keyword">("semantic");

  const activeRetriever = useMemo(
    () =>
      retrievalMode === "keyword"
        ? new KeywordTfIdfStrategy()
        : new SemanticConceptStrategy(),
    [retrievalMode]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return activeRetriever.search(query, documents);
  }, [query, documents, activeRetriever]);

  const handleRunSample = (q: string) => {
    setQuery(q);
    const res = activeRetriever.search(q, documents);
    onSearchExecuted?.(q, activeRetriever.name, res.length);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              موتور جستوجوی هوشمند و لایه بازیابی RAG
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              وضعیت: <strong className="text-emerald-800">پیاده‌سازی‌شده</strong> (تطبیق
              واژگانی و گسترش معنایی فارسی در مرورگر — برای جستوجوی برداری انبوه در تولید
              استقرار Qdrant/pgvector «پیشنهاد معماری» است).
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setRetrievalMode("keyword")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                retrievalMode === "keyword"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              بازیابی واژگانی (TF-IDF)
            </button>
            <button
              type="button"
              onClick={() => setRetrievalMode("semantic")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                retrievalMode === "semantic"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              بازیابی مفهومی و هم‌معنا
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchExecuted?.(query, activeRetriever.name, results.length);
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="کلمه، عبارت یا مفهوم مورد نظر را به فارسی وارد کنید..."
              className="w-full pr-10 pl-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0"
          >
            اجرای جستوجو
          </button>
        </form>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500">پرسش‌های نمونه:</span>
            {SAMPLE_QUERIES.map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => handleRunSample(sq)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-slate-700 transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-700" />
            <span>
              حالت فعال: {retrievalMode === "semantic" ? "مفهومی RAG" : "واژگانی TF-IDF"}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <span>
            تعداد نتایج بازیابی‌شده:{" "}
            <strong className="text-slate-900 tabular-nums">
              {results.length.toLocaleString("fa-IR")}
            </strong>{" "}
            قطعه از اسناد
          </span>
          <span>{activeRetriever.description}</span>
        </div>

        {results.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2">
            <div className="text-sm font-semibold text-slate-800">
              نتیجه‌ای با این عبارت یافت نشد
            </div>
            <div className="text-xs text-slate-500">
              در حالت واژگانی، تغییر به «بازیابی مفهومی و هم‌معنا» می‌تواند قطعات مرتبط را
              بیابد.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 hover:border-cyan-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>{item.documentTitle}</span>
                    </h3>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                      <span className="font-mono">{item.fileName}</span>
                      <span aria-hidden="true">·</span>
                      <span>نوع: {item.fileType}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-cyan-800 tabular-nums">
                        صفحه {item.pageNumber.toLocaleString("fa-IR")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-l from-cyan-500 to-blue-700 rounded-full"
                        style={{ width: `${item.relevanceScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-blue-800 tabular-nums">
                      ارتباط {item.relevanceScore.toLocaleString("fa-IR")}٪
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-3.5">
                  {item.excerpt}
                </p>

                <div className="text-xs text-slate-500">
                  واژگان و مفاهیم منطبق:{" "}
                  <span className="text-slate-800 font-medium">
                    {item.matchedTerms.join(" · ")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
