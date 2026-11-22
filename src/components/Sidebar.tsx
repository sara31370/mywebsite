import React from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Boxes,
  CheckCircle2,
  Cpu,
  FileText,
  GitBranch,
  GitCompareArrows,
  LayoutDashboard,
  MessageSquareText,
  Network,
  Scale,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { NavSectionId } from "../types/documind";

interface SidebarProps {
  activeSection: NavSectionId;
  onSelect: (section: NavSectionId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  docCount: number;
  observerEventCount: number;
}

interface NavItem {
  id: NavSectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelect,
  mobileOpen,
  onCloseMobile,
  docCount,
  observerEventCount,
}) => {
  const operationalItems: NavItem[] = [
    { id: "dashboard", label: "داشبورد و معرفی سامانه", icon: LayoutDashboard },
    { id: "documents", label: "مدیریت اسناد سازمانی", icon: FileText, badge: String(docCount) },
    { id: "analysis", label: "تحلیل هوشمند (Structured Output)", icon: Cpu },
    { id: "search", label: "جستوجوی هوشمند (RAG Retriever)", icon: Search },
    { id: "qa", label: "پرسش و پاسخ مستند", icon: MessageSquareText },
    { id: "knowledge-graph", label: "گراف دانش سازمانی", icon: Network },
  ];

  const academicItems: NavItem[] = [
    { id: "design-patterns", label: "آزمایشگاه ۹ الگوی طراحی AI", icon: GitBranch },
    { id: "pattern-interactions", label: "تعامل میان الگوهای AI", icon: GitCompareArrows },
    { id: "architecture", label: "معماری نرم‌افزاری سامانه", icon: Boxes },
    { id: "execution-scenario", label: "سناریوی اجرای گام‌به‌گام", icon: Activity },
    { id: "arch-comparison", label: "مقایسه معماری‌ها", icon: Scale },
    { id: "risk-quality", label: "ارزیابی ریسک و کیفیت", icon: AlertTriangle },
    { id: "success-failure", label: "سناریوهای موفقیت و شکست", icon: CheckCircle2 },
    { id: "references", label: "منابع، یادداشت جزوه و وضعیت", icon: BookOpen },
  ];

  const handleSelect = (id: NavSectionId) => {
    onSelect(id);
    onCloseMobile();
  };

  const renderGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      <div className="px-3 py-1.5 text-xs font-medium text-slate-400">
        {title}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isActive
                ? "bg-cyan-500/15 text-cyan-200 font-semibold border border-cyan-400/25"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent"
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-cyan-300" : "text-slate-400"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </span>
            {item.badge && (
              <span className="text-xs text-cyan-300 tabular-nums shrink-0">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const sidebarContent = (
    <aside className="flex flex-col h-full w-72 bg-[#0B172A] text-slate-100 border-l border-slate-800 select-none">
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800/90">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold text-white tracking-tight truncate">
              DocuMind AI
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              آزمایشگاه الگوهای طراحی AI
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="بستن منو"
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {renderGroup("محیط عملیاتی سامانه", operationalItems)}
        <div className="border-t border-slate-800/80 pt-4">
          {renderGroup("آزمایشگاه الگوهای AI و معماری", academicItems)}
        </div>
      </nav>

      <div className="px-4 py-3.5 border-t border-slate-800/90 text-xs text-slate-400 space-y-1">
        <div className="text-slate-200 font-medium">
          مسئله ۷ · جزوه الگوهای طراحی AI
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>رویدادهای ثبت‌شده سامانه</span>
          <span className="tabular-nums text-cyan-300 font-mono">
            {observerEventCount}
          </span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
