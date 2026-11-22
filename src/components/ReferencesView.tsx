import React from "react";
import { BookOpen, Info, Layers } from "lucide-react";
import { ACADEMIC_REFERENCES } from "../data/academicData";
import { CapabilityStatusLabel } from "../types/documind";

interface TransparencyRow {
  feature: string;
  patternOrModule: string;
  status: CapabilityStatusLabel;
  details: string;
}

const CAPABILITY_STATUS_ROWS: TransparencyRow[] = [
  {
    feature: "پرسش‌وپاسخ زنده از طریق درگاه سرور",
    patternOrModule: "Model Gateway + Prompt Template + Structured Output",
    status: "پیاده‌سازی‌شده",
    details:
      "در مسیرهای /api/qa و /api/analyze سرور Express با استفاده از @google/genai و responseSchema پیاده‌سازی شده است (در صورت تنظیم GEMINI_API_KEY در محیط سرور اجرا می‌شود).",
  },
  {
    feature: "پاسخ‌گویی RAG محلی مبتنی بر قطعات واقعی اسناد",
    patternOrModule: "RAG + Guardrails + Semantic Cache",
    status: "شبیهسازی آموزشی",
    details:
      "بازیابی صفحات و امتیازدهی واقعی است، اما در نبود کلید یا انتخاب حالت محلی، سنتز پاسخ به جای LLM ابری توسط ترکیب‌گر قاعده‌محور محلی انجام می‌شود و صریحاً برچسب می‌خورد.",
  },
  {
    feature: "کنترل تزریق پرامپت و آستانه اطمینان",
    patternOrModule: "Guardrails (Input & Output)",
    status: "پیاده‌سازی‌شده",
    details:
      "بررسی ورودی‌های Prompt Injection پیش از ارسال پرسش و اعمال آستانه اطمینان ۲۵٪ در خروجی برای جلوگیری از پاسخ‌های بی‌مبنا در کد فعال است.",
  },
  {
    feature: "حافظه نهان معنایی و ابطال هنگام تغییر اسناد",
    patternOrModule: "Semantic Cache",
    status: "پیاده‌سازی‌شده",
    details:
      "کش نشست پرسش‌ها همراه با نسخه مخزن اسناد نگهداری می‌شود و با افزودن یا حذف سند به‌طور خودکار باطل (Invalidate) می‌گردد.",
  },
  {
    feature: "مسیر مدل جایگزین در خطا",
    patternOrModule: "Fallback Model",
    status: "شبیهسازی آموزشی",
    details:
      "زنجیره خطا و هدایت به مسیر جایگزین در سطح آزمایشگاه و راهنمای کاربری شبیه‌سازی می‌شود؛ در محیط تولید به چند Endpoint واقعی مدل متصل می‌گردد.",
  },
  {
    feature: "بازبینی و تأیید انسانی اسناد حساس",
    patternOrModule: "Human-in-the-Loop (HITL)",
    status: "شبیهسازی آموزشی",
    details:
      "صف علامت‌گذاری و تأیید/بازبینی اسناد حساس حقوقی و امنیتی در نشست مرورگر شبیه‌سازی شده و نیازمند نقش‌های کاربری سرور در تولید است.",
  },
  {
    feature: "پردازش باینری فایل‌های PDF و Word",
    patternOrModule: "Document Processing (شبیه‌سازی مبدل)",
    status: "شبیهسازی آموزشی",
    details:
      "فایل‌های .txt/.md به‌صورت واقعی خوانده می‌شوند؛ اما برای فایل‌های فشرده باینری PDF و Word در نبود مبدل سرور (Apache Tika / pdfplumber)، متن نمونه جایگزین می‌شود.",
  },
  {
    feature: "برنامه‌ریزی عامل‌محور چندگامی",
    patternOrModule: "Agentic Planning and Execution",
    status: "پیشنهاد معماری",
    details:
      "به دلیل هزینه و تأخیر بالا در پرسش‌های تک‌مرحله‌ای، به‌عنوان پیشنهاد معماری برای تحلیل‌های مقایسه‌ای چندسندی در فاز توسعه آتی طراحی و تحلیل شده است.",
  },
  {
    feature: "جستوجوی برداری انبوه و گراف Neo4j",
    patternOrModule: "Vector DB + Graph Database",
    status: "پیشنهاد معماری",
    details:
      "در نمونه فعلی از گراف SVG درون‌مرورگری و موتور تطبیق مفهومی استفاده شده؛ در تولید استقرار Qdrant/pgvector و Neo4j پیشنهاد می‌شود.",
  },
];

const BADGE_CLASS: Record<CapabilityStatusLabel, string> = {
  "پیاده‌سازی‌شده": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "شبیهسازی آموزشی": "bg-amber-50 text-amber-800 border-amber-200",
  "پیشنهاد معماری": "bg-blue-50 text-blue-800 border-blue-200",
};

export const ReferencesView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Scientific Note about Handout 8 vs 9 discrepancy */}
      <section className="bg-[#0B172A] text-slate-100 rounded-xl p-6 space-y-2.5">
        <div className="flex items-center gap-2 text-cyan-300 text-sm font-bold">
          <Info className="w-5 h-5 shrink-0" />
          <span>یادداشت علمی و ملاحظه آموزشی درباره تعداد الگوها در جزوه درس</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-7">
          در بخش «هدف فصل» جزوه دوم درس الگوهای طراحی نرم‌افزارهای مبتنی بر هوش مصنوعی، به
          عنوان کلی <strong className="text-white">هشت الگو</strong> اشاره شده است؛ اما در فهرست
          تفصیلی ارائه‌شده در جزوه، <strong className="text-cyan-300">۹ عنوان مستقل</strong>{" "}
          (۴ الگوی گروه قابلیت اطمینان و کنترل خروجی + ۵ الگوی گروه مدیریت مدل و دانش) آمده است.
          در این وبسایت و آزمایشگاه طراحی، هر <strong className="text-white">۹ عنوان فهرست‌شده</strong>{" "}
          به‌طور کامل پوشش داده شده و تحلیل شده‌اند.
        </p>
      </section>

      {/* Strict 3-Label Capability Status Matrix */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-700" />
          <h2 className="text-lg font-bold text-slate-900">
            ماتریس وضعیت قابلیت‌های سامانه (پیاده‌سازی‌شده / شبیهسازی آموزشی / پیشنهاد معماری)
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          هیچ قابلیت شبیه‌سازی‌شده‌ای به‌عنوان هوش مصنوعی واقعی معرفی نشده است. وضعیت هر بخش
          منحصراً با یکی از سه برچسب رسمی زیر مشخص شده است:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse min-w-[740px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 px-3 font-semibold">قابلیت / بخش سامانه</th>
                <th className="py-3 px-3 font-semibold">الگوی مرتبط</th>
                <th className="py-3 px-3 font-semibold">وضعیت رسمی</th>
                <th className="py-3 px-3 font-semibold">توضیح فنی و حدود اجرا</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CAPABILITY_STATUS_ROWS.map((row) => (
                <tr key={row.feature} className="align-top hover:bg-slate-50/70">
                  <td className="py-3.5 px-3 font-bold text-slate-900 w-52">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-blue-800 w-48">
                    {row.patternOrModule}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded border text-[11px] font-semibold ${
                        BADGE_CLASS[row.status]
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 leading-relaxed">
                    {row.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Academic References */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <h2 className="text-lg font-bold text-slate-900">
            منابع علمی و مراجع جزوه الگوهای طراحی هوش مصنوعی
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {ACADEMIC_REFERENCES.map((ref, idx) => (
            <div key={ref.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-sm font-bold text-slate-900">
                  <span className="text-cyan-700 tabular-nums ml-2">
                    [{(idx + 1).toLocaleString("fa-IR")}]
                  </span>
                  <span className="inline-block">
                    {ref.authors} ({ref.year}). {ref.title}.
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{ref.publisher}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{ref.relevance}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
