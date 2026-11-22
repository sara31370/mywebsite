import {
  DocCategory,
  DocFileType,
  DocumentAnalysis,
  EnterpriseDocument,
  KnowledgeEdge,
  KnowledgeNode,
  ObserverEvent,
  QACitation,
  SearchResultItem,
} from "../types/documind";

/* ============================================================================
   1. FACTORY METHOD PATTERN: Document Processor Creation
   ============================================================================ */

export interface ExtractedDocumentPayload {
  title: string;
  fileName: string;
  fileType: DocFileType;
  sizeKB: number;
  pages: { pageNumber: number; content: string }[];
  isSimulatedExtraction: boolean;
  extractionNote: string;
}

export abstract class DocumentProcessor {
  abstract readonly supportedType: DocFileType;
  abstract extractText(file: File, customText?: string): Promise<ExtractedDocumentPayload>;

  protected splitIntoPages(rawText: string, charsPerPage = 520): { pageNumber: number; content: string }[] {
    const cleaned = rawText.replace(/\r\n/g, "\n").trim();
    if (!cleaned) {
      throw new Error("EXTRACTION_EMPTY_TEXT: متن قابل خواندنی در سند یافت نشد.");
    }
    const pages: { pageNumber: number; content: string }[] = [];
    for (let i = 0; i < cleaned.length; i += charsPerPage) {
      pages.push({
        pageNumber: pages.length + 1,
        content: cleaned.slice(i, i + charsPerPage).trim(),
      });
    }
    return pages;
  }
}

export class PdfDocumentProcessor extends DocumentProcessor {
  readonly supportedType: DocFileType = "PDF";

  async extractText(file: File, customText?: string): Promise<ExtractedDocumentPayload> {
    if (customText && customText.trim().length > 15) {
      return {
        title: file.name.replace(/\.pdf$/i, ""),
        fileName: file.name,
        fileType: "PDF",
        sizeKB: Math.max(1, Math.round(file.size / 1024)),
        pages: this.splitIntoPages(customText),
        isSimulatedExtraction: false,
        extractionNote: "متن ارائه‌شده توسط کاربر مستقیماً پردازش و صفحه‌بندی شد.",
      };
    }

    const buffer = await file.slice(0, 65536).arrayBuffer();
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const rawSample = decoder.decode(buffer);

    // Attempt lightweight extraction of parenthesized PDF literal strings if plain ASCII/UTF-8 exists
    const matches = Array.from(rawSample.matchAll(/\(([^()\\]{6,160})\)/g))
      .map((m) => m[1])
      .filter((s) => /[a-zA-Z\u0600-\u06FF]{3,}/.test(s));

    if (matches.length >= 3) {
      return {
        title: file.name.replace(/\.pdf$/i, ""),
        fileName: file.name,
        fileType: "PDF",
        sizeKB: Math.max(1, Math.round(file.size / 1024)),
        pages: this.splitIntoPages(matches.join(" ")),
        isSimulatedExtraction: true,
        extractionNote:
          "استخراج سبک جریان متنی PDF در مرورگر انجام شد (در نسخه تولیدی از مبدل سرور Apache Tika / pdfplumber استفاده می‌شود).",
      };
    }

    const simulatedContent =
      `این سند (${file.name}) از طریق پردازشگر شبیه‌سازی‌شده PDF (PdfDocumentProcessor) دریافت شد. ` +
      `به دلیل فشرده‌سازی باینری یا فونت‌های توکار فارسی در مرورگر، استخراج کامل با کتابخانه سمت سرور جایگزین شده است. ` +
      `موضوعات کلیدی شناسایی‌شده شامل مدیریت دانش سازمانی، معماری سامانه و کنترل کیفیت داده‌ها در تاریخ ۱۴۰۴/۰۹/۰۲ است. ` +
      `در بخش دوم سند به الزامات امنیت اطلاعات، نقش کارشناسان تیم مهندسی نرم‌افزار و رعایت استاندارد ISO/IEC 25010 اشاره شده است.`;

    return {
      title: file.name.replace(/\.pdf$/i, ""),
      fileName: file.name,
      fileType: "PDF",
      sizeKB: Math.max(12, Math.round(file.size / 1024)),
      pages: this.splitIntoPages(simulatedContent, 260),
      isSimulatedExtraction: true,
      extractionNote:
        "پردازش شبیه‌سازی‌شده: فایل PDF واقعی دریافت شد اما به دلیل نبود مبدل باینری سمت سرور، محتوای نمونه جهت نمایش پایپلاین تحلیل جایگزین گردید.",
    };
  }
}

export class WordDocumentProcessor extends DocumentProcessor {
  readonly supportedType: DocFileType = "Word";

  async extractText(file: File, customText?: string): Promise<ExtractedDocumentPayload> {
    if (customText && customText.trim().length > 15) {
      return {
        title: file.name.replace(/\.(docx?|rtf)$/i, ""),
        fileName: file.name,
        fileType: "Word",
        sizeKB: Math.max(1, Math.round(file.size / 1024)),
        pages: this.splitIntoPages(customText),
        isSimulatedExtraction: false,
        extractionNote: "متن سند Word مستقیماً پردازش و تحلیل شد.",
      };
    }

    const simulatedContent =
      `سند متنی Word با نام ${file.name} توسط کلاس WordDocumentProcessor پردازش گردید. ` +
      `مفاهیم محوری استخراج‌شده شامل دستورالعمل‌های اجرایی، هماهنگی میان کمیته راهبری فناوری اطلاعات و دفتر حقوقی، و زمان‌بندی تحویل فاز دوم پروژه در ۱۴۰۴/۰۹/۰۵ است. ` +
      `تأکید سند بر مستندسازی الگوهای طراحی Strategy، Factory Method و Observer و کاهش بدهی فنی در معماری ماژولار است.`;

    return {
      title: file.name.replace(/\.(docx?|rtf)$/i, ""),
      fileName: file.name,
      fileType: "Word",
      sizeKB: Math.max(10, Math.round(file.size / 1024)),
      pages: this.splitIntoPages(simulatedContent, 240),
      isSimulatedExtraction: true,
      extractionNote:
        "پردازش شبیه‌سازی‌شده: فایل Word واقعی ثبت شد و ساختار متنی آن برای نمایش عملکرد تحلیلگر شبیه‌سازی گردید.",
    };
  }
}

export class PlainTextDocumentProcessor extends DocumentProcessor {
  readonly supportedType: DocFileType = "Text";

  async extractText(file: File, customText?: string): Promise<ExtractedDocumentPayload> {
    const content = customText && customText.trim() ? customText : await file.text();
    if (!content || content.trim().length < 5) {
      throw new Error("EXTRACTION_EMPTY_TEXT: فایل متنی خالی است یا متن کافی ندارد.");
    }
    return {
      title: file.name.replace(/\.(txt|md|csv)$/i, ""),
      fileName: file.name,
      fileType: "Text",
      sizeKB: Math.max(1, Math.round(file.size / 1024)),
      pages: this.splitIntoPages(content),
      isSimulatedExtraction: false,
      extractionNote: "استخراج واقعی و مستقیم متن از فایل متنی در مرورگر انجام شد.",
    };
  }
}

export abstract class DocumentProcessorFactory {
  abstract createProcessor(): DocumentProcessor;

  static forFileName(fileName: string): DocumentProcessorFactory {
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".pdf")) return new PdfProcessorFactory();
    if (lower.endsWith(".docx") || lower.endsWith(".doc")) return new WordProcessorFactory();
    if (lower.endsWith(".txt") || lower.endsWith(".md")) return new TextProcessorFactory();
    throw new Error(
      `UNSUPPORTED_FORMAT: فرمت فایل «${fileName}» پشتیبانی نمی‌شود. فقط PDF، Word (.docx/.doc) و فایل متنی (.txt/.md) مجاز هستند.`
    );
  }
}

class PdfProcessorFactory extends DocumentProcessorFactory {
  createProcessor(): DocumentProcessor {
    return new PdfDocumentProcessor();
  }
}

class WordProcessorFactory extends DocumentProcessorFactory {
  createProcessor(): DocumentProcessor {
    return new WordDocumentProcessor();
  }
}

class TextProcessorFactory extends DocumentProcessorFactory {
  createProcessor(): DocumentProcessor {
    return new PlainTextDocumentProcessor();
  }
}

/* ============================================================================
   2. STRATEGY PATTERN: Search & Analysis Algorithms
   ============================================================================ */

const PERSIAN_STOP_WORDS = new Set([
  "و", "در", "به", "از", "که", "این", "را", "با", "است", "برای", "آن", "یک",
  "هم", "تا", "بر", "یا", "شد", "می", "های", "ها", "ای", "شود", "شده", "دارد",
  "کند", "کنند", "باید", "بود", "نیز", "هر", "چه", "درباره", "چگونه", "کدام", "چیست",
]);

export function normalizePersian(text: string): string {
  return text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c]/g, " ")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s/-]/g, " ")
    .toLowerCase()
    .trim();
}

export function tokenizePersian(text: string): string[] {
  return normalizePersian(text)
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !PERSIAN_STOP_WORDS.has(t));
}

export interface SearchStrategy {
  readonly id: "keyword" | "semantic";
  readonly name: string;
  readonly description: string;
  search(query: string, documents: EnterpriseDocument[]): SearchResultItem[];
}

const CONCEPT_SYNONYMS: Record<string, string[]> = {
  "امنیت": ["محرمانگی", "rbac", "رمزنگاری", "aes-256", "tls", "prompt", "ممیزی", "آیین‌نامه", "حفاظت"],
  "الگو": ["strategy", "factory", "observer", "gof", "الگوهای", "طراحی", "واسط"],
  "معماری": ["ماژولار", "monolith", "میکروسرویس", "microservices", "لایه", "مخزن"],
  "هوش": ["rag", "مدل", "توهم", "hallucination", "استخراج", "تحلیل", "دانش"],
  "قرارداد": ["برون‌سپاری", "مالکیت", "معنوی", "حقوقی", "پیمانکار", "جریمه"],
  "خطا": ["توهم", "ocr", "محدودیت", "ریسک", "پایش", "اسکن"],
  "دانش": ["گراف", "مفاهیم", "مخزن", "ارتباط", "نمایه‌سازی", "استخراج"],
  "کیفیت": ["iso", "25010", "کارایی", "نگهداری", "اطمینان", "توسعه‌پذیری"],
};

export class KeywordTfIdfStrategy implements SearchStrategy {
  readonly id = "keyword";
  readonly name = "راهبرد جستوجوی کلیدواژه (TF-IDF)";
  readonly description =
    "تطبیق دقیق واژگان پرسش با متن صفحات اسناد بر اساس وزن فراوانی واژه و طول قطعه متنی.";

  search(query: string, documents: EnterpriseDocument[]): SearchResultItem[] {
    const tokens = tokenizePersian(query);
    if (tokens.length === 0) return [];

    const results: SearchResultItem[] = [];
    for (const doc of documents) {
      for (const page of doc.pages) {
        const pageNorm = normalizePersian(page.content + " " + doc.title);
        const matchedTerms: string[] = [];
        let hits = 0;

        for (const token of tokens) {
          const regex = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          const count = (pageNorm.match(regex) || []).length;
          if (count > 0) {
            matchedTerms.push(token);
            hits += count;
          }
        }

        if (matchedTerms.length > 0) {
          const coverage = matchedTerms.length / tokens.length;
          const density = Math.min(1, hits / 5);
          const score = Math.min(99, Math.round(coverage * 68 + density * 30));

          results.push({
            id: `${doc.id}-p${page.pageNumber}-kw`,
            documentId: doc.id,
            documentTitle: doc.title,
            fileName: doc.fileName,
            fileType: doc.fileType,
            pageNumber: page.pageNumber,
            relevanceScore: score,
            matchedTerms: Array.from(new Set(matchedTerms)),
            excerpt: page.content,
            strategyName: this.name,
          });
        }
      }
    }
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

export class SemanticConceptStrategy implements SearchStrategy {
  readonly id = "semantic";
  readonly name = "راهبرد جستوجوی مفهومی و گسترش معنایی";
  readonly description =
    "گسترش پرسش با مفاهیم هم‌معنا، موجودیت‌های استخراج‌شده و کلمات کلیدی اسناد برای بازیابی معنایی.";

  search(query: string, documents: EnterpriseDocument[]): SearchResultItem[] {
    const baseTokens = tokenizePersian(query);
    if (baseTokens.length === 0) return [];

    const expandedTokens = new Set<string>(baseTokens);
    for (const token of baseTokens) {
      for (const [root, syns] of Object.entries(CONCEPT_SYNONYMS)) {
        if (token.includes(root) || syns.some((s) => s.includes(token))) {
          expandedTokens.add(root);
          syns.forEach((s) => expandedTokens.add(s));
        }
      }
    }

    const results: SearchResultItem[] = [];
    for (const doc of documents) {
      const metadataText = normalizePersian(
        [
          doc.title,
          doc.analysis.topic,
          ...doc.analysis.keywords,
          ...doc.analysis.concepts,
          ...doc.analysis.people,
          ...doc.analysis.organizations,
        ].join(" ")
      );

      for (const page of doc.pages) {
        const pageNorm = normalizePersian(page.content);
        const directMatches: string[] = [];
        const semanticMatches: string[] = [];

        for (const t of baseTokens) {
          if (pageNorm.includes(t) || metadataText.includes(t)) {
            directMatches.push(t);
          }
        }
        for (const t of expandedTokens) {
          if (!baseTokens.includes(t) && (pageNorm.includes(t) || metadataText.includes(t))) {
            semanticMatches.push(t);
          }
        }

        const totalHits = directMatches.length * 2 + semanticMatches.length;
        if (totalHits > 0) {
          const directRatio = directMatches.length / baseTokens.length;
          const semanticBoost = Math.min(0.32, semanticMatches.length * 0.08);
          const score = Math.min(99, Math.round(directRatio * 64 + semanticBoost * 100 + 8));

          results.push({
            id: `${doc.id}-p${page.pageNumber}-sem`,
            documentId: doc.id,
            documentTitle: doc.title,
            fileName: doc.fileName,
            fileType: doc.fileType,
            pageNumber: page.pageNumber,
            relevanceScore: score,
            matchedTerms: Array.from(new Set([...directMatches, ...semanticMatches])).slice(0, 6),
            excerpt: page.content,
            strategyName: this.name,
          });
        }
      }
    }
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

export interface AnalysisStrategy {
  readonly id: "statistical" | "semantic";
  readonly name: string;
  analyze(title: string, pages: { pageNumber: number; content: string }[]): DocumentAnalysis;
}

export class StatisticalExtractionStrategy implements AnalysisStrategy {
  readonly id = "statistical";
  readonly name = "استخراج آماری و الگوهای قاعده‌محور";

  analyze(title: string, pages: { pageNumber: number; content: string }[]): DocumentAnalysis {
    const fullText = pages.map((p) => p.content).join(" ");
    const tokens = tokenizePersian(fullText);
    const freqMap = new Map<string, number>();
    for (const t of tokens) {
      freqMap.set(t, (freqMap.get(t) || 0) + 1);
    }

    const sorted = Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const maxCount = sorted[0]?.[1] || 1;
    const keywordStats = sorted.map(([term, count]) => ({
      term,
      count,
      weight: Math.round((count / maxCount) * 85 + 10),
    }));

    const dates = Array.from(
      new Set(fullText.match(/1[34]\d{2}\/\d{1,2}\/\d{1,2}|۱[۳۴][۰-۹]{2}\/[۰-۹]{1,2}\/[۰-۹]{1,2}|۱۴۰[۰-۹]/g) || [])
    );
    const people = Array.from(
      new Set(fullText.match(/(?:دکتر|مهندس)\s+[\u0600-\u06FF]+\s+[\u0600-\u06FF]+/g) || [])
    );
    const organizations = Array.from(
      new Set(
        fullText.match(
          /(?:کمیته|واحد|پژوهشگاه|دانشگاه|دفتر|تیم|کارگروه)\s+[\u0600-\u06FF]+(?:\s+[\u0600-\u06FF]+){0,2}/g
        ) || []
      )
    );

    const keywords = keywordStats.map((k) => k.term);
    const concepts = keywords.slice(0, 4);

    return {
      topic: `تحلیل آماری سند: ${title}`,
      summary:
        pages[0]?.content.slice(0, 220) +
        (pages[0]?.content.length > 220 ? "..." : ""),
      keywords,
      keywordStats,
      dates: dates.length ? dates : ["۱۴۰۴/۰۹/۰۲"],
      people: people.length ? people : ["تاییدنشده در متن"],
      organizations: organizations.length ? organizations : ["سازمان مرجع"],
      concepts,
      conceptRelations:
        concepts.length >= 2
          ? [{ source: concepts[0], relation: "هم‌رخداد با", target: concepts[1] }]
          : [],
      strategyUsed: "statistical",
      isSimulated: true,
    };
  }
}

export class DeepRelationExtractionStrategy implements AnalysisStrategy {
  readonly id = "semantic";
  readonly name = "تحلیل معنایی و استخراج گراف مفاهیم";

  analyze(title: string, pages: { pageNumber: number; content: string }[]): DocumentAnalysis {
    const base = new StatisticalExtractionStrategy().analyze(title, pages);
    const fullText = pages.map((p) => p.content).join(" ");
    const detectedConcepts: string[] = [];

    for (const [root, syns] of Object.entries(CONCEPT_SYNONYMS)) {
      if (fullText.includes(root) || syns.some((s) => normalizePersian(fullText).includes(s))) {
        detectedConcepts.push(`حوزه ${root}`);
      }
    }

    const concepts = detectedConcepts.length ? detectedConcepts.slice(0, 5) : base.concepts;
    const relations = concepts.slice(0, -1).map((c, idx) => ({
      source: c,
      relation: idx % 2 === 0 ? "مرتبط با" : "پشتیبانی می‌کند از",
      target: concepts[idx + 1],
    }));

    return {
      ...base,
      topic: `تحلیل معنایی و شناختی: ${title}`,
      concepts,
      conceptRelations: relations.length ? relations : base.conceptRelations,
      strategyUsed: "semantic",
      isSimulated: true,
    };
  }
}

/* ============================================================================
   3. OBSERVER PATTERN: Real-time Event Bus across System Modules
   ============================================================================ */

export type DomainObserver = (event: ObserverEvent) => void;

export class DocumentEventBus {
  private observers: Map<string, DomainObserver> = new Map();

  subscribe(observerName: string, handler: DomainObserver): () => void {
    this.observers.set(observerName, handler);
    return () => {
      this.observers.delete(observerName);
    };
  }

  notify(
    eventType: ObserverEvent["eventType"],
    payloadSummary: string
  ): ObserverEvent {
    const notifiedObservers = Array.from(this.observers.keys());
    const event: ObserverEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      eventType,
      timestamp: new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      payloadSummary,
      notifiedObservers,
    };
    this.observers.forEach((handler) => handler(event));
    return event;
  }
}

/* ============================================================================
   4. KNOWLEDGE GRAPH BUILDER & SIMULATED GROUNDED Q&A SYNTHESIZER
   ============================================================================ */

export function buildKnowledgeGraph(documents: EnterpriseDocument[]): {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
} {
  const nodeMap = new Map<string, KnowledgeNode>();
  const edges: KnowledgeEdge[] = [];

  const upsertNode = (
    id: string,
    label: string,
    type: KnowledgeNode["type"],
    docId: string,
    importanceBoost = 1
  ) => {
    const existing = nodeMap.get(id);
    if (existing) {
      if (!existing.documentIds.includes(docId)) {
        existing.documentIds.push(docId);
      }
      existing.importance += importanceBoost;
    } else {
      nodeMap.set(id, {
        id,
        label,
        type,
        documentIds: [docId],
        importance: importanceBoost,
      });
    }
  };

  for (const doc of documents) {
    const docNodeId = `doc:${doc.id}`;
    upsertNode(docNodeId, doc.title.slice(0, 32) + (doc.title.length > 32 ? "..." : ""), "document", doc.id, 3);

    const topicId = `topic:${doc.category}`;
    upsertNode(topicId, doc.category, "topic", doc.id, 2);
    edges.push({
      id: `e-${docNodeId}-${topicId}`,
      source: docNodeId,
      target: topicId,
      label: "دسته‌بندی در",
      documentId: doc.id,
    });

    doc.analysis.people.slice(0, 2).forEach((person) => {
      if (person.includes("تاییدنشده")) return;
      const pid = `person:${person}`;
      upsertNode(pid, person, "person", doc.id, 2);
      edges.push({
        id: `e-${pid}-${docNodeId}`,
        source: pid,
        target: docNodeId,
        label: "مشارکت در",
        documentId: doc.id,
      });
    });

    doc.analysis.organizations.slice(0, 2).forEach((org) => {
      const oid = `org:${org}`;
      upsertNode(oid, org, "organization", doc.id, 2);
      edges.push({
        id: `e-${docNodeId}-${oid}`,
        source: docNodeId,
        target: oid,
        label: "مرتبط با نهاد",
        documentId: doc.id,
      });
    });

    doc.analysis.concepts.slice(0, 3).forEach((concept) => {
      const cid = `concept:${concept}`;
      upsertNode(cid, concept, "concept", doc.id, 2);
      edges.push({
        id: `e-${docNodeId}-${cid}`,
        source: docNodeId,
        target: cid,
        label: "حاوی مفهوم",
        documentId: doc.id,
      });
    });
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
  };
}

export function synthesizeSimulatedRAGAnswer(
  question: string,
  documents: EnterpriseDocument[]
): {
  answer: string;
  confidence: number;
  citations: QACitation[];
  suggestedFollowUps: string[];
} {
  const semanticStrategy = new SemanticConceptStrategy();
  const ranked = semanticStrategy.search(question, documents);

  if (ranked.length === 0 || ranked[0].relevanceScore < 22) {
    return {
      answer:
        "اطلاعات کافی و مستندی برای پاسخ به این پرسش در میان اسناد ثبت‌شده سازمان یافت نشد. برای جلوگیری از تولید پاسخ نادرست (Hallucination)، سامانه از حدس‌زدن خودداری می‌کند. لطفاً پرسش خود را با کلیدواژه‌های تخصصی‌تر مطرح کنید یا سند مرتبط را بارگذاری نمایید.",
      confidence: 18,
      citations: [],
      suggestedFollowUps: [
        "الزامات امنیتی RBAC و رمزنگاری در اسناد چیست؟",
        "چرا معماری ماژولار یکپارچه انتخاب شده است؟",
        "نرخ کاهش توهم هوش مصنوعی در گزارش RAG چقدر است؟",
      ],
    };
  }

  const topMatches = ranked.slice(0, 3);
  const citations: QACitation[] = topMatches.map((item) => ({
    documentId: item.documentId,
    documentTitle: item.documentTitle,
    fileName: item.fileName,
    pageNumber: item.pageNumber,
    quote: item.excerpt,
    relevance: item.relevanceScore,
  }));

  const primary = topMatches[0];
  const secondary = topMatches[1];
  const confidence = Math.min(96, Math.round(primary.relevanceScore * 0.72 + 24));

  let answer = `بر اساس تحلیل و بازیابی معنایی از اسناد سازمانی، مهم‌ترین پاسخ در سند «${primary.documentTitle}» (صفحه ${primary.pageNumber}) آمده است:\n\n`;
  answer += `${primary.excerpt}\n\n`;

  if (secondary && secondary.relevanceScore >= 40) {
    answer += `در تکمیل این موضوع، در سند «${secondary.documentTitle}» (صفحه ${secondary.pageNumber}) نیز اشاره شده است:\n${secondary.excerpt.slice(0, 210)}${secondary.excerpt.length > 210 ? "..." : ""}`;
  }

  return {
    answer,
    confidence,
    citations,
    suggestedFollowUps: [
      `جزئیات بیشتر از سند «${primary.documentTitle.slice(0, 28)}...» چیست؟`,
      "چه ریسک‌ها و راهکارهای کنترلی مرتبط با این موضوع مطرح شده است؟",
      "کدام سازمان‌ها یا افراد در این بخش نقش دارند؟",
    ],
  };
}

export function inferCategoryFromText(text: string): DocCategory {
  const norm = normalizePersian(text);
  if (norm.includes("امنیت") || norm.includes("محرمان") || norm.includes("rbac")) {
    return "حکمرانی و امنیت";
  }
  if (norm.includes("قرارداد") || norm.includes("حقوق") || norm.includes("مالکیت")) {
    return "قراردادها و حقوقی";
  }
  if (norm.includes("iso") || norm.includes("کیفیت") || norm.includes("الگو")) {
    return "استانداردهای کیفیت";
  }
  if (norm.includes("معماری") || norm.includes("فناوری") || norm.includes("گراف")) {
    return "معماری و فناوری";
  }
  return "گزارش‌های مدیریتی";
}
