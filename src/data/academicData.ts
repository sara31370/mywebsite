export interface ArchitectureComponentSpec {
  id: string;
  order: number;
  titleFa: string;
  titleEn: string;
  layer: "presentation" | "application" | "ai-core" | "storage";
  layerFa: string;
  summary: string;
  responsibilities: string[];
  inputs: string[];
  outputs: string[];
  patternsApplied: string[];
  x: number;
  y: number;
}

export const ARCHITECTURE_COMPONENTS: ArchitectureComponentSpec[] = [
  {
    id: "ui",
    order: 1,
    titleFa: "رابط کاربری",
    titleEn: "User Interface",
    layer: "presentation",
    layerFa: "لایه ارائه (Presentation)",
    summary:
      "نقطه تعامل کاربر شامل داشبورد، بارگذاری اسناد، صف بازبینی انسانی (HITL)، جستوجو، گفت‌وگوی پرسش‌وپاسخ و گراف دانش.",
    responsibilities: [
      "ارائه محیط راست‌چین فارسی و شفاف‌سازی وضعیت قابلیت‌ها (پیاده‌سازی‌شده / شبیهسازی آموزشی / پیشنهاد معماری)",
      "نمایش استنادهای دقیق (نام فایل و شماره صفحه) و میزان اطمینان پاسخ",
      "فراهم‌کردن واسط تأیید یا اصلاح کارشناس در جریان Human-in-the-Loop",
    ],
    inputs: ["فایل‌های اسناد کاربر", "پرسش‌های متنی فارسی", "تأییدهای انسانی"],
    outputs: ["گزارش‌های تحلیلی", "پاسخ مستند با شماره صفحه", "گراف دانش تعاملی"],
    patternsApplied: ["Human-in-the-Loop (صف بررسی اسناد حساس)"],
    x: 420,
    y: 44,
  },
  {
    id: "doc-mgmt",
    order: 2,
    titleFa: "مدیریت اسناد",
    titleEn: "Document Management",
    layer: "application",
    layerFa: "لایه کاربرد (Application)",
    summary:
      "کنترل چرخه حیات اسناد سازمانی شامل دریافت، اعتبارسنجی فرمت، دسته‌بندی، برچسب حساسیت و ابطال کش معنایی هنگام تغییر مخزن.",
    responsibilities: [
      "کنترل فرمت‌های مجاز (PDF, Word, Text) و جلوگیری از ورود فایل‌های ناامن",
      "اعلام تغییر مخزن اسناد جهت بررسی اعتبار و ابطال Semantic Cache",
      "مدیریت دسته‌بندی و وضعیت بازبینی هر سند",
    ],
    inputs: ["فایل خام آپلودشده", "برچسب دسته‌بندی", "دستور حذف یا ویرایش"],
    outputs: ["شناسه یکتای سند", "سیگنال ابطال Semantic Cache", "فراداده سند"],
    patternsApplied: ["Semantic Cache Invalidation", "Guardrails (اعتبارسنجی ورودی فایل)"],
    x: 680,
    y: 160,
  },
  {
    id: "doc-proc",
    order: 3,
    titleFa: "پردازش و استخراج متن",
    titleEn: "Document Processing",
    layer: "ai-core",
    layerFa: "لایه پردازش و هوش مصنوعی",
    summary:
      "تبدیل فایل‌های ناهمگون PDF و Word به متن صفحه‌بندی‌شده و قطعات معنایی (Chunks) برای تغذیه خط لوله RAG.",
    responsibilities: [
      "نرمال‌سازی کاراکترهای فارسی و حفظ دقیق شماره صفحات جهت استناد در RAG",
      "تشخیص فایل‌های اسکن‌شده یا فاقد متن قابل استخراج",
      "آماده‌سازی قطعات متنی برای ارسال به قالب‌های تحلیل",
    ],
    inputs: ["جریان باینری PDF / Word / Text"],
    outputs: ["آرایه صفحات متنی استانداردشده", "یادداشت کیفیت استخراج"],
    patternsApplied: ["RAG (مرحله Chunking و حفظ شماره صفحه)"],
    x: 680,
    y: 290,
  },
  {
    id: "ai-engine",
    order: 4,
    titleFa: "موتور تحلیل هوشمند",
    titleEn: "AI Analysis Engine",
    layer: "ai-core",
    layerFa: "لایه پردازش و هوش مصنوعی",
    summary:
      "استخراج مفاهیم اصلی، کلمات کلیدی، تاریخ‌ها، اشخاص، سازمان‌ها و روابط در قالب JSON ساختاریافته از طریق درگاه مدل.",
    responsibilities: [
      "استفاده از Prompt Template و Structured Output (JSON Schema) برای استخراج یکنواخت اطلاعات",
      "ارسال درخواست‌های تحلیلی از طریق Model Gateway و پشتیبانی از Fallback",
      "نشانه‌گذاری اسناد حقوقی و امنیتی برای بازبینی Human-in-the-Loop",
    ],
    inputs: ["صفحات متنی استخراج‌شده", "Schema خروجی استاندارد"],
    outputs: ["خروجی JSON ساختاریافته دانش", "روابط سه‌تایی مفاهیم"],
    patternsApplied: [
      "Structured Output (هسته اصلی)",
      "Model Gateway (هسته اصلی)",
      "Prompt Template",
      "Human-in-the-Loop",
    ],
    x: 420,
    y: 290,
  },
  {
    id: "search-engine",
    order: 5,
    titleFa: "موتور جستوجو و بازیابی",
    titleEn: "Search & Retrieval Engine",
    layer: "application",
    layerFa: "لایه کاربرد (Application)",
    summary:
      "بخش بازیابی (Retriever) در معماری RAG و بررسی کش معنایی پیش از فراخوانی مدل‌های هوش مصنوعی.",
    responsibilities: [
      "جستوجوی پرسش‌های مشابه در Semantic Cache همراه با کنترل تازگی نسخه اسناد",
      "بازیابی مرتبط‌ترین قطعات صفحات بر اساس تطبیق واژگانی و مفهومی",
      "رتبه‌بندی شواهد بر اساس امتیاز ارتباط و ارسال به ماژول پرسش‌وپاسخ",
    ],
    inputs: ["پرسش پالایش‌شده کاربر", "نسخه مخزن اسناد"],
    outputs: ["پاسخ کش معتبر (در صورت Hit) یا قطعات برتر اسناد"],
    patternsApplied: ["RAG Retriever (هسته اصلی)", "Semantic Cache"],
    x: 160,
    y: 160,
  },
  {
    id: "qa-module",
    order: 6,
    titleFa: "ماژول پرسش و پاسخ",
    titleEn: "Question Answering",
    layer: "application",
    layerFa: "لایه کاربرد (Application)",
    summary:
      "تنظیم چرخه RAG و Guardrails ورودی، ترکیب قطعات بازیابی‌شده در Prompt Template و ارسال به Model Gateway.",
    responsibilities: [
      "اجرای Input Guardrails برای مسدودسازی حملات Prompt Injection و ورودی‌های غیرمجاز",
      "قراردادن شواهد بازیابی‌شده و تاریخچه مکالمه در Prompt Template استاندارد",
      "مدیریت مسیر فراخوانی Model Gateway و زنجیره Fallback Model",
    ],
    inputs: ["پرسش فارسی کاربر", "تاریخچه گفت‌وگو", "قطعات بازیابی‌شده RAG"],
    outputs: ["درخواست استاندارد ارسالی به Model Gateway"],
    patternsApplied: [
      "RAG (هسته اصلی)",
      "Guardrails (هسته اصلی)",
      "Prompt Template",
      "Model Gateway (هسته اصلی)",
    ],
    x: 160,
    y: 290,
  },
  {
    id: "answer-gen",
    order: 7,
    titleFa: "تولید پاسخ و کنترل خروجی",
    titleEn: "Answer Generation & Guardrails",
    layer: "ai-core",
    layerFa: "لایه پردازش و هوش مصنوعی",
    summary:
      "دریافت خروجی از Model Gateway، اعتبارسنجی در Output Guardrails، تضمین استناد و ذخیره نتیجه در Semantic Cache.",
    responsibilities: [
      "اعمال Output Guardrails و آستانه اطمینان برای جلوگیری از توهم هوش مصنوعی",
      "تولید خروجی ساختاریافته شامل پاسخ، نام فایل، شماره صفحه و میزان اطمینان",
      "ذخیره پاسخ معتبر در Semantic Cache با برچسب نسخه مخزن اسناد",
    ],
    inputs: ["خروجی خام مدل یا شبیه‌ساز RAG", "شواهد منبع"],
    outputs: ["پاسخ ایمن و مستند فارسی", "استنادهای فایل و صفحه"],
    patternsApplied: [
      "Guardrails (هسته اصلی)",
      "Structured Output (هسته اصلی)",
      "Fallback Model",
      "Semantic Cache",
    ],
    x: 160,
    y: 420,
  },
  {
    id: "database",
    order: 8,
    titleFa: "پایگاه داده اسناد و فراداده",
    titleEn: "Document Database",
    layer: "storage",
    layerFa: "لایه داده (Storage)",
    summary:
      "ذخیره‌سازی پایدار اسناد، متن صفحات، وضعیت بازبینی انسانی، گزارش‌های Guardrails و سوابق فعالیت.",
    responsibilities: [
      "نگهداری اسناد، صفحات، دسته‌بندی و وضعیت تأیید Human-in-the-Loop",
      "ثبت نسخه مخزن اسناد برای همگام‌سازی و ابطال Semantic Cache",
      "تأمین آمارهای داشبورد و گزارش ممیزی درخواست‌ها",
    ],
    inputs: ["مدل سند و صفحات", "رکوردهای تأیید انسانی و ممیزی"],
    outputs: ["رکوردهای اسناد", "گزارش‌های آماری داشبورد"],
    patternsApplied: ["Human-in-the-Loop Audit", "Semantic Cache Versioning"],
    x: 680,
    y: 420,
  },
  {
    id: "knowledge-repo",
    order: 9,
    titleFa: "مخزن دانش و گراف ارتباطات",
    titleEn: "Knowledge Repository",
    layer: "storage",
    layerFa: "لایه داده (Storage)",
    summary:
      "نگهداری خروجی‌های Structured Output شامل گره‌های دانش (مفاهیم، اشخاص، سازمان‌ها، موضوعات) و شاخص‌های RAG.",
    responsibilities: [
      "ذخیره گراف دانش تولیدشده از خروجی‌های JSON ساختاریافته",
      "به‌روزرسانی شاخص بازیابی RAG هنگام افزودن یا تأیید اسناد جدید",
      "کشف ارتباطات میان‌سندی در گراف دانش سازمانی",
    ],
    inputs: ["خروجی Structured Output موتور تحلیل", "تأییدهای انسانی"],
    outputs: ["ساختار گراف دانش (Nodes & Edges)", "شاخص‌های بازیابی RAG"],
    patternsApplied: ["RAG Knowledge Store (هسته اصلی)", "Structured Output Consumer"],
    x: 420,
    y: 420,
  },
];

export interface ArchitectureFlow {
  from: string;
  to: string;
  label: string;
}

export const ARCHITECTURE_FLOWS: ArchitectureFlow[] = [
  { from: "ui", to: "doc-mgmt", label: "۱. ارسال سند" },
  { from: "ui", to: "search-engine", label: "۲. جستوجو" },
  { from: "ui", to: "qa-module", label: "۳. پرسش کاربر" },
  { from: "doc-mgmt", to: "doc-proc", label: "۴. استخراج متن" },
  { from: "doc-proc", to: "ai-engine", label: "۵. متن صفحه‌بندی" },
  { from: "ai-engine", to: "knowledge-repo", label: "۶. Structured Output" },
  { from: "doc-mgmt", to: "database", label: "۷. ثبت سند و نسخه کش" },
  { from: "search-engine", to: "knowledge-repo", label: "۸. بازیابی RAG" },
  { from: "qa-module", to: "search-engine", label: "۹. کش و شواهد" },
  { from: "qa-module", to: "answer-gen", label: "۱۰. Gateway + Prompt" },
  { from: "answer-gen", to: "ui", label: "۱۱. Guardrails + پاسخ مستند" },
];

export interface ScenarioStepSpec {
  step: number;
  title: string;
  actor: string;
  component: string;
  patternInvolved: string;
  description: string;
  technicalPayload: string;
}

export const EXECUTION_SCENARIO_STEPS: ScenarioStepSpec[] = [
  {
    step: 1,
    title: "ورود و احراز هویت کاربر در سامانه",
    actor: "پژوهشگر / مدیر سازمان",
    component: "رابط کاربری + لایه کنترل دسترسی (RBAC)",
    patternInvolved: "Guardrails (Access Policy)",
    description:
      "کاربر وارد داشبورد DocuMind AI می‌شود و سطح دسترسی مجاز وی برای پرسش‌وپاسخ و بازبینی اسناد تعیین می‌گردد.",
    technicalPayload: '{ user: "دکتر سهراب فرهادی", clearance: "Internal", hitlReviewer: true }',
  },
  {
    step: 2,
    title: "انتخاب و بارگذاری سند PDF",
    actor: "کاربر",
    component: "رابط کاربری و مدیریت اسناد",
    patternInvolved: "Input Validation + Cache Invalidation",
    description:
      "کاربر سند PDF سازمانی را بارگذاری می‌کند؛ مدیریت اسناد فرمت فایل را بررسی و نسخه مخزن اسناد را برای ابطال کش معنایی به‌روز می‌کند.",
    technicalPayload: '{ fileName: "architecture-1404.pdf", sizeKB: 1840, corpusVersion: "v7" }',
  },
  {
    step: 3,
    title: "استخراج متن و قطعه‌بندی صفحه‌محور",
    actor: "DocumentProcessingService",
    component: "لایه پردازش و استخراج متن",
    patternInvolved: "RAG (Chunking & Page Indexing)",
    description:
      "متن صفحات استخراج، نرمال‌سازی و با حفظ دقیق شماره صفحات جهت بازیابی و استناد در RAG آماده می‌شود.",
    technicalPayload: '{ pagesCount: 3, preservedPageNumbers: [1, 2, 3], status: "chunked" }',
  },
  {
    step: 4,
    title: "استخراج دانش ساختاریافته از طریق درگاه مدل",
    actor: "AIAnalysisEngine",
    component: "موتور تحلیل هوشمند",
    patternInvolved: "Model Gateway + Prompt Template + Structured Output",
    description:
      "متن سند با Prompt Template به Model Gateway ارسال و خروجی در قالب JSON Schema (موضوع، کلمات کلیدی، تاریخ‌ها، اشخاص، سازمان‌ها و روابط) دریافت می‌شود.",
    technicalPayload: '{ schema: "DocumentAnalysisJSON", entities: 6, relations: 3 }',
  },
  {
    step: 5,
    title: "کنترل حساسیت و بازبینی انسانی (در صورت نیاز)",
    actor: "کارشناس دامنه (در اسناد حساس)",
    component: "پایگاه داده و صف Human-in-the-Loop",
    patternInvolved: "Human-in-the-Loop + Structured Output",
    description:
      "برای اسناد حساس حقوقی یا امنیتی، خروجی ساختاریافته در اختیار کارشناس قرار می‌گیرد تا صحت موجودیت‌ها را تأیید کند و سپس در گراف دانش ثبت شود.",
    technicalPayload: '{ sensitiveCategory: false, knowledgeGraphUpdated: true }',
  },
  {
    step: 6,
    title: "پرسش کاربر و بررسی کش و حفاظ ورودی",
    actor: "کاربر + SearchAndCacheLayer",
    component: "ماژول پرسش و پاسخ",
    patternInvolved: "Guardrails (Input) + Semantic Cache",
    description:
      "پرسش فارسی از نظر تزریق پرامپت بررسی شده و سپس Semantic Cache با تطبیق نسخه مخزن چک می‌شود؛ به دلیل تغییر مخزن (سند جدید)، RAG تازه اجرا می‌گردد.",
    technicalPayload: 'InputGuardrail: PASS -> SemanticCache: MISS (corpusVersion changed)',
  },
  {
    step: 7,
    title: "بازیابی RAG، ارسال با Prompt Template و Fallback",
    actor: "RAG + ModelGateway",
    component: "موتور جستوجو و درگاه مدل",
    patternInvolved: "RAG + Prompt Template + Model Gateway + Fallback Model",
    description:
      "قطعات مرتبط با شماره صفحه بازیابی شده، در Prompt Template قرار می‌گیرند و از طریق Model Gateway (با پشتیبانی Fallback Model در خطا) پردازش می‌شوند.",
    technicalPayload: 'topChunks: 3 -> PromptTemplate -> ModelGateway("gemini-4-hydrogen")',
  },
  {
    step: 8,
    title: "اعتبارسنجی خروجی و نمایش پاسخ مستند",
    actor: "AnswerGenerationModule",
    component: "ماژول کنترل خروجی و رابط کاربری",
    patternInvolved: "Guardrails (Output) + Structured Output + Semantic Cache",
    description:
      "Output Guardrails وجود استناد و آستانه اطمینان را تأیید می‌کند؛ پاسخ همراه با نام فایل و شماره صفحه نمایش داده شده و در Semantic Cache ذخیره می‌گردد.",
    technicalPayload: '{ confidence: 93%, citation: "architecture-1404.pdf · صفحه ۱", cached: true }',
  },
];

export interface ArchCriterionRow {
  criterion: string;
  monolithic: { score: number; summary: string };
  modularMonolith: { score: number; summary: string };
  microservices: { score: number; summary: string };
}

export const ARCHITECTURE_COMPARISON: ArchCriterionRow[] = [
  {
    criterion: "پیچیدگی پیاده‌سازی (سادگی بیشتر = امتیاز بالاتر)",
    monolithic: { score: 92, summary: "بسیار ساده در شروع؛ استقرار و اشکال‌زدایی تک‌فرایندی." },
    modularMonolith: {
      score: 80,
      summary: "متعادل؛ جداسازی منطقی لایه‌های RAG، Model Gateway و Guardrails بدون سربار شبکه.",
    },
    microservices: {
      score: 35,
      summary: "پیچیدگی بالا؛ نیازمند Service Discovery، تریسینگ توزیع‌شده و هماهنگی شبکه.",
    },
  },
  {
    criterion: "مقیاس‌پذیری (Scalability)",
    monolithic: { score: 45, summary: "مقیاس‌دهی کل برنامه به‌صورت یکجا حتی اگر فقط پردازش PDF گلوگاه باشد." },
    modularMonolith: {
      score: 74,
      summary: "خوب؛ امکان اجرای صف کارگر جداگانه برای پردازش سنگین اسناد و OCR.",
    },
    microservices: {
      score: 95,
      summary: "عالی؛ مقیاس‌دهی مستقل برای موتور OCR، درگاه مدل، بازیابی برداری و کش.",
    },
  },
  {
    criterion: "قابلیت نگهداری (Maintainability)",
    monolithic: { score: 40, summary: "خطر درهم‌تنیدگی کدهای پرامپت، پردازش فایل و منطق تجاری." },
    modularMonolith: {
      score: 88,
      summary: "بسیار بالا؛ درگاه مدل، قالب‌های پرامپت و حفاظ‌های ایمنی در مرزهای مشخص ایزوله هستند.",
    },
    microservices: { score: 72, summary: "کد هر سرویس کوچک است اما نگهداری قراردادهای بین‌سرویس دشوار است." },
  },
  {
    criterion: "هزینه توسعه و زیرساخت (اقتصادی‌تر = امتیاز بالاتر)",
    monolithic: { score: 90, summary: "کمترین هزینه زیرساخت، CI/CD و تیم توسعه کوچک." },
    modularMonolith: { score: 85, summary: "هزینه پایین استقرار در کنار استفاده از Semantic Cache برای کاهش هزینه توکن." },
    microservices: { score: 38, summary: "هزینه بالای DevOps، Kubernetes، پایش توزیع‌شده و تیم‌های مستقل." },
  },
  {
    criterion: "کارایی و تاخیر ارتباطی (Performance)",
    monolithic: { score: 88, summary: "فراخوانی درون‌حافظه‌ای سریع بدون تاخیر شبکه داخلی." },
    modularMonolith: {
      score: 90,
      summary: "کارایی عالی درون‌فرایندی همراه با کش معنایی و ارتباط مستقیم لایه RAG و Guardrails.",
    },
    microservices: { score: 66, summary: "سربار شبکه (RPC/HTTP) میان سرویس‌های بازیابی، درگاه مدل و گاردریل." },
  },
  {
    criterion: "قابلیت توسعه در آینده (Extensibility)",
    monolithic: { score: 42, summary: "تغییر مدل زبانی یا افزودن الگوی جدید AI کل سیستم را درگیر می‌کند." },
    modularMonolith: {
      score: 86,
      summary: "آماده مهاجرت تدریجی؛ درگاه مدل و سرویس بازیابی RAG به‌راحتی به سرویس مستقل تبدیل می‌شوند.",
    },
    microservices: {
      score: 94,
      summary: "انعطاف بالا برای پشته ناهمگون (مثلاً Python برای Agentic AI و Node برای درگاه API).",
    },
  },
];

export interface RiskItem {
  id: string;
  title: string;
  severity: "بحرانی" | "بالا" | "متوسط";
  likelihood: "بالا" | "متوسط";
  description: string;
  impact: string;
  mitigation: string[];
  patternLink: string;
}

export const RISK_ASSESSMENT_DATA: RiskItem[] = [
  {
    id: "risk-hallucination",
    title: "پاسخ اشتباه یا توهم هوش مصنوعی (AI Hallucination)",
    severity: "بحرانی",
    likelihood: "بالا",
    description:
      "مدل‌های زبانی در صورت نبود شواهد کافی ممکن است پاسخ‌های ظاهراً روان اما نادرست یا بدون ریشه در اسناد سازمان تولید کنند.",
    impact: "تصمیم‌گیری نادرست مدیریتی و کاهش اعتماد کاربران به سامانه دانش.",
    mitigation: [
      "ترکیب RAG با Prompt Template مقید جهت الزام نقل‌قول مستقیم، نام فایل و شماره صفحه",
      "اعمال Output Guardrails با آستانه اطمینان؛ در صورت امتیاز زیر ۲۵٪ پاسخ «اطلاعات ناکافی» صادر شود",
      "استفاده از Structured Output برای تفکیک اجباری متن پاسخ از آرایه استنادها",
    ],
    patternLink: "RAG + Prompt Template + Guardrails + Structured Output",
  },
  {
    id: "risk-ocr",
    title: "استخراج ناقص اطلاعات از اسناد فارسی و جداول",
    severity: "بالا",
    likelihood: "بالا",
    description:
      "اسناد PDF اسکن‌شده یا جداول پیچیده ممکن است باعث از دست رفتن بخشی از متن یا خطای استخراج موجودیت‌ها شوند.",
    impact: "ناقص‌ماندن گراف دانش و بازیابی‌نشدن بخش‌های مهم سند در جستوجو.",
    mitigation: [
      "اعمال Human-in-the-Loop برای بازبینی و اصلاح استخراج در اسناد اسکن‌شده و حقوقی",
      "نرمال‌سازی متن فارسی پیش از Chunking در RAG و ثبت یادداشت شفاف وضعیت استخراج",
      "جلوگیری از نمایه‌سازی داده‌های مخدوش با برچسب وضعیت خطا",
    ],
    patternLink: "Human-in-the-Loop + Structured Output",
  },
  {
    id: "risk-confidentiality",
    title: "نقض محرمانگی اطلاعات سازمانی، تزریق پرامپت و نشت داده",
    severity: "بحرانی",
    likelihood: "متوسط",
    description:
      "دسترسی غیرمجاز به اسناد طبقه‌بندی‌شده، افشای کلید API یا حملات Prompt Injection جهت دور زدن قوانین مدل.",
    impact: "افشای اسرار تجاری، قراردادها و نقض الزامات قانونی حاکمیت داده.",
    mitigation: [
      "متمرکزسازی کلیدهای API و ارتباطات مدل در Model Gateway سمت سرور",
      "اجرای Input Guardrails برای شناسایی و مسدودسازی الگوهای Prompt Injection",
      "پشتیبانی از کنترل دسترسی پیش از بازیابی RAG و عدم اشتراک‌گذاری Semantic Cache بین سطوح دسترسی متفاوت",
    ],
    patternLink: "Model Gateway + Guardrails + Semantic Cache Isolation",
  },
  {
    id: "risk-availability",
    title: "وابستگی به سرویس خارجی، تأخیر بالا و کهنگی کش",
    severity: "متوسط",
    likelihood: "متوسط",
    description:
      "قطع یا محدودیت نرخ مدل اصلی، تأخیر در پرسش‌های تکراری یا بازگرداندن پاسخ قدیمی پس از تغییر اسناد.",
    impact: "توقف سرویس یا دریافت اطلاعات منسوخ‌شده توسط مدیران.",
    mitigation: [
      "به‌کارگیری Fallback Model در Model Gateway برای جابه‌جایی به مدل پشتیبان",
      "استفاده از Semantic Cache همراه با مکانیزم ابطال خودکار (Invalidation) هنگام تغییر مخزن اسناد",
    ],
    patternLink: "Model Gateway + Fallback Model + Semantic Cache",
  },
];

export interface QualityAttributeSpec {
  id: string;
  nameFa: string;
  nameEn: string;
  isoCategory: string;
  targetMetric: string;
  engineeringMeasures: string[];
}

export const QUALITY_ATTRIBUTES_DATA: QualityAttributeSpec[] = [
  {
    id: "security",
    nameFa: "امنیت",
    nameEn: "Security",
    isoCategory: "ISO/IEC 25010 - Confidentiality & Integrity",
    targetMetric: "۰ افشای کلید در کلاینت · پالایش ۱۰۰٪ ورودی‌های Prompt Injection",
    engineeringMeasures: [
      "عبور انحصاری درخواست‌ها از Model Gateway سمت سرور بدون حضور کلید در مرورگر",
      "اجرای Input/Output Guardrails برای مقابله با Prompt Injection و نشت اطلاعات",
      "فیلتر سطح محرمانگی در مرحله بازیابی RAG پیش از ارسال به مدل",
    ],
  },
  {
    id: "performance",
    nameFa: "کارایی",
    nameEn: "Performance Efficiency",
    isoCategory: "ISO/IEC 25010 - Time Behaviour",
    targetMetric: "پاسخ کش معنایی < ۱۰ms · بازیابی RAG محلی < ۲۰۰ms",
    engineeringMeasures: [
      "استفاده از Semantic Cache برای پاسخ‌دهی فوری به پرسش‌های هم‌معنای پرتکرار",
      "محدودسازی پنجره زمینه در Prompt Template به ۳ تا ۴ قطعه برتر RAG",
      "استفاده از مدل سبک‌تر در زنجیره Fallback هنگام بار ترافیکی بالا",
    ],
  },
  {
    id: "extensibility",
    nameFa: "قابلیت توسعه",
    nameEn: "Extensibility / Modifiability",
    isoCategory: "ISO/IEC 25010 - Maintainability",
    targetMetric: "تعویض مدل یا افزودن قابلیت عامل‌محور بدون تغییر لایه ارائه",
    engineeringMeasures: [
      "جداسازی ارائه‌دهنده مدل از منطق تجاری به کمک Model Gateway",
      "نسخه‌بندی قالب‌های دستور در Prompt Template و Schema خروجی در Structured Output",
      "آمادگی معماری برای افزودن Agentic Planning در وظایف تحلیلی چندسندی آتی",
    ],
  },
  {
    id: "reliability",
    nameFa: "قابلیت اطمینان",
    nameEn: "Reliability",
    isoCategory: "ISO/IEC 25010 - Fault Tolerance",
    targetMetric: "مسدودسازی ۱۰۰٪ پاسخ‌های بی‌مبنا زیر آستانه ۲۵٪ · تداوم سرویس با Fallback",
    engineeringMeasures: [
      "اعمال Output Guardrails و الزام ذکر نام فایل و شماره صفحه در هر پاسخ",
      "تعبیه Fallback Model در Model Gateway هنگام خطای ۴۲۹/۵۰۳",
      "حضور Human-in-the-Loop برای جلوگیری از خطا در اسناد حساس حقوقی",
    ],
  },
  {
    id: "maintainability",
    nameFa: "نگهداری‌پذیری",
    nameEn: "Maintainability",
    isoCategory: "ISO/IEC 25010 - Modularity & Testability",
    targetMetric: "تفکیک کامل قراردادهای Schema، قالب‌های Prompt و قواعد Guardrails",
    engineeringMeasures: [
      "تعریف صریح Schema خروجی در Structured Output برای پیشگیری از خطای Parse",
      "جداسازی قالب‌های پرامپت از کدهای واسط کاربری",
      "مرزبندی ماژولار میان لایه ارائه، RAG، درگاه مدل و مخزن دانش",
    ],
  },
];

export const ACADEMIC_REFERENCES = [
  {
    id: "ref-1",
    authors: "جزوه دوم درس الگوهای طراحی نرم‌افزار",
    year: "۱۴۰۴",
    title: "الگوهای طراحی نرم‌افزارهای مبتنی بر هوش مصنوعی (AI Software Design Patterns)",
    publisher: "مجموعه دروس تخصصی مقطع دکتری مهندسی نرم‌افزار",
    relevance:
      "مرجع اصلی ۹ الگوی محوری پروژه در دو گروه قابلیت اطمینان و کنترل خروجی (۴ الگو) و مدیریت مدل و دانش (۵ الگو).",
  },
  {
    id: "ref-2",
    authors: "Lewis, P., Perez, E., Piktus, A., Petroni, F., et al.",
    year: "2020",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    publisher: "Advances in Neural Information Processing Systems (NeurIPS)",
    relevance: "مبنای علمی الگوی RAG برای اتصال موتور بازیابی به تولید پاسخ مستند و کاهش توهم.",
  },
  {
    id: "ref-3",
    authors: "Huyen, C.",
    year: "2024 / 2025",
    title: "AI Engineering: Building Applications with Foundation Models",
    publisher: "O'Reilly Media",
    relevance:
      "مرجع معماری Model Gateway، Guardrails، Structured Output، Prompt Engineering، Semantic Cache و ارزیابی خطاهای RAG.",
  },
  {
    id: "ref-4",
    authors: "Lakshmanan, V., Robinson, S., & Munn, M.",
    year: "2020",
    title: "Machine Learning Design Patterns: Solutions to Common Challenges in Data Preparation, Model Building, and MLOps",
    publisher: "O'Reilly Media",
    relevance: "الگوهای استقرار، تاب‌آوری، Fallback و Human-in-the-Loop در سامانه‌های عملیاتی هوش مصنوعی.",
  },
  {
    id: "ref-5",
    authors: "Fowler, M. & Newman, S.",
    year: "2015 / 2021",
    title: "MonolithFirst Strategy & Building Microservices (2nd Edition)",
    publisher: "Addison-Wesley / O'Reilly Media",
    relevance: "مبنای علمی مقایسه معماری یکپارچه، Modular Monolith و میکروسرویس‌ها در بخش مقایسه معماری‌ها.",
  },
  {
    id: "ref-6",
    authors: "ISO/IEC 25010",
    year: "2011 / 2023",
    title: "Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE)",
    publisher: "International Organization for Standardization",
    relevance: "چارچوب ارزیابی ویژگی‌های کیفی امنیت، کارایی، قابلیت اطمینان، نگهداری‌پذیری و توسعه‌پذیری.",
  },
  {
    id: "ref-7",
    authors: "Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (منبع تکمیلی خارج از فهرست جزوه)",
    year: "1994",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    publisher: "Addison-Wesley Professional",
    relevance:
      "مرجع صرفاً تکمیلی برای الگوهای کدنویسی شیءگرا (Strategy، Factory Method و Observer) در لایه زیرساخت پیاده‌سازی.",
  },
];
