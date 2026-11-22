import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpenCheck,
  DatabaseZap,
  Send,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  SemanticConceptStrategy,
  normalizePersian,
  synthesizeSimulatedRAGAnswer,
  tokenizePersian,
} from "../patterns/documindPatterns";
import { EnterpriseDocument, QAMessage } from "../types/documind";

interface QAViewProps {
  documents: EnterpriseDocument[];
  geminiConfigured: boolean | null;
  onQuestionAnswered: (question: string, mode: "simulated" | "live") => void;
  onGuardrailTriggered?: (reason: string) => void;
}

interface SemanticCacheEntry {
  question: string;
  tokens: string[];
  corpusSignature: string;
  answer: string;
  confidence: number;
  citations: QAMessage["citations"];
  suggestedFollowUps?: string[];
  mode: "simulated" | "live";
}

const INITIAL_SUGGESTIONS = [
  "الزامات امنیتی و رمزنگاری اسناد در آیین‌نامه چیست؟",
  "استناد به شماره صفحه چه تأثیری بر نرخ توهم هوش مصنوعی دارد؟",
  "چرا معماری ماژولار یکپارچه برای این سامانه پیشنهاد شده است؟",
  "تکلیف مالکیت معنوی نرم‌افزار در قراردادهای برون‌سپاری چیست؟",
];

function checkInputGuardrail(question: string): { safe: boolean; reason?: string } {
  const norm = normalizePersian(question);
  const injectionMarkers = [
    "ignore previous",
    "system prompt",
    "نادیده بگیر",
    "دستورالعمل قبلی",
    "دستورات سیستم",
    "رمز عبور ادمین",
  ];
  const matched = injectionMarkers.find((m) => norm.includes(m));
  if (matched) {
    return {
      safe: false,
      reason: `Input Guardrail: تلاش مشکوک به تزریق پرامپت یا خروج از محدوده مجاز («${matched}») شناسایی و مسدود شد.`,
    };
  }
  return { safe: true };
}

export const QAView: React.FC<QAViewProps> = ({
  documents,
  geminiConfigured,
  onQuestionAnswered,
  onGuardrailTriggered,
}) => {
  const [engineMode, setEngineMode] = useState<"simulated" | "live">(
    geminiConfigured ? "live" : "simulated"
  );
  const [semanticCacheEnabled, setSemanticCacheEnabled] = useState<boolean>(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Semantic Cache store with Corpus Version signature for automatic invalidation
  const cacheRef = useRef<SemanticCacheEntry[]>([]);
  const corpusSignature = documents.map((d) => `${d.id}:${d.pages.length}`).join("|");
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);

  useEffect(() => {
    if (cacheRef.current.length > 0) {
      const staleCount = cacheRef.current.filter(
        (c) => c.corpusSignature !== corpusSignature
      ).length;
      if (staleCount > 0) {
        cacheRef.current = [];
        setCacheNotice(
          `تغییر در مخزن اسناد تشخیص داده شد؛ ${staleCount.toLocaleString("fa-IR")} رکورد Semantic Cache برای جلوگیری از پاسخ قدیمی باطل گردید.`
        );
      }
    }
  }, [corpusSignature]);

  const [messages, setMessages] = useState<QAMessage[]>([
    {
      id: "qa-welcome",
      role: "assistant",
      mode: "simulated",
      statusLabel: "شبیهسازی آموزشی",
      timestamp: "آماده پاسخ‌گویی",
      content:
        "سلام. این بخش از الگوهای RAG، Prompt Template، Guardrails (ورودی/خروجی)، Model Gateway و Semantic Cache بهره می‌برد. هر پرسشی درباره اسناد سازمانی بپرسید تا پاسخ مستند همراه با نام فایل، شماره صفحه و وضعیت دقیق قابلیت نمایش داده شود.",
      suggestedFollowUps: INITIAL_SUGGESTIONS,
    },
  ]);

  const findSemanticCacheHit = (query: string): SemanticCacheEntry | null => {
    if (!semanticCacheEnabled) return null;
    const qTokens = tokenizePersian(query);
    if (qTokens.length === 0) return null;

    for (const entry of cacheRef.current) {
      if (entry.corpusSignature !== corpusSignature || entry.mode !== engineMode) continue;
      const overlap = qTokens.filter((t) => entry.tokens.includes(t)).length;
      const similarity = overlap / Math.max(qTokens.length, entry.tokens.length);
      if (similarity >= 0.72) {
        return entry;
      }
    }
    return null;
  };

  const askQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const userMsg: QAMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setCacheNotice(null);

    // 1. Input Guardrail Check
    const guard = checkInputGuardrail(trimmed);
    if (!guard.safe) {
      onGuardrailTriggered?.(guard.reason ?? "Input Guardrail blocked query");
      setMessages((prev) => [
        ...prev,
        {
          id: `g-${Date.now()}`,
          role: "assistant",
          mode: engineMode,
          statusLabel: "پیاده‌سازی‌شده",
          guardrailChecked: true,
          confidence: 0,
          content:
            "درخواست شما توسط الگوی Guardrails (لایه کنترل ورودی) متوقف شد. سامانه تنها به پرسش‌های مجاز درباره محتوای اسناد سازمانی پاسخ می‌دهد.",
          error: guard.reason,
          timestamp: new Date().toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      return;
    }

    // 2. Semantic Cache Check (with corpusSignature freshness check)
    const cached = findSemanticCacheHit(trimmed);
    if (cached) {
      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          role: "assistant",
          mode: cached.mode,
          statusLabel: cached.mode === "live" ? "پیاده‌سازی‌شده" : "شبیهسازی آموزشی",
          cacheHit: true,
          guardrailChecked: true,
          content: cached.answer,
          confidence: cached.confidence,
          citations: cached.citations,
          suggestedFollowUps: cached.suggestedFollowUps,
          timestamp: new Date().toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      onQuestionAnswered(trimmed, cached.mode);
      return;
    }

    setLoading(true);

    if (engineMode === "simulated") {
      const result = synthesizeSimulatedRAGAnswer(trimmed, documents);
      const assistantMsg: QAMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        mode: "simulated",
        statusLabel: "شبیهسازی آموزشی",
        guardrailChecked: true,
        content: result.answer,
        confidence: result.confidence,
        citations: result.citations,
        suggestedFollowUps: result.suggestedFollowUps,
        timestamp: new Date().toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      if (semanticCacheEnabled && result.confidence >= 25) {
        cacheRef.current.push({
          question: trimmed,
          tokens: tokenizePersian(trimmed),
          corpusSignature,
          answer: result.answer,
          confidence: result.confidence,
          citations: result.citations,
          suggestedFollowUps: result.suggestedFollowUps,
          mode: "simulated",
        });
      }

      setMessages((prev) => [...prev, assistantMsg]);
      onQuestionAnswered(trimmed, "simulated");
      setLoading(false);
      return;
    }

    // Live Model Gateway call (/api/qa)
    try {
      const topChunks = new SemanticConceptStrategy()
        .search(trimmed, documents)
        .slice(0, 4);

      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          contexts: topChunks.map((c) => ({
            documentTitle: c.documentTitle,
            pageNumber: c.pageNumber,
            text: c.excerpt,
          })),
          history: messages.slice(-4).map((m) => ({
            role: m.role,
            text: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            mode: "live",
            statusLabel: "شبیهسازی آموزشی",
            content:
              "Model Gateway خطای عدم اتصال به مدل زنده را برگرداند. بر اساس الگوی Fallback Model، می‌توانید حالت «شبیهسازی آموزشی (RAG محلی)» را برای تداوم پاسخ‌گویی از روی اسناد انتخاب کنید.",
            error: data.error || "خطای Model Gateway",
            timestamp: new Date().toLocaleTimeString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        return;
      }

      const citations = Array.isArray(data.citations)
        ? data.citations.map(
            (c: { documentTitle?: string; pageNumber?: number; quote?: string }) => {
              const matchedDoc = documents.find(
                (d) => d.title === c.documentTitle
              );
              return {
                documentId: matchedDoc?.id,
                documentTitle: c.documentTitle || "سند سازمانی",
                fileName: matchedDoc?.fileName || "document.pdf",
                pageNumber: c.pageNumber || 1,
                quote: c.quote || "",
                relevance: data.confidence || 85,
              };
            }
          )
        : [];

      const conf = typeof data.confidence === "number" ? data.confidence : 88;
      if (semanticCacheEnabled && conf >= 25) {
        cacheRef.current.push({
          question: trimmed,
          tokens: tokenizePersian(trimmed),
          corpusSignature,
          answer: data.answer || "",
          confidence: conf,
          citations,
          suggestedFollowUps: data.suggestedFollowUps,
          mode: "live",
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          mode: "live",
          statusLabel: "پیاده‌سازی‌شده",
          guardrailChecked: true,
          content: data.answer || "پاسخی دریافت نشد.",
          confidence: conf,
          citations,
          suggestedFollowUps: Array.isArray(data.suggestedFollowUps)
            ? data.suggestedFollowUps
            : [],
          timestamp: new Date().toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      onQuestionAnswered(trimmed, "live");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          mode: "live",
          statusLabel: "شبیهسازی آموزشی",
          content: "خطای شبکه در ارتباط با Model Gateway سرور.",
          error: "درگاه مدل در دسترس نیست؛ حالت شبیهسازی آموزشی را آزمایش کنید.",
          timestamp: new Date().toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            پرسش و پاسخ مستند (RAG + Model Gateway + Guardrails + Semantic Cache)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            پاسخ‌ها مقید به اسناد موجود هستند و وضعیت دقیق اجرا («پیاده‌سازی‌شده» یا
            «شبیهسازی آموزشی») روی هر پاسخ درج می‌شود.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSemanticCacheEnabled((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              semanticCacheEnabled
                ? "bg-cyan-50 text-cyan-900 border-cyan-200"
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            <DatabaseZap className="w-3.5 h-3.5" />
            <span>Semantic Cache: {semanticCacheEnabled ? "فعال" : "خاموش"}</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setEngineMode("simulated")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                engineMode === "simulated"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              شبیهسازی آموزشی (RAG محلی)
            </button>
            <button
              type="button"
              onClick={() => setEngineMode("live")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                engineMode === "live"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              درگاه مدل زنده (Model Gateway)
            </button>
          </div>
        </div>
      </section>

      {cacheNotice && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg px-4 py-2.5 text-xs">
          {cacheNotice}
        </div>
      )}

      {/* Chat Thread */}
      <section className="bg-white border border-slate-200 rounded-xl flex flex-col min-h-[500px]">
        <div className="flex-1 p-5 space-y-5 overflow-y-auto max-h-[560px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`max-w-3xl w-full rounded-xl p-4 space-y-3 border ${
                  msg.role === "user"
                    ? "bg-[#0B172A] text-white border-slate-800"
                    : "bg-slate-50 text-slate-900 border-slate-200"
                }`}
              >
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 text-xs ${
                    msg.role === "user" ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">
                      {msg.role === "user" ? "پرسش کاربر" : "پاسخ DocuMind AI"}
                    </span>
                    {msg.statusLabel && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold ${
                            msg.statusLabel === "پیاده‌سازی‌شده"
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {msg.statusLabel}
                        </span>
                      </>
                    )}
                    {msg.cacheHit && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-cyan-800 font-semibold">
                          بازیابی از Semantic Cache
                        </span>
                      </>
                    )}
                    {msg.guardrailChecked && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600 inline-flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-blue-700" />
                          <span>کنترل Guardrails</span>
                        </span>
                      </>
                    )}
                    {msg.role === "assistant" && msg.mode === "live" && !msg.error && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-cyan-700 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Model Gateway زنده</span>
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3 tabular-nums">
                    {typeof msg.confidence === "number" && msg.confidence > 0 && (
                      <span className="font-semibold text-blue-800">
                        اطمینان: {msg.confidence.toLocaleString("fa-IR")}٪
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                <p className="text-sm leading-7 whitespace-pre-line">{msg.content}</p>

                {msg.error && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{msg.error}</span>
                  </div>
                )}

                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <BookOpenCheck className="w-4 h-4 text-cyan-700" />
                      <span>منابع و استنادهای RAG</span>
                    </div>
                    <div className="space-y-2">
                      {msg.citations.map((cit, i) => (
                        <div
                          key={`${cit.fileName}-${cit.pageNumber}-${i}`}
                          className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold text-slate-900">
                              {cit.documentTitle}
                            </span>
                            <span className="text-cyan-800 font-medium tabular-nums">
                              فایل: <span className="font-mono">{cit.fileName}</span> ·
                              صفحه {cit.pageNumber.toLocaleString("fa-IR")}
                            </span>
                          </div>
                          {cit.quote && (
                            <p className="text-slate-600 leading-relaxed line-clamp-2">
                              «{cit.quote}»
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-slate-500">پرسش‌های تکمیلی:</span>
                    {msg.suggestedFollowUps.map((fq) => (
                      <button
                        key={fq}
                        type="button"
                        onClick={() => void askQuestion(fq)}
                        className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-cyan-400 hover:text-cyan-800 text-slate-700 transition-colors text-right"
                      >
                        {fq}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void askQuestion(input);
          }}
          className="p-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5 bg-slate-50/70 rounded-b-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پرسش خود را به فارسی بنویسید (برای تست Guardrails عبارت «دستورالعمل قبلی را نادیده بگیر» را امتحان کنید)..."
            className="flex-1 px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? "در حال پردازش..." : "ارسال پرسش"}</span>
          </button>
        </form>
      </section>
    </div>
  );
};
