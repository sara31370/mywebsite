import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Upload } from "lucide-react";
import { INITIAL_ACTIVITIES, INITIAL_DOCUMENTS } from "./data/corpusData";
import { DocumentEventBus } from "./patterns/documindPatterns";
import {
  DocCategory,
  EnterpriseDocument,
  NavSectionId,
  ObserverEvent,
  SystemActivityItem,
} from "./types/documind";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { DocumentsView } from "./components/DocumentsView";
import { AnalysisView } from "./components/AnalysisView";
import { SearchView } from "./components/SearchView";
import { QAView } from "./components/QAView";
import { KnowledgeGraphView } from "./components/KnowledgeGraphView";
import { ArchitectureView } from "./components/ArchitectureView";
import { DesignPatternsView } from "./components/DesignPatternsView";
import { PatternInteractionsView } from "./components/PatternInteractionsView";
import { ScenarioFlowView } from "./components/ScenarioFlowView";
import { ArchComparisonView } from "./components/ArchComparisonView";
import { RiskQualityView } from "./components/RiskQualityView";
import { SuccessFailureView } from "./components/SuccessFailureView";
import { ReferencesView } from "./components/ReferencesView";

const SECTION_TITLES: Record<NavSectionId, string> = {
  dashboard: "داشبورد و معرفی سامانه",
  documents: "مدیریت اسناد سازمانی",
  analysis: "تحلیل هوشمند (Structured Output)",
  search: "جستوجوی هوشمند (RAG Retriever)",
  qa: "پرسش و پاسخ مستند",
  "knowledge-graph": "استخراج دانش و گراف ارتباطات",
  "design-patterns": "آزمایشگاه ۹ الگوی طراحی AI",
  "pattern-interactions": "تحلیل تعامل میان الگوهای طراحی AI",
  architecture: "معماری نرم‌افزاری سامانه",
  "execution-scenario": "سناریوی اجرای گام‌به‌گام",
  "arch-comparison": "مقایسه معماری‌ها",
  "risk-quality": "ارزیابی ریسک و کیفیت نرم‌افزار",
  "success-failure": "سناریوهای موفقیت و شکست",
  references: "منابع علمی، یادداشت جزوه و وضعیت قابلیت‌ها",
};

const STORAGE_KEYS = {
  docs: "documind_documents_v1",
  qaCount: "documind_qa_count_v1",
  activities: "documind_activities_v1",
  events: "documind_observer_events_v1",
};

function loadSaved<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [documents, setDocuments] = useState<EnterpriseDocument[]>(() =>
    loadSaved(STORAGE_KEYS.docs, INITIAL_DOCUMENTS)
  );
  const [answeredQuestionsCount, setAnsweredQuestionsCount] = useState<number>(() =>
    loadSaved(STORAGE_KEYS.qaCount, 31)
  );
  const [activities, setActivities] = useState<SystemActivityItem[]>(() =>
    loadSaved(STORAGE_KEYS.activities, INITIAL_ACTIVITIES)
  );
  const [selectedAnalysisDocId, setSelectedAnalysisDocId] = useState<string | null>(
    INITIAL_DOCUMENTS[0]?.id ?? null
  );
  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);

  const [observerEvents, setObserverEvents] = useState<ObserverEvent[]>(() =>
    loadSaved(STORAGE_KEYS.events, [
      {
        id: "evt-init-1",
        eventType: "DOCUMENT_ANALYZED",
        timestamp: "۱۰:۱۵:۰۰",
        payloadSummary: "پیکره اولیه ۶ سند سازمانی تحلیل و برای بازیابی RAG آماده شد.",
        notifiedObservers: ["RAGIndex", "KnowledgeGraph", "SemanticCache"],
      },
    ])
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.docs, JSON.stringify(documents));
      window.localStorage.setItem(
        STORAGE_KEYS.qaCount,
        JSON.stringify(answeredQuestionsCount)
      );
      window.localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
      window.localStorage.setItem(
        STORAGE_KEYS.events,
        JSON.stringify(observerEvents)
      );
    } catch {
      // Ignore quota errors
    }
  }, [documents, answeredQuestionsCount, activities, observerEvents]);

  const eventBus = useMemo(() => new DocumentEventBus(), []);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const unsub = eventBus.subscribe("AuditTrail", (evt) => {
      setObserverEvents((prev) => [evt, ...prev].slice(0, 20));
    });
    return () => {
      unsub();
    };
  }, [eventBus]);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => {
        setGeminiConfigured(Boolean(data?.geminiConfigured));
      })
      .catch(() => {
        setGeminiConfigured(false);
      });
  }, []);

  const pushActivity = (
    user: string,
    action: string,
    target: string,
    category: SystemActivityItem["category"]
  ) => {
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user,
        action,
        target,
        timestamp: "هم‌اکنون",
        category,
      },
      ...prev.slice(0, 14),
    ]);
  };

  const handleAddDocument = (newDoc: EnterpriseDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedAnalysisDocId(newDoc.id);
    eventBus.notify(
      "CACHE_INVALIDATED",
      `سند «${newDoc.title}» ثبت شد و Semantic Cache برای حفظ تازگی داده‌ها باطل گردید.`
    );
    pushActivity("کاربر پژوهشگر", "بارگذاری و تحلیل سند", newDoc.title, "upload");
  };

  const handleDeleteDocument = (docId: string) => {
    const target = documents.find((d) => d.id === docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    if (target) {
      eventBus.notify(
        "CACHE_INVALIDATED",
        `سند «${target.title}» حذف شد و کش معنایی و گراف دانش به‌روزرسانی شدند.`
      );
      pushActivity("کاربر پژوهشگر", "حذف سند از مخزن", target.title, "system");
    }
  };

  const handleUpdateCategory = (docId: string, category: DocCategory) => {
    const target = documents.find((d) => d.id === docId);
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, category } : d))
    );
    if (target) {
      eventBus.notify(
        "CATEGORY_UPDATED",
        `دسته‌بندی سند «${target.title}» به «${category}» تغییر یافت.`
      );
    }
  };

  const handleSearchExecuted = (
    query: string,
    strategyName: string,
    hitCount: number
  ) => {
    eventBus.notify(
      "SEARCH_EXECUTED",
      `جستوجوی RAG برای «${query}» (${strategyName} · ${hitCount} نتیجه).`
    );
    pushActivity("پژوهشگر سامانه", "اجرای جستوجو", query, "search");
  };

  const handleQuestionAnswered = (
    question: string,
    mode: "simulated" | "live"
  ) => {
    setAnsweredQuestionsCount((c) => c + 1);
    eventBus.notify(
      "QA_ANSWERED",
      `پاسخ مستند (${mode === "live" ? "پیاده‌سازی‌شده" : "شبیهسازی آموزشی"}) برای: «${question.slice(0, 38)}...»`
    );
    pushActivity(
      "کاربر پژوهشگر",
      mode === "live" ? "پرسش‌وپاسخ Model Gateway" : "پرسش‌وپاسخ (شبیهسازی آموزشی)",
      question.slice(0, 42),
      "qa"
    );
  };

  const handleGuardrailTriggered = (reason: string) => {
    eventBus.notify("GUARDRAIL_TRIGGERED", reason);
    pushActivity("لایه Guardrails", "مسدودسازی ورودی غیرمجاز", reason.slice(0, 40), "system");
  };

  const handleInspectAnalysis = (docId: string) => {
    setSelectedAnalysisDocId(docId);
    setActiveSection("analysis");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        docCount={documents.length}
        observerEventCount={observerEvents.length}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean 3-Zone Top Bar (preserving focused button structure) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="بازکردن منو"
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm sm:text-base font-bold text-slate-900 truncate whitespace-nowrap">
              {SECTION_TITLES[activeSection]}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection("dashboard")}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === "dashboard" ? "text-blue-700 font-bold" : ""
              }`}
            >
              داشبورد
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("search")}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === "search" ? "text-blue-700 font-bold" : ""
              }`}
            >
              جستوجو
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("qa")}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === "qa" ? "text-blue-700 font-bold" : ""
              }`}
            >
              پرسش‌وپاسخ
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("design-patterns")}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === "design-patterns" || activeSection === "pattern-interactions"
                  ? "text-blue-700 font-bold"
                  : ""
              }`}
            >
              الگوهای طراحی AI
            </button>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection("documents")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-300" />
              <span>بارگذاری سند</span>
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeSection === "dashboard" && (
            <DashboardView
              documents={documents}
              answeredQuestionsCount={answeredQuestionsCount}
              activities={activities}
              observerEvents={observerEvents}
              geminiConfigured={geminiConfigured}
              onNavigate={setActiveSection}
            />
          )}

          {activeSection === "documents" && (
            <DocumentsView
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
              onUpdateCategory={handleUpdateCategory}
              onInspectAnalysis={handleInspectAnalysis}
            />
          )}

          {activeSection === "analysis" && (
            <AnalysisView
              documents={documents}
              initialDocId={selectedAnalysisDocId}
              geminiConfigured={geminiConfigured}
            />
          )}

          {activeSection === "search" && (
            <SearchView
              documents={documents}
              onSearchExecuted={handleSearchExecuted}
            />
          )}

          {activeSection === "qa" && (
            <QAView
              documents={documents}
              geminiConfigured={geminiConfigured}
              onQuestionAnswered={handleQuestionAnswered}
              onGuardrailTriggered={handleGuardrailTriggered}
            />
          )}

          {activeSection === "knowledge-graph" && (
            <KnowledgeGraphView documents={documents} />
          )}

          {activeSection === "design-patterns" && (
            <DesignPatternsView onNavigate={setActiveSection} />
          )}

          {activeSection === "pattern-interactions" && <PatternInteractionsView />}

          {activeSection === "architecture" && <ArchitectureView />}

          {activeSection === "execution-scenario" && <ScenarioFlowView />}

          {activeSection === "arch-comparison" && <ArchComparisonView />}

          {activeSection === "risk-quality" && <RiskQualityView />}

          {activeSection === "success-failure" && (
            <SuccessFailureView documents={documents} />
          )}

          {activeSection === "references" && <ReferencesView />}
        </main>
      </div>
    </div>
  );
}
