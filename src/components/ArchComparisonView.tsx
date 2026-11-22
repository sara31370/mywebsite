import React, { useState } from "react";
import { Award, Scale } from "lucide-react";
import { ARCHITECTURE_COMPARISON } from "../data/academicData";

export const ArchComparisonView: React.FC = () => {
  const [selectedArch, setSelectedArch] = useState<
    "all" | "monolithic" | "modularMonolith" | "microservices"
  >("all");

  const avg = (key: "monolithic" | "modularMonolith" | "microservices") =>
    Math.round(
      ARCHITECTURE_COMPARISON.reduce((acc, row) => acc + row[key].score, 0) /
        ARCHITECTURE_COMPARISON.length
    );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              مقایسه معماری‌های نرم‌افزاری و انتخاب گزینه بهینه
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              بررسی علمی سه رویکرد یکپارچه (Monolithic)، ماژولار یکپارچه (Modular Monolith) و
              مبتنی بر سرویس‌ها (Microservices) بر اساس ۶ معیار مهندسی نرم‌افزار.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            {(
              [
                ["all", "مقایسه هر سه"],
                ["monolithic", "Monolithic"],
                ["modularMonolith", "Modular Monolith"],
                ["microservices", "Microservices"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSelectedArch(k)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedArch === k
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Score Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-500">معماری یکپارچه کلاسیک (Monolithic)</div>
            <div className="text-2xl font-bold text-slate-800 mt-1 tabular-nums">
              {avg("monolithic").toLocaleString("fa-IR")} از ۱۰۰
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              ساده در شروع، ضعیف در مقیاس‌پذیری و نگهداری بلندمدت
            </div>
          </div>

          <div className="bg-cyan-50/70 border border-cyan-300 rounded-lg p-4">
            <div className="text-xs text-cyan-800 font-semibold">
              معماری ماژولار یکپارچه (انتخاب پیشنهادی)
            </div>
            <div className="text-2xl font-bold text-cyan-950 mt-1 tabular-nums">
              {avg("modularMonolith").toLocaleString("fa-IR")} از ۱۰۰
            </div>
            <div className="text-[11px] text-cyan-800 mt-0.5">
              بهترین توازن میان سادگی استقرار، کارایی و توسعه‌پذیری
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-500">معماری میکروسرویس (Microservices)</div>
            <div className="text-2xl font-bold text-slate-800 mt-1 tabular-nums">
              {avg("microservices").toLocaleString("fa-IR")} از ۱۰۰
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              مقیاس‌پذیری بالا ولی هزینه زیرساخت و پیچیدگی عملیاتی زیاد
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Comparison Matrix */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 overflow-x-auto">
        <table className="w-full text-right text-sm border-collapse min-w-[740px]">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-500">
              <th className="py-3 px-3 font-semibold">معیار ارزیابی</th>
              {(selectedArch === "all" || selectedArch === "monolithic") && (
                <th className="py-3 px-3 font-semibold">معماری یکپارچه (Monolithic)</th>
              )}
              {(selectedArch === "all" || selectedArch === "modularMonolith") && (
                <th className="py-3 px-3 font-semibold text-cyan-800">
                  ماژولار یکپارچه (Modular Monolith)
                </th>
              )}
              {(selectedArch === "all" || selectedArch === "microservices") && (
                <th className="py-3 px-3 font-semibold">میکروسرویس‌ها (Microservices)</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ARCHITECTURE_COMPARISON.map((row) => (
              <tr key={row.criterion} className="align-top hover:bg-slate-50/70">
                <td className="py-4 px-3 font-semibold text-slate-900 text-xs w-56">
                  {row.criterion}
                </td>
                {(selectedArch === "all" || selectedArch === "monolithic") && (
                  <td className="py-4 px-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-500 rounded-full"
                          style={{ width: `${row.monolithic.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 tabular-nums">
                        {row.monolithic.score.toLocaleString("fa-IR")}٪
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {row.monolithic.summary}
                    </p>
                  </td>
                )}
                {(selectedArch === "all" || selectedArch === "modularMonolith") && (
                  <td className="py-4 px-3 space-y-1.5 bg-cyan-50/25">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-cyan-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-600 rounded-full"
                          style={{ width: `${row.modularMonolith.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-cyan-800 tabular-nums">
                        {row.modularMonolith.score.toLocaleString("fa-IR")}٪
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {row.modularMonolith.summary}
                    </p>
                  </td>
                )}
                {(selectedArch === "all" || selectedArch === "microservices") && (
                  <td className="py-4 px-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-700 rounded-full"
                          style={{ width: `${row.microservices.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-blue-800 tabular-nums">
                        {row.microservices.score.toLocaleString("fa-IR")}٪
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {row.microservices.summary}
                    </p>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Scientific Selection Argument */}
      <section className="bg-[#0B172A] text-slate-100 rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 text-sm font-bold">
          <Award className="w-5 h-5" />
          <span>جمع‌بندی و استدلال علمی انتخاب معماری مناسب‌تر برای DocuMind AI</span>
        </div>
        <p className="text-sm text-slate-200 leading-7">
          با استناد به الگوی <strong className="text-white">MonolithFirst</strong> مارتین فاولر
          و معیارهای هزینه-فایده سام نیومن، انتخاب معماری{" "}
          <strong className="text-cyan-300">
            Modular Monolith (یکپارچه ماژولار همراه با کارگر ناهمگام برای OCR/تحلیل سنگین)
          </strong>{" "}
          منطقی‌ترین تصمیم مهندسی برای مسئله شماره ۷ است. این رویکرد در فاز نخست از پیچیدگی
          کاذب شبکه، تراکنش‌های توزیع‌شده و هزینه سنگین DevOps میکروسرویس‌ها پرهیز می‌کند و در
          عین حال به کمک الگوهای هسته هوش مصنوعی شامل{" "}
          <span className="font-mono text-cyan-300">RAG</span>،{" "}
          <span className="font-mono text-cyan-300">Model Gateway</span>،{" "}
          <span className="font-mono text-cyan-300">Structured Output</span> و{" "}
          <span className="font-mono text-cyan-300">Guardrails</span> مرزهای لایه ارائه، بازیابی،
          درگاه مدل و مخزن دانش را کاملاً ایزوله نگه می‌دارد؛ به طوری که در صورت رشد حجم اسناد
          سازمانی، سرویس بازیابی برداری و درگاه مدل به‌سادگی قابل استخراج به میکروسرویس‌های مستقل
          خواهند بود.
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>
            توصیه گذار آینده: جداسازی سرویس Python NLP Worker برای OCR/Embedding هنگام عبور حجم
            اسناد از ۱۰۰ هزار فایل.
          </span>
        </div>
      </section>
    </div>
  );
};
