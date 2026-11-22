export type DocFileType = "PDF" | "Word" | "Text";

export type DocProcessingStatus = "تحلیل‌شده" | "در حال پردازش" | "خطا در استخراج";

export type DocCategory =
  | "حکمرانی و امنیت"
  | "معماری و فناوری"
  | "قراردادها و حقوقی"
  | "گزارش‌های مدیریتی"
  | "استانداردهای کیفیت";

export type CapabilityStatusLabel =
  | "پیاده‌سازی‌شده"
  | "شبیهسازی آموزشی"
  | "پیشنهاد معماری";

export interface DocumentPage {
  pageNumber: number;
  content: string;
}

export interface ConceptRelation {
  source: string;
  relation: string;
  target: string;
}

export interface KeywordFrequency {
  term: string;
  count: number;
  weight: number;
}

export interface DocumentAnalysis {
  topic: string;
  summary: string;
  keywords: string[];
  keywordStats: KeywordFrequency[];
  dates: string[];
  people: string[];
  organizations: string[];
  concepts: string[];
  conceptRelations: ConceptRelation[];
  strategyUsed: "statistical" | "semantic";
  isSimulated: boolean;
  needsHumanReview?: boolean;
  humanApproved?: boolean;
}

export interface EnterpriseDocument {
  id: string;
  title: string;
  fileName: string;
  fileType: DocFileType;
  sizeKB: number;
  uploadedAt: string;
  category: DocCategory;
  status: DocProcessingStatus;
  author: string;
  pages: DocumentPage[];
  analysis: DocumentAnalysis;
  isSimulatedExtraction: boolean;
  extractionNote?: string;
}

export interface SearchResultItem {
  id: string;
  documentId: string;
  documentTitle: string;
  fileName: string;
  fileType: DocFileType;
  pageNumber: number;
  relevanceScore: number;
  matchedTerms: string[];
  excerpt: string;
  strategyName: string;
}

export interface QACitation {
  documentId?: string;
  documentTitle: string;
  fileName: string;
  pageNumber: number;
  quote: string;
  relevance: number;
}

export interface QAMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  mode?: "simulated" | "live";
  statusLabel?: CapabilityStatusLabel;
  confidence?: number;
  cacheHit?: boolean;
  guardrailChecked?: boolean;
  citations?: QACitation[];
  suggestedFollowUps?: string[];
  error?: string;
}

export type KnowledgeNodeType = "concept" | "person" | "organization" | "topic" | "document";

export interface KnowledgeNode {
  id: string;
  label: string;
  type: KnowledgeNodeType;
  documentIds: string[];
  importance: number;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  documentId: string;
}

export interface SystemActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  category: "upload" | "analysis" | "search" | "qa" | "system";
}

export interface ObserverEvent {
  id: string;
  eventType:
    | "DOCUMENT_UPLOADED"
    | "DOCUMENT_ANALYZED"
    | "DOCUMENT_DELETED"
    | "CATEGORY_UPDATED"
    | "SEARCH_EXECUTED"
    | "QA_ANSWERED"
    | "GUARDRAIL_TRIGGERED"
    | "CACHE_INVALIDATED";
  timestamp: string;
  payloadSummary: string;
  notifiedObservers: string[];
}

export type NavSectionId =
  | "dashboard"
  | "documents"
  | "analysis"
  | "search"
  | "qa"
  | "knowledge-graph"
  | "design-patterns"
  | "pattern-interactions"
  | "architecture"
  | "execution-scenario"
  | "arch-comparison"
  | "risk-quality"
  | "success-failure"
  | "references";
