import React, { useState } from "react";
import { AlertOctagon, CheckCircle2, Play, RotateCcw } from "lucide-react";
import {
  DeepRelationExtractionStrategy,
  DocumentProcessorFactory,
  synthesizeSimulatedRAGAnswer,
} from "../patterns/documindPatterns";
import { EnterpriseDocument } from "../types/documind";

interface ScenarioResult {
  title: string;
  outcome: "success" | "failure";
  statusLabel: "پیاده‌سازی‌شده" | "شبیهسازی آموزشی";
  steps: { label: string; detail: string; status: "ok" | "error" }[];
  systemReaction: string;
  recoveryStrategy: string;
}

export const SuccessFailureView: React.FC<{
  documents: EnterpriseDocument[];
}> = ({ documents }) => {
  const [selectedScenario, setSelectedScenario] = useState<
    "success" | "invalid-format" | "empty-ocr" | "insufficient-evidence"
  >("success");
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const runScenario = (
    kind: "success" | "invalid-format" | "empty-ocr" | "insufficient-evidence"
  ) => {
    setSelectedScenario(kind);

    if (kind === "success") {
      const analyzer = new DeepRelationExtractionStrategy();
      const pages = [
        {
          pageNumber: 1,
          content:
            "مطابق گزارش ممیزی امنیت اطلاعات ۱۴۰۴، استفاده از رمزنگاری AES-256 و کنترل دسترسی RBAC در سامانه تحلیل اسناد الزامی است.",
        },
      ];
      const analysis = analyzer.analyze("گزارش ممیزی امنیت ۱۴۰۴", pages);
      const qa = synthesizeSimulatedRAGAnswer(
        "الزامات رمزنگاری در آیین‌نامه امنیت اطلاعات چیست؟",
        documents
      );

      setResult({
        title: "سناریوی موفق: خط لوله RAG + Structured Output + Guardrails",
        outcome: "success",
        statusLabel: "شبیهسازی آموزشی",
        steps: [
          {
            label: "۱. دریافت و قطعه‌بندی سند (RAG Chunking)",
            detail: `متن صفحه ۱ نرمال‌سازی شد و با حفظ شماره صفحه وارد مخزن بازیابی گردید.`,
            status: "ok",
          },
          {
            label: "۲. استخراج دانش ساختاریافته (Structured Output)",
            detail: `خروجی JSON شامل موضوع، کلمات کلیدی (${analysis.keywords
              .slice(0, 3)
              .join("، ")}) و روابط مفهومی تولید شد.`,
            status: "ok",
          },
          {
            label: "۳. بازیابی RAG، قالب Prompt Template و Output Guardrail",
            detail: `پاسخ مستند با اطمینان ${qa.confidence.toLocaleString("fa-IR")}٪ همراه با استناد به «${
              qa.citations[0]?.documentTitle ?? "سند مرجع"
            }» (صفحه ${qa.citations[0]?.pageNumber ?? 1}) تأیید و در Semantic Cache ذخیره شد.`,
            status: "ok",
          },
        ],
        systemReaction:
          "سند با وضعیت «تحلیل‌شده» در مخزن دانش ثبت شد و پاسخ مستند پس از عبور موفق از Guardrails به کاربر نمایش داده شد.",
        recoveryStrategy:
          "در جریان عادی، نسخه مخزن اسناد برای حفظ تازگی Semantic Cache به‌روزرسانی می‌شود.",
      });
      return;
    }

    if (kind === "invalid-format") {
      let caughtError = "";
      try {
        DocumentProcessorFactory.forFileName("malware-payload.exe");
      } catch (e: unknown) {
        caughtError = e instanceof Error ? e.message : "خطای فرمت نامعتبر";
      }
      setResult({
        title: "سناریوی شکست ۱: بارگذاری فایل نامعتبر (.exe) و توقف در لایه ورودی",
        outcome: "failure",
        statusLabel: "پیاده‌سازی‌شده",
        steps: [
          {
            label: "۱. دریافت درخواست بارگذاری",
            detail: "کاربر فایلی با نام malware-payload.exe انتخاب کرد.",
            status: "ok",
          },
          {
            label: "۲. مسدودسازی توسط Input Guardrail / اعتبارسنجی فایل",
            detail: caughtError,
            status: "error",
          },
          {
            label: "۳. حفاظت از مخزن RAG و گراف دانش",
            detail: "فرایند متوقف شد و هیچ داده‌ای به Model Gateway یا شاخص RAG وارد نگردید.",
            status: "error",
          },
        ],
        systemReaction:
          "سامانه پیش از خواندن محتوای باینری، خطای UNSUPPORTED_FORMAT را برمی‌گرداند و پیام راهنمای فارسی به کاربر نمایش می‌دهد.",
        recoveryStrategy:
          "اعتبارسنجی دو مرحله‌ای (پسوند + Magic Bytes فایل در سرور) و هدایت کاربر به انتخاب فایل‌های مجاز PDF، Word یا متنی.",
      });
      return;
    }

    if (kind === "empty-ocr") {
      setResult({
        title: "سناریوی شکست ۲: خطای استخراج متن و ارجاع به Human-in-the-Loop",
        outcome: "failure",
        statusLabel: "شبیهسازی آموزشی",
        steps: [
          {
            label: "۱. دریافت سند PDF اسکن‌شده",
            detail: "فایل فاقد لایه متن دیجیتال (Scanned Image PDF) است.",
            status: "ok",
          },
          {
            label: "۲. تشخیص خروجی خالی پیش از Structured Output",
            detail:
              "EXTRACTION_EMPTY_TEXT: متن قابل خواندنی یافت نشد؛ ارسال مستقیم به مدل متوقف شد.",
            status: "error",
          },
          {
            label: "۳. علامت‌گذاری خطا و فعال‌سازی Human-in-the-Loop",
            detail: "سند از شاخص RAG کنار گذاشته شد تا از توهم روی متن خالی جلوگیری شود.",
            status: "error",
          },
        ],
        systemReaction:
          "از ایجاد گره‌های توخالی در گراف دانش جلوگیری شده و هشدار نیاز به OCR و بررسی انسانی نمایش داده می‌شود.",
        recoveryStrategy:
          "ارجاع خودکار فایل به صف OCR تخصصی و سپس بازبینی کارشناس انسانی (HITL) پیش از انتشار در مخزن دانش.",
      });
      return;
    }

    // insufficient-evidence
    const emptyQa = synthesizeSimulatedRAGAnswer(
      "قیمت سهام بورس توکیو در سال ۱۹۹۸ چقدر بوده است؟",
      documents
    );
    setResult({
      title: "سناریوی شکست ۳: نبود اطلاعات کافی در RAG و مسدودسازی توسط Output Guardrail",
      outcome: "failure",
      statusLabel: "پیاده‌سازی‌شده",
      steps: [
        {
          label: "۱. دریافت پرسش خارج از دامنه اسناد",
          detail: "پرسش: «قیمت سهام بورس توکیو در سال ۱۹۹۸ چقدر بوده است؟»",
          status: "ok",
        },
        {
          label: "۲. بازیابی در RAG و ارزیابی Output Guardrail",
          detail: `امتیاز ارتباط به دست آمده: ${emptyQa.confidence.toLocaleString("fa-IR")}٪ (پایین‌تر از آستانه مجاز ۲۵٪).`,
          status: "error",
        },
        {
          label: "۳. جلوگیری از توهم هوش مصنوعی",
          detail: emptyQa.answer,
          status: "error",
        },
      ],
      systemReaction:
        "Output Guardrail اجازه تولید پاسخ از دانش عمومی مدل را نمی‌دهد، عدم کفایت مدارک را گزارش می‌کند و پاسخ در Semantic Cache ذخیره نمی‌شود.",
      recoveryStrategy:
        "پیشنهاد پرسش‌های مرتبط با اسناد موجود و درخواست بارگذاری سند مرجع جدید.",
    });
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            شبیه‌ساز تعاملی سناریوهای موفقیت و شکست الگوهای AI
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            واکنش الگوهای RAG، Structured Output، Guardrails و Human-in-the-Loop را در شرایط
            موفقیت و شکست آزمایش کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => runScenario("success")}
            className={`p-4 rounded-xl border text-right space-y-1.5 transition-colors ${
              selectedScenario === "success" && result
                ? "bg-cyan-50 border-cyan-500"
                : "bg-slate-50 border-slate-200 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>سناریوی موفق</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-900">
              RAG + Structured Output + Guardrails
            </div>
            <div className="text-[11px] text-slate-500">شبیهسازی آموزشی</div>
          </button>

          <button
            type="button"
            onClick={() => runScenario("invalid-format")}
            className={`p-4 rounded-xl border text-right space-y-1.5 transition-colors ${
              selectedScenario === "invalid-format" && result
                ? "bg-red-50 border-red-400"
                : "bg-slate-50 border-slate-200 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-red-700">
              <span>سناریوی شکست ۱</span>
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-900">
              بارگذاری فایل نامعتبر (.exe)
            </div>
            <div className="text-[11px] text-slate-500">پیاده‌سازی‌شده</div>
          </button>

          <button
            type="button"
            onClick={() => runScenario("empty-ocr")}
            className={`p-4 rounded-xl border text-right space-y-1.5 transition-colors ${
              selectedScenario === "empty-ocr" && result
                ? "bg-red-50 border-red-400"
                : "bg-slate-50 border-slate-200 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-700">
              <span>سناریوی شکست ۲</span>
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-900">
              خطای استخراج متن و ارجاع HITL
            </div>
            <div className="text-[11px] text-slate-500">شبیهسازی آموزشی</div>
          </button>

          <button
            type="button"
            onClick={() => runScenario("insufficient-evidence")}
            className={`p-4 rounded-xl border text-right space-y-1.5 transition-colors ${
              selectedScenario === "insufficient-evidence" && result
                ? "bg-red-50 border-red-400"
                : "bg-slate-50 border-slate-200 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-700">
              <span>سناریوی شکست ۳</span>
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-900">
              کنترل توهم توسط Output Guardrail
            </div>
            <div className="text-[11px] text-slate-500">پیاده‌سازی‌شده</div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => runScenario(selectedScenario)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-xs font-medium transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-cyan-300" />
            <span>اجرای سناریوی انتخاب‌شده</span>
          </button>
          {result && (
            <button
              type="button"
              onClick={() => setResult(null)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>پاک‌کردن خروجی</span>
            </button>
          )}
        </div>
      </section>

      {result && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">{result.title}</h3>
            <span
              className={`text-xs font-bold ${
                result.outcome === "success" ? "text-emerald-700" : "text-red-700"
              }`}
            >
              وضعیت: {result.statusLabel} ·{" "}
              {result.outcome === "success"
                ? "تکمیل موفق خط لوله"
                : "مدیریت خطای کنترل‌شده"}
            </span>
          </div>

          <div className="space-y-3">
            {result.steps.map((st) => (
              <div
                key={st.label}
                className={`p-4 rounded-lg border text-xs space-y-1 ${
                  st.status === "ok"
                    ? "bg-slate-50 border-slate-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="font-bold text-slate-900">{st.label}</div>
                <div className="text-slate-700 leading-relaxed">{st.detail}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
              <div className="text-xs font-bold text-slate-900">واکنش سامانه</div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {result.systemReaction}
              </p>
            </div>
            <div className="bg-cyan-50/60 border border-cyan-200 rounded-lg p-4 space-y-1">
              <div className="text-xs font-bold text-cyan-900">
                راهکار مدیریت خطا و بازیابی
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {result.recoveryStrategy}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
