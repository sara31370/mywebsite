import React, { useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import {
  QUALITY_ATTRIBUTES_DATA,
  RISK_ASSESSMENT_DATA,
} from "../data/academicData";

export const RiskQualityView: React.FC = () => {
  const [activeQualityId, setActiveQualityId] = useState<string>(
    QUALITY_ATTRIBUTES_DATA[0].id
  );

  const selectedQuality =
    QUALITY_ATTRIBUTES_DATA.find((q) => q.id === activeQualityId) ??
    QUALITY_ATTRIBUTES_DATA[0];

  return (
    <div className="space-y-6">
      {/* Risk Assessment Section */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              ارزیابی ریسک‌های کلیدی سامانه و راهکارهای مهندسی مقابله
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              شناسایی مخاطرات فنی، امنیتی و شناختی در سامانه‌های تحلیل اسناد مبتنی بر هوش مصنوعی و
              اقدامات کنترلی مرتبط با الگوهای طراحی.
            </p>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {RISK_ASSESSMENT_DATA.map((risk) => (
            <article
              key={risk.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-900 text-sm">{risk.title}</span>
                <span
                  className={`font-semibold ${
                    risk.severity === "بحرانی" ? "text-red-700" : "text-amber-700"
                  }`}
                >
                  شدت: {risk.severity} · احتمال: {risk.likelihood}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{risk.description}</p>
              <div className="text-xs text-slate-600">
                <strong className="text-slate-800">اثر بر سازمان: </strong>
                {risk.impact}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <div className="text-xs font-bold text-blue-900">راهکارهای مقابله:</div>
                <ul className="space-y-1 text-xs text-slate-700">
                  {risk.mitigation.map((m) => (
                    <li key={m}>· {m}</li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] font-medium text-cyan-800 pt-1">
                ارتباط با الگوها: {risk.patternLink}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Software Quality Attributes (ISO/IEC 25010) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-700" />
              <span>ارزیابی ویژگی‌های کیفی نرم‌افزار (استاندارد ISO/IEC 25010)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              هر یک از پنج ویژگی کیفی کلیدی سامانه را انتخاب کنید تا سنجه هدف و تدابیر معماری آن
              نمایش داده شود.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {QUALITY_ATTRIBUTES_DATA.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setActiveQualityId(q.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeQualityId === q.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {q.nameFa}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="text-base font-bold text-slate-900">
                {selectedQuality.nameFa} ({selectedQuality.nameEn})
              </div>
              <div className="text-xs font-mono text-slate-500">
                {selectedQuality.isoCategory}
              </div>
            </div>
            <div className="text-xs font-semibold text-cyan-800 tabular-nums">
              سنجه هدف: {selectedQuality.targetMetric}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">
              تدابیر مهندسی و پیاده‌سازی‌شده در معماری:
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {selectedQuality.engineeringMeasures.map((em) => (
                <li
                  key={em}
                  className="bg-white border border-slate-200 rounded-lg px-3.5 py-2.5"
                >
                  {em}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
