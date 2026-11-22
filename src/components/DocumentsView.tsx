import React, { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Eye,
  FileText,
  Filter,
  FolderOpen,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  DeepRelationExtractionStrategy,
  DocumentProcessorFactory,
  inferCategoryFromText,
} from "../patterns/documindPatterns";
import {
  DocCategory,
  DocFileType,
  EnterpriseDocument,
} from "../types/documind";

interface DocumentsViewProps {
  documents: EnterpriseDocument[];
  onAddDocument: (doc: EnterpriseDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onUpdateCategory: (docId: string, category: DocCategory) => void;
  onInspectAnalysis: (docId: string) => void;
}

const CATEGORIES: DocCategory[] = [
  "حکمرانی و امنیت",
  "معماری و فناوری",
  "قراردادها و حقوقی",
  "گزارش‌های مدیریتی",
  "استانداردهای کیفیت",
];

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onUpdateCategory,
  onInspectAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"همه" | DocFileType>("همه");
  const [categoryFilter, setCategoryFilter] = useState<"همه" | DocCategory>("همه");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    documents[0]?.id ?? null
  );

  // Upload form state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>("معماری و فناوری");
  const [customTitle, setCustomTitle] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesType = typeFilter === "همه" || doc.fileType === typeFilter;
      const matchesCategory =
        categoryFilter === "همه" || doc.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        doc.author.toLowerCase().includes(q);
      return matchesType && matchesCategory && matchesQuery;
    });
  }, [documents, typeFilter, categoryFilter, searchQuery]);

  const selectedDoc = useMemo(
    () => documents.find((d) => d.id === selectedDocId) ?? null,
    [documents, selectedDocId]
  );

  const processFileUpload = async (file: File) => {
    setUploadError(null);
    setUploadSuccessMsg(null);
    setUploadBusy(true);

    try {
      // Factory Method Pattern selects PdfProcessorFactory / WordProcessorFactory / TextProcessorFactory
      const factory = DocumentProcessorFactory.forFileName(file.name);
      const processor = factory.createProcessor();
      const extracted = await processor.extractText(file, customContent);

      // Strategy Pattern runs semantic knowledge extraction
      const analyzer = new DeepRelationExtractionStrategy();
      const docTitle = customTitle.trim() || extracted.title;
      const analysis = analyzer.analyze(docTitle, extracted.pages);

      const newDoc: EnterpriseDocument = {
        id: `doc-${Date.now()}`,
        title: docTitle,
        fileName: extracted.fileName,
        fileType: extracted.fileType,
        sizeKB: extracted.sizeKB,
        uploadedAt: new Date().toLocaleDateString("fa-IR"),
        category: selectedCategory,
        status: "تحلیل‌شده",
        author: "کاربر پژوهشگر",
        pages: extracted.pages,
        analysis,
        isSimulatedExtraction: extracted.isSimulatedExtraction,
        extractionNote: extracted.extractionNote,
      };

      onAddDocument(newDoc);
      setSelectedDocId(newDoc.id);
      setCustomTitle("");
      setCustomContent("");
      setUploadSuccessMsg(
        `سند «${newDoc.title}» با پردازشگر ${processor.constructor.name} دریافت، تحلیل و به مخزن دانش اضافه شد.`
      );
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : "خطای نامشخص در پردازش فایل."
      );
    } finally {
      setUploadBusy(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFileUpload(file);
      e.target.value = "";
    }
  };

  const handleQuickDemoUpload = (kind: "pdf" | "word") => {
    const sampleText =
      kind === "pdf"
        ? "سند فنی استاندارد استقرار پایپلاین استخراج دانش در محیط‌های بانکی و سازمانی در تاریخ ۱۴۰۴/۰۹/۰۴ توسط مهندس مریم کاظمی و کمیته راهبری فناوری اطلاعات تدوین شد. این سند بر استفاده از الگوی Strategy برای انتخاب موتور جستوجو، رمزنگاری AES-256 و کنترل دسترسی مبتنی بر نقش تأکید دارد."
        : "گزارش ارزیابی قراردادهای هوش مصنوعی توسط دفتر حقوقی سازمان و سارا شریفی در ۱۴۰۴/۰۹/۰۵ ارائه گردید. در صفحه نخست بر مالکیت معنوی گراف دانش و جلوگیری از نشت اسناد محرمانه تأکید شده است.";

    const fakeBlob = new Blob([sampleText], {
      type:
        kind === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const fileName =
      kind === "pdf" ? "enterprise-ai-pipeline-1404.pdf" : "legal-ai-contract-review.docx";
    const file = new File([fakeBlob], fileName, { type: fakeBlob.type });
    setCustomContent(sampleText);
    setSelectedCategory(inferCategoryFromText(sampleText));
    void processFileUpload(file);
  };

  return (
    <div className="space-y-6">
      {/* Upload & Transparency Box */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              بارگذاری و مدیریت اسناد سازمانی
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              آماده‌سازی اسناد PDF، Word و متنی جهت قطعه‌بندی صفحه‌محور در{" "}
              <span className="font-mono text-blue-700">RAG</span> و استخراج{" "}
              <span className="font-mono text-blue-700">Structured Output</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoUpload("pdf")}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0"
            >
              شبیه‌سازی آپلود سریع PDF نمونه
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoUpload("word")}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100 transition-colors whitespace-nowrap shrink-0"
            >
              شبیه‌سازی آپلود سریع Word نمونه
            </button>
          </div>
        </div>

        {/* Upload Configuration Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              عنوان اختیاری سند
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="در صورت خالی بودن از نام فایل استفاده می‌شود"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              دسته‌بندی موضوعی سند
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as DocCategory)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              انتخاب فایل از سیستم (PDF / Word / TXT)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadBusy}
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploadBusy ? "در حال پردازش..." : "انتخاب و بارگذاری فایل"}</span>
            </button>
          </div>
        </div>

        {/* Optional raw text input for testing real Persian extraction on PDF/Word */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            متن دلخواه برای تزریق به فایل انتخابی (اختیاری — برای تست تحلیل واقعی متن فارسی هنگام آپلود PDF/Word باینری)
          </label>
          <textarea
            rows={2}
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
            placeholder="اگر می‌خواهید متن فارسی مشخصی همزمان با فایل PDF یا Word تحلیل شود، اینجا وارد کنید؛ در غیر این صورت برای فایل‌های باینری، استخراج متن شبیه‌سازی می‌شود."
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Explicit Real vs Simulated Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800">وضعیت فنی پردازش فایل:</strong> خواندن و قطعه‌بندی فایل‌های متنی (
          <span className="font-mono">.txt / .md</span>){" "}
          <strong className="text-emerald-800">«پیاده‌سازی‌شده»</strong> است؛ اما برای فایل‌های باینری{" "}
          <span className="font-mono">PDF</span> و <span className="font-mono">Word</span> به دلیل نبود
          مبدل باینری سمت سرور، استخراج متن صفحات فشرده به‌صورت{" "}
          <strong className="text-amber-800">«شبیهسازی آموزشی»</strong> انجام و برچسب‌گذاری می‌شود.
        </div>

        {uploadError && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccessMsg && (
          <div className="flex items-center justify-between gap-3 bg-cyan-50 border border-cyan-200 text-cyan-900 rounded-lg px-4 py-3 text-xs">
            <span>{uploadSuccessMsg}</span>
            <button
              type="button"
              onClick={() => setUploadSuccessMsg(null)}
              className="text-cyan-700 hover:text-cyan-950"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Filters & Document Table + Detail Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Document List */}
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستوجو در عنوان، نام فایل یا نویسنده..."
                className="w-full pr-9 pl-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {(["همه", "PDF", "Word", "Text"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      typeFilter === t
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as "همه" | DocCategory)
                  }
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="همه">همه دسته‌ها</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="py-12 text-center space-y-2 text-slate-500">
              <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
              <div className="text-sm font-medium text-slate-700">
                سندی با فیلترهای انتخابی یافت نشد
              </div>
              <div className="text-xs">
                عبارت جستوجو یا فیلتر نوع فایل را تغییر دهید یا سند جدید بارگذاری کنید.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2.5 px-2 font-medium">نام و عنوان سند</th>
                    <th className="py-2.5 px-2 font-medium whitespace-nowrap">نوع / حجم</th>
                    <th className="py-2.5 px-2 font-medium whitespace-nowrap">دسته‌بندی</th>
                    <th className="py-2.5 px-2 font-medium whitespace-nowrap">تاریخ و وضعیت</th>
                    <th className="py-2.5 px-2 font-medium text-left whitespace-nowrap">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => {
                    const isSelected = selectedDoc?.id === doc.id;
                    return (
                      <tr
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-cyan-50/60" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-3 px-2 min-w-[200px]">
                          <div className="font-semibold text-slate-900 line-clamp-1">
                            {doc.title}
                          </div>
                          <div className="text-xs text-slate-500 font-mono truncate max-w-[240px]">
                            {doc.fileName}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs text-slate-600 whitespace-nowrap tabular-nums">
                          {doc.fileType} · {doc.sizeKB.toLocaleString("fa-IR")} KB
                        </td>
                        <td
                          className="py-3 px-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            aria-label="تغییر دسته‌بندی سند"
                            value={doc.category}
                            onChange={(e) =>
                              onUpdateCategory(doc.id, e.target.value as DocCategory)
                            }
                            className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-2 text-xs whitespace-nowrap">
                          <div className="text-slate-700 tabular-nums">{doc.uploadedAt}</div>
                          <div className="text-cyan-700 font-medium">
                            {doc.status}
                            {doc.isSimulatedExtraction ? " (شبیه‌سازی)" : ""}
                          </div>
                        </td>
                        <td
                          className="py-3 px-2 text-left whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedDocId(doc.id)}
                              title="مشاهده جزئیات"
                              className="p-1.5 rounded-md text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteDocument(doc.id)}
                              title="حذف سند"
                              className="p-1.5 rounded-md text-slate-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Document Details Inspector */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">جزئیات و متن سند</h3>
            <FileText className="w-4 h-4 text-cyan-700" />
          </div>

          {!selectedDoc ? (
            <div className="py-10 text-center text-xs text-slate-500">
              یک سند را از فهرست برای مشاهده جزئیات و صفحات استخراج‌شده انتخاب کنید.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900">
                  {selectedDoc.title}
                </div>
                <div className="text-xs text-slate-500">
                  نویسنده: {selectedDoc.author} · دسته: {selectedDoc.category} ·{" "}
                  <span className="tabular-nums">
                    {selectedDoc.pages.length.toLocaleString("fa-IR")} صفحه
                  </span>
                </div>
              </div>

              {selectedDoc.extractionNote && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                  {selectedDoc.extractionNote}
                </div>
              )}

              <div className="space-y-2.5 max-h-72 overflow-y-auto pl-1">
                {selectedDoc.pages.map((p) => (
                  <div
                    key={p.pageNumber}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1"
                  >
                    <div className="text-[11px] font-semibold text-cyan-800 tabular-nums">
                      صفحه {p.pageNumber.toLocaleString("fa-IR")}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {p.content}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onInspectAnalysis(selectedDoc.id)}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium transition-colors"
              >
                مشاهده تحلیل هوشمند این سند
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
