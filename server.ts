import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  // Health and capability status
  app.get("/api/health", (_req, res) => {
    const client = getGeminiClient();
    res.json({
      ok: true,
      geminiConfigured: client !== null,
      model: "gemini-4-hydrogen",
    });
  });

  // Live grounded Q&A via Gemini API
  app.post("/api/qa", async (req, res) => {
    const client = getGeminiClient();
    if (!client) {
      return res.status(503).json({
        code: "API_KEY_NOT_CONFIGURED",
        error:
          "کلید Gemini API در محیط سرور پیکربندی نشده است. برای پاسخ‌گویی بدون کلید، حالت «شبیه‌سازی RAG محلی» را انتخاب کنید.",
      });
    }

    const { question, contexts, history } = req.body as {
      question?: string;
      contexts?: Array<{ documentTitle: string; pageNumber: number; text: string }>;
      history?: Array<{ role: string; text: string }>;
    };

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "متن پرسش نمی‌تواند خالی باشد." });
    }

    const contextBlock = (contexts ?? [])
      .map(
        (c, idx) =>
          `[منبع ${idx + 1}: سند «${c.documentTitle}» - صفحه ${c.pageNumber}]\n${c.text}`
      )
      .join("\n\n---\n\n");

    const historyBlock = (history ?? [])
      .slice(-4)
      .map((h) => `${h.role === "user" ? "کاربر" : "سامانه"}: ${h.text}`)
      .join("\n");

    try {
      const response = await client.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: `سابقه گفت‌وگو:\n${historyBlock || "ندارد"}\n\nبخش‌های بازیابی‌شده از اسناد سازمانی:\n${contextBlock || "سندی یافت نشد."}\n\nپرسش کاربر:\n${question}`,
        config: {
          systemInstruction:
            "شما موتور پرسش‌وپاسخ مستند سامانه DocuMind AI هستید. پاسخ را منحصراً به زبان فارسی، با لحن دانشگاهی و دقیق، و فقط بر اساس بخش‌های بازیابی‌شده از اسناد بنویسید. اگر اطلاعات کافی در منابع نیست، صریحاً اعلام کنید اطلاعات کافی در اسناد موجود یافت نشد. همیشه به نام سند و شماره صفحه استناد کنید.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description: "پاسخ روان، ساختاریافته و مستند به زبان فارسی",
              },
              confidence: {
                type: Type.INTEGER,
                description: "میزان اطمینان پاسخ بین 0 تا 100 بر اساس میزان پوشش منابع",
              },
              citations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    documentTitle: { type: Type.STRING },
                    pageNumber: { type: Type.INTEGER },
                    quote: { type: Type.STRING },
                  },
                },
              },
              suggestedFollowUps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? "{}").trim());
      return res.json({
        mode: "live",
        model: "gemini-4-hydrogen",
        ...parsed,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطای نامشخص در ارتباط با مدل Gemini";
      return res.status(502).json({
        code: "GEMINI_UPSTREAM_ERROR",
        error: `خطا در فراخوانی Gemini API: ${message}`,
      });
    }
  });

  // Live document knowledge extraction via Gemini API
  app.post("/api/analyze", async (req, res) => {
    const client = getGeminiClient();
    if (!client) {
      return res.status(503).json({
        code: "API_KEY_NOT_CONFIGURED",
        error:
          "کلید Gemini API در سرور پیکربندی نشده است. از تحلیلگر شبیه‌سازی‌شده محلی استفاده کنید.",
      });
    }

    const { title, text } = req.body as { title?: string; text?: string };
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "متن سند برای تحلیل ارسال نشده است." });
    }

    try {
      const response = await client.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: `عنوان سند: ${title ?? "بدون عنوان"}\n\nمتن سند:\n${text.slice(0, 12000)}`,
        config: {
          systemInstruction:
            "شما موتور استخراج دانش سامانه DocuMind AI هستید. اطلاعات کلیدی سند فارسی را استخراج کرده و در قالب JSON استاندارد برگردانید.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              summary: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              dates: { type: Type.ARRAY, items: { type: Type.STRING } },
              people: { type: Type.ARRAY, items: { type: Type.STRING } },
              organizations: { type: Type.ARRAY, items: { type: Type.STRING } },
              concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
              conceptRelations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    relation: { type: Type.STRING },
                    target: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? "{}").trim());
      return res.json({ mode: "live", ...parsed });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطای نامشخص در تحلیل هوشمند سند";
      return res.status(502).json({
        code: "GEMINI_UPSTREAM_ERROR",
        error: `خطا در تحلیل سند با Gemini API: ${message}`,
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DocuMind AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
