import {
  EnterpriseDocument,
  SystemActivityItem,
} from "../types/documind";

export const INITIAL_DOCUMENTS: EnterpriseDocument[] = [
  {
    id: "doc-101",
    title: "سند معماری کلان تحول دیجیتال و هوش مصنوعی سازمانی",
    fileName: "digital-transformation-architecture-1404.pdf",
    fileType: "PDF",
    sizeKB: 1840,
    uploadedAt: "۱۴۰۴/۰۸/۱۲",
    category: "معماری و فناوری",
    status: "تحلیل‌شده",
    author: "دکتر سهراب فرهادی",
    isSimulatedExtraction: false,
    pages: [
      {
        pageNumber: 1,
        content:
          "چشم‌انداز تحول دیجیتال سازمان در افق ۱۴۰۴ بر یکپارچه‌سازی مخازن دانش، استقرار سامانه تحلیل هوشمند اسناد و کاهش وابستگی به جستوجوی دستی استوار است. کمیته راهبری فناوری اطلاعات به سرپرستی دکتر سهراب فرهادی و همکاری پژوهشگاه فناوری اطلاعات، معماری ماژولار را به عنوان الگوی مرجع تصویب کرده است.",
      },
      {
        pageNumber: 2,
        content:
          "در لایه پردازش اسناد، تمامی فایل‌های PDF و Word باید از طریق مبدل‌های استاندارد متنی استخراج و به قطعات معنایی (Semantic Chunks) تقسیم شوند. موتور جستوجوی هیبریدی با ترکیب الگوریتم TF-IDF و بردارهای معنایی، بازیابی دقیق اطلاعات را در کمتر از ۸۰۰ میلی‌ثانیه تضمین می‌کند.",
      },
      {
        pageNumber: 3,
        content:
          "مخزن دانش سازمانی وظیفه نگهداری گراف ارتباطات میان اشخاص، سازمان‌ها، پروژه‌ها و مفاهیم کلیدی را بر عهده دارد. این ساختار به مدیران کمک می‌کند ریسک‌های تکراری پروژه‌ها را شناسایی کرده و تصمیم‌گیری مبتنی بر شواهد (Evidence-Based Decision Making) را جایگزین حدس و گمان نمایند.",
      },
    ],
    analysis: {
      topic: "معماری سامانه دانش سازمانی و تحول دیجیتال",
      summary:
        "این سند نقشه راه استقرار زیرساخت تحلیل اسناد، بازیابی ترکیبی دانش و یکپارچه‌سازی گراف دانش در افق ۱۴۰۴ را با محوریت معماری ماژولار تبیین می‌کند.",
      keywords: [
        "تحول دیجیتال",
        "مخزن دانش",
        "معماری ماژولار",
        "جستوجوی هیبریدی",
        "گراف دانش",
        "تصمیم‌گیری مبتنی بر شواهد",
      ],
      keywordStats: [
        { term: "معماری ماژولار", count: 8, weight: 94 },
        { term: "مخزن دانش", count: 7, weight: 88 },
        { term: "جستوجوی هیبریدی", count: 5, weight: 82 },
        { term: "تحول دیجیتال", count: 6, weight: 79 },
        { term: "گراف دانش", count: 4, weight: 74 },
      ],
      dates: ["۱۴۰۴/۰۸/۱۲", "افق ۱۴۰۴"],
      people: ["دکتر سهراب فرهادی"],
      organizations: ["کمیته راهبری فناوری اطلاعات", "پژوهشگاه فناوری اطلاعات"],
      concepts: [
        "معماری ماژولار",
        "جستوجوی هیبریدی",
        "قطعات معنایی",
        "گراف دانش سازمانی",
      ],
      conceptRelations: [
        {
          source: "معماری ماژولار",
          relation: "پشتیبانی می‌کند از",
          target: "مخزن دانش",
        },
        {
          source: "جستوجوی هیبریدی",
          relation: "ترکیب می‌کند",
          target: "TF-IDF و بردارهای معنایی",
        },
        {
          source: "گراف دانش سازمانی",
          relation: "منجر می‌شود به",
          target: "تصمیم‌گیری مبتنی بر شواهد",
        },
      ],
      strategyUsed: "semantic",
      isSimulated: false,
    },
  },
  {
    id: "doc-102",
    title: "آیین‌نامه امنیت اطلاعات، حریم خصوصی و کنترل دسترسی اسناد",
    fileName: "infosec-access-policy-v3.pdf",
    fileType: "PDF",
    sizeKB: 1290,
    uploadedAt: "۱۴۰۴/۰۸/۱۵",
    category: "حکمرانی و امنیت",
    status: "تحلیل‌شده",
    author: "مهندس مریم کاظمی",
    isSimulatedExtraction: false,
    pages: [
      {
        pageNumber: 1,
        content:
          "هدف از تدوین آیین‌نامه امنیت اطلاعات، حفاظت از محرمانگی، تمامیت و دسترس‌پذیری اسناد سازمانی در سامانه‌های هوش مصنوعی است. کلیه اسناد پیش از نمایه‌سازی باید بر اساس سطوح محرمانگی (عادی، داخلی، محرمانه، سری) برچسب‌گذاری شوند و دسترسی به مخزن دانش صرفاً از طریق کنترل دسترسی مبتنی بر نقش (RBAC) انجام پذیرد.",
      },
      {
        pageNumber: 2,
        content:
          "ارسال مستقیم اسناد طبقه‌بندی‌شده «محرمانه» و «سری» به مدل‌های زبانی عمومی ابری بدون ناشناس‌سازی (Data Masking) اکیداً ممنوع است. واحد امنیت سایبری به مدیریت مهندس مریم کاظمی موظف است ممیزی ثبت وقایع (Audit Log) پرسش‌ها و پاسخ‌های کاربران را به‌صورت هفتگی بررسی کند.",
      },
      {
        pageNumber: 3,
        content:
          "رمزنگاری داده‌های در حال ذخیره با استاندارد AES-256 و رمزنگاری ارتباطات با TLS 1.3 الزامی است. همچنین به منظور مقابله با حملات تزریق پرامپت (Prompt Injection)، کلیه ورودی‌های کاربران باید پیش از ارسال به موتور پرسش‌وپاسخ پالایش و اعتبارسنجی شوند.",
      },
    ],
    analysis: {
      topic: "امنیت اطلاعات، RBAC و حاکمیت داده در سامانه‌های AI",
      summary:
        "این آیین‌نامه الزامات طبقه‌بندی اسناد، کنترل دسترسی مبتنی بر نقش (RBAC)، جلوگیری از نشت داده به مدل‌های ابری، رمزنگاری و مقابله با Prompt Injection را مشخص می‌سازد.",
      keywords: [
        "امنیت اطلاعات",
        "RBAC",
        "محرمانگی",
        "AES-256",
        "Prompt Injection",
        "ناشناس‌سازی داده",
      ],
      keywordStats: [
        { term: "امنیت اطلاعات", count: 9, weight: 96 },
        { term: "RBAC", count: 6, weight: 89 },
        { term: "محرمانگی", count: 7, weight: 85 },
        { term: "Prompt Injection", count: 4, weight: 80 },
        { term: "AES-256", count: 3, weight: 71 },
      ],
      dates: ["۱۴۰۴/۰۸/۱۵"],
      people: ["مهندس مریم کاظمی"],
      organizations: ["واحد امنیت سایبری"],
      concepts: [
        "کنترل دسترسی مبتنی بر نقش",
        "ناشناس‌سازی داده",
        "مقابله با تزریق پرامپت",
        "ممیزی ثبت وقایع",
      ],
      conceptRelations: [
        {
          source: "کنترل دسترسی مبتنی بر نقش",
          relation: "تضمین می‌کند",
          target: "محرمانگی اسناد",
        },
        {
          source: "ناشناس‌سازی داده",
          relation: "پیشگیری می‌کند از",
          target: "نشت اطلاعات سازمانی",
        },
      ],
      strategyUsed: "semantic",
      isSimulated: false,
    },
  },
  {
    id: "doc-103",
    title: "گزارش ارزیابی دقت مدل‌های استخراج دانش و RAG فارسی",
    fileName: "persian-rag-evaluation-report.docx",
    fileType: "Word",
    sizeKB: 960,
    uploadedAt: "۱۴۰۴/۰۸/۱۸",
    category: "گزارش‌های مدیریتی",
    status: "تحلیل‌شده",
    author: "دکتر رضا نجفی",
    isSimulatedExtraction: false,
    pages: [
      {
        pageNumber: 1,
        content:
          "آزمایشگاه پردازش زبان طبیعی دانشگاه صنعتی شریف با همکاری تیم مهندسی داده سازمان، دقت روش تولید تقویت‌شده با بازیابی (RAG) را بر روی ۱۲۰۰ پرسش فارسی ارزیابی نمود. نتایج نشان داد استفاده از بازیابی هیبریدی همراه با الزام استناد به شماره صفحه، نرخ توهم هوش مصنوعی (Hallucination) را از ۲۲ درصد به کمتر از ۴/۵ درصد کاهش داده است.",
      },
      {
        pageNumber: 2,
        content:
          "چالش اصلی در اسناد اسکن‌شده فارسی، کیفیت پایین OCR در جداول و پاورقی‌ها گزارش شده است. برای رفع این مشکل، پیشنهاد می‌شود از پایپلاین دو مرحله‌ای پیش‌پردازش تصویر و اعتبارسنجی خروجی توسط ناظر انسانی (Human-in-the-Loop) برای اسناد مالی و حقوقی استفاده شود.",
      },
    ],
    analysis: {
      topic: "ارزیابی کارایی RAG فارسی و کاهش توهم مدل‌های زبانی",
      summary:
        "گزارش آزمایشگاهی درباره اثربخشی استناد اجباری به منابع در کاهش خطای توهم مدل‌های زبانی به زیر ۴/۵ درصد و ارائه راهکار برای اسناد اسکن‌شده فارسی.",
      keywords: [
        "RAG فارسی",
        "توهم هوش مصنوعی",
        "استناد به صفحه",
        "OCR",
        "پردازش زبان طبیعی",
      ],
      keywordStats: [
        { term: "RAG فارسی", count: 7, weight: 92 },
        { term: "توهم هوش مصنوعی", count: 6, weight: 87 },
        { term: "OCR", count: 5, weight: 78 },
        { term: "استناد به صفحه", count: 4, weight: 75 },
      ],
      dates: ["۱۴۰۴/۰۸/۱۸"],
      people: ["دکتر رضا نجفی"],
      organizations: ["دانشگاه صنعتی شریف", "تیم مهندسی داده"],
      concepts: [
        "تولید تقویت‌شده با بازیابی",
        "نرخ توهم مدل",
        "اعتبارسنجی انسانی",
      ],
      conceptRelations: [
        {
          source: "استناد به صفحه",
          relation: "کاهش می‌دهد",
          target: "توهم هوش مصنوعی",
        },
        {
          source: "اعتبارسنجی انسانی",
          relation: "جبران می‌کند",
          target: "خطای OCR جداول",
        },
      ],
      strategyUsed: "semantic",
      isSimulated: false,
    },
  },
  {
    id: "doc-104",
    title: "دستورالعمل قراردادهای برون‌سپاری و مالکیت معنوی نرم‌افزار",
    fileName: "outsourcing-ip-guidelines.docx",
    fileType: "Word",
    sizeKB: 745,
    uploadedAt: "۱۴۰۴/۰۸/۲۱",
    category: "قراردادها و حقوقی",
    status: "تحلیل‌شده",
    author: "سارا شریفی",
    isSimulatedExtraction: false,
    pages: [
      {
        pageNumber: 1,
        content:
          "مطابق ماده ۴ این دستورالعمل، کلیه کدهای منبع، مستندات معماری، الگوهای طراحی و مدل‌های دانش آموزش‌داده‌شده بر روی داده‌های سازمانی در پروژه‌های برون‌سپاری، متعلق به کارفرما است. پیمانکاران موظف به تحویل مخزن گیت کامل به همراه مستندات UML در پایان هر فاز هستند.",
      },
      {
        pageNumber: 2,
        content:
          "در صورت تأخیر بیش از ۱۵ روز کاری در تحویل مستندات فنی یا نقض محرمانگی داده‌های آموزشی، کارفرما حق اعمال جریمه ۱۰ درصدی و تعلیق پرداخت مرحله‌ای را دارد. نظارت حقوقی بر مفاد قراردادها بر عهده دفتر حقوقی سازمان و مهندس سارا شریفی است.",
      },
    ],
    analysis: {
      topic: "مالکیت معنوی و الزامات تحویل مستندات در قراردادهای نرم‌افزاری",
      summary:
        "تعیین حقوق مالکیت معنوی کد و مدل‌های دانش، الزام تحویل مستندات UML و جرائم نقض محرمانگی یا تأخیر پیمانکاران.",
      keywords: [
        "مالکیت معنوی",
        "قرارداد برون‌سپاری",
        "مستندات UML",
        "محرمانگی داده",
        "جریمه تأخیر",
      ],
      keywordStats: [
        { term: "مالکیت معنوی", count: 6, weight: 90 },
        { term: "مستندات UML", count: 4, weight: 77 },
        { term: "قرارداد برون‌سپاری", count: 5, weight: 84 },
        { term: "محرمانگی داده", count: 4, weight: 79 },
      ],
      dates: ["۱۴۰۴/۰۸/۲۱"],
      people: ["سارا شریفی"],
      organizations: ["دفتر حقوقی سازمان"],
      concepts: ["مالکیت معنوی نرم‌افزار", "الزامات تحویل فنی", "ضمانت اجرا"],
      conceptRelations: [
        {
          source: "قرارداد برون‌سپاری",
          relation: "الزام‌آور می‌کند",
          target: "تحویل مستندات UML",
        },
        {
          source: "نقض محرمانگی",
          relation: "منجر می‌شود به",
          target: "جریمه ۱۰ درصدی",
        },
      ],
      strategyUsed: "statistical",
      isSimulated: false,
    },
  },
  {
    id: "doc-105",
    title: "راهنمای استانداردهای کیفیت نرم‌افزار و الگوهای طراحی GoF",
    fileName: "software-quality-gof-standards.pdf",
    fileType: "PDF",
    sizeKB: 1520,
    uploadedAt: "۱۴۰۴/۰۸/۲۵",
    category: "استانداردهای کیفیت",
    status: "تحلیل‌شده",
    author: "دکتر امیرحسین مرادی",
    isSimulatedExtraction: false,
    pages: [
      {
        pageNumber: 1,
        content:
          "بر اساس استاندارد ISO/IEC 25010، سامانه‌های تحلیلی سازمانی باید در پنج بعد کلیدی امنیت، کارایی، قابلیت نگهداری، قابلیت اطمینان و توسعه‌پذیری ارزیابی شوند. استفاده از الگوهای طراحی GoF از جمله Strategy برای تعویض‌پذیری الگوریتم‌ها، Factory Method برای جداسازی فرآیند ساخت اشیا و Observer برای ارتباط رویدادمحور اجزا توصیه می‌شود.",
      },
      {
        pageNumber: 2,
        content:
          "معماری ماژولار یکپارچه (Modular Monolith) در فاز نخست توسعه نسبت به میکروسرویس‌ها هزینه عملیاتی پایین‌تر و سرعت استقرار بالاتری دارد، مشروط بر آنکه مرز میان ماژول‌ها با واسط‌های صریح (Interfaces) و الگوهای طراحی استاندارد حفظ شود تا امکان استخراج سرویس‌های مستقل در آینده وجود داشته باشد.",
      },
    ],
    analysis: {
      topic: "استاندارد ISO/IEC 25010 و به‌کارگیری الگوهای طراحی GoF",
      summary:
        "تشریح معیارهای کیفیت نرم‌افزار، نقش الگوهای Strategy، Factory Method و Observer در کاهش وابستگی، و استدلال انتخاب Modular Monolith در فاز نخست.",
      keywords: [
        "ISO/IEC 25010",
        "Strategy Pattern",
        "Factory Method",
        "Observer Pattern",
        "Modular Monolith",
      ],
      keywordStats: [
        { term: "ISO/IEC 25010", count: 5, weight: 91 },
        { term: "Strategy Pattern", count: 4, weight: 86 },
        { term: "Factory Method", count: 4, weight: 85 },
        { term: "Observer Pattern", count: 4, weight: 85 },
        { term: "Modular Monolith", count: 3, weight: 80 },
      ],
      dates: ["۱۴۰۴/۰۸/۲۵"],
      people: ["دکتر امیرحسین مرادی"],
      organizations: ["کارگروه مهندسی نرم‌افزار"],
      concepts: [
        "الگوهای طراحی GoF",
        "استاندارد کیفیت نرم‌افزار",
        "کاهش وابستگی اجزا",
      ],
      conceptRelations: [
        {
          source: "الگوهای طراحی GoF",
          relation: "افزایش می‌دهد",
          target: "قابلیت نگهداری و توسعه‌پذیری",
        },
        {
          source: "Modular Monolith",
          relation: "بهبود می‌بخشد",
          target: "هزینه توسعه و سرعت استقرار",
        },
      ],
      strategyUsed: "semantic",
      isSimulated: false,
    },
  },
  {
    id: "doc-106",
    title: "صورتجلسه کمیته راهبری داده و یکپارچه‌سازی اسناد مالی",
    fileName: "data-governance-minutes-aban.pdf",
    fileType: "PDF",
    sizeKB: 610,
    uploadedAt: "۱۴۰۴/۰۸/۲۹",
    category: "حکمرانی و امنیت",
    status: "تحلیل‌شده",
    author: "دکتر سهراب فرهادی",
    isSimulatedExtraction: false,
    pages: [
      {
        pageNumber: 1,
        content:
          "در جلسه مورخ ۱۴۰۴/۰۸/۲۹ با حضور دکتر سهراب فرهادی، مهندس مریم کاظمی و نماینده دفتر حقوقی سازمان، مقرر شد کلیه اسناد قراردادها و آیین‌نامه‌های امنیتی در سامانه DocuMind AI نمایه‌سازی شوند. همچنین مقرر گردید گزارش خطاهای استخراج متن ماهانه به واحد امنیت سایبری و تیم مهندسی داده ارسال شود.",
      },
    ],
    analysis: {
      topic: "مصوبات کمیته راهبری داده درباره نمایه‌سازی و پایش خطاها",
      summary:
        "تصویب نمایه‌سازی متمرکز قراردادها و آیین‌نامه‌ها در DocuMind AI و گزارش‌دهی ماهانه خطاهای استخراج متن به واحدهای امنیت و مهندسی داده.",
      keywords: [
        "کمیته راهبری داده",
        "نمایه‌سازی اسناد",
        "گزارش خطا",
        "DocuMind AI",
      ],
      keywordStats: [
        { term: "کمیته راهبری داده", count: 4, weight: 88 },
        { term: "نمایه‌سازی اسناد", count: 4, weight: 83 },
        { term: "گزارش خطا", count: 3, weight: 74 },
      ],
      dates: ["۱۴۰۴/۰۸/۲۹"],
      people: ["دکتر سهراب فرهادی", "مهندس مریم کاظمی"],
      organizations: [
        "کمیته راهبری فناوری اطلاعات",
        "دفتر حقوقی سازمان",
        "واحد امنیت سایبری",
        "تیم مهندسی داده",
      ],
      concepts: ["حکمرانی داده", "پایش کیفیت استخراج"],
      conceptRelations: [
        {
          source: "کمیته راهبری فناوری اطلاعات",
          relation: "تصویب کرد",
          target: "نمایه‌سازی در DocuMind AI",
        },
      ],
      strategyUsed: "statistical",
      isSimulated: false,
    },
  },
];

export const INITIAL_ACTIVITIES: SystemActivityItem[] = [
  {
    id: "act-1",
    user: "دکتر سهراب فرهادی",
    action: "ثبت و تحلیل صورتجلسه جدید",
    target: "صورتجلسه کمیته راهبری داده",
    timestamp: "۱۰ دقیقه پیش",
    category: "upload",
  },
  {
    id: "act-2",
    user: "مهندس مریم کاظمی",
    action: "پرسش درباره الزامات رمزنگاری",
    target: "آیین‌نامه امنیت اطلاعات (صفحه ۳)",
    timestamp: "۳۵ دقیقه پیش",
    category: "qa",
  },
  {
    id: "act-3",
    user: "دکتر رضا نجفی",
    action: "اجرای جستوجوی مفهومی",
    target: "کاهش توهم هوش مصنوعی در RAG",
    timestamp: "۲ ساعت پیش",
    category: "search",
  },
  {
    id: "act-4",
    user: "دکتر امیرحسین مرادی",
    action: "به‌روزرسانی گراف دانش الگوها",
    target: "استاندارد ISO/IEC 25010 و GoF",
    timestamp: "۵ ساعت پیش",
    category: "analysis",
  },
  {
    id: "act-5",
    user: "سارا شریفی",
    action: "بررسی مفاد مالکیت معنوی",
    target: "دستورالعمل قراردادهای برون‌سپاری",
    timestamp: "دیروز",
    category: "qa",
  },
];

export const WEEKLY_ACTIVITY_SERIES = [
  { day: "شنبه", uploads: 4, analyses: 4, queries: 19 },
  { day: "یکشنبه", uploads: 7, analyses: 6, queries: 28 },
  { day: "دوشنبه", uploads: 5, analyses: 5, queries: 34 },
  { day: "سه‌شنبه", uploads: 9, analyses: 8, queries: 42 },
  { day: "چهارشنبه", uploads: 6, analyses: 6, queries: 37 },
  { day: "پنجشنبه", uploads: 3, analyses: 3, queries: 21 },
  { day: "امروز", uploads: 6, analyses: 6, queries: 31 },
];
