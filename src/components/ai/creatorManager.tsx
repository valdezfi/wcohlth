"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Send,
  Globe2,
  LayoutTemplate,
  History as HistoryIcon,
} from "lucide-react";

type Lang = "en" | "es";

type Task = {
  id: string;
  userText: string;
  aiResponse: string;
  createdAt?: string;
  language?: Lang;
};

type HistoryItemFromApi = {
  id?: string | number;
  userText: string;
  aiResponse: string;
  createdAt?: string;
  language?: Lang;
};

// Sidebar templates
const TEMPLATE_SECTIONS: {
  title: string;
  items: string[];
}[] = [
  {
    title: "Pricing & Money",
    items: [
      "Help me set my UGC rates for short-form video, raw footage, and usage rights.",
      "Audit my current rates and tell me what to increase or decrease.",
      "Create a simple rate card I can send to brands.",
    ],
  },
  {
    title: "Pitching & Outreach",
    items: [
      "Write a pitch email to a skincare brand introducing myself as a UGC creator.",
      "Turn this rough pitch into a professional email that converts brands.",
      "Give me 5 DM templates I can use to pitch brands on Instagram.",
    ],
  },
  {
    title: "Strategy & Growth",
    items: [
      "Give me a 30-day plan to grow as a creator and start landing paid deals.",
      "Audit my creator profile and tell me what to fix to look more professional.",
      "What are the best platforms and strategies for my niche to get collabs?",
    ],
  },
  {
    title: "Content Ideas",
    items: [
      "Give me 10 content ideas brands would love in my niche.",
      "Help me plan a weekly content schedule to attract better brand deals.",
      "What kind of content should I post to position myself as a premium creator?",
    ],
  },
];

export default function CampaignAIChat({ email }: { email: string }) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  /* ----------------------------------------------------
   *  Load history from backend (per creator)
   *  GET https://app.grandeapp.com/g/api/ai/creatormanager/history?email=...
   * -------------------------------------------------- */
  useEffect(() => {
    const loadHistory = async () => {
      if (!email) return;
      try {
        const res = await fetch(
          `https://app.grandeapp.com/g/api/ai/creatormanager/history?email=${encodeURIComponent(
            email
          )}`
        );
        if (!res.ok) return;

        const data = await res.json();
        if (!data.history || !Array.isArray(data.history)) return;

        const loaded: Task[] = data.history.map((item: HistoryItemFromApi) => ({
          id: String(item.id ?? crypto.randomUUID()),
          userText: item.userText,
          aiResponse: item.aiResponse,
          createdAt: item.createdAt,
          language: item.language ?? "en",
        }));

        // Newest first
        setTasks(loaded.reverse());
      } catch (err) {
        console.error("Error loading AI history:", err);
      }
    };

    loadHistory();
  }, [email]);

  /* ----------------------------------------------------
   *  Call AI manager
   *  POST https://app.grandeapp.com/g/api/ai/creatormanager
   * -------------------------------------------------- */
  const fetchAI = async (text: string, language: Lang): Promise<string> => {
    setLoading(true);
    try {
      const finalMessage =
        language === "es"
          ? `Responde en español de forma clara y profesional. ${text}`
          : text;

      const res = await fetch(
        "https://app.grandeapp.com/g/api/ai/creatormanager",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            message: finalMessage,
            language, // optional, if your backend wants it
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI error");
      return data.reply as string;
    } catch (err: any) {
      console.error("AI manager error:", err);
      return "❌ Hubo un problema contactando a tu AI Manager. Intenta de nuevo en unos segundos.";
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------
   *  Save task to history (DB)
   *  POST https://app.grandeapp.com/g/api/ai/creatormanager/history
   * -------------------------------------------------- */
  const saveTaskToHistory = async (task: Task, language: Lang) => {
    try {
      await fetch(
        "https://app.grandeapp.com/g/api/ai/creatormanager/history",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userText: task.userText,
            aiResponse: task.aiResponse,
            language,
          }),
        }
      );
    } catch (err) {
      console.error("Error saving AI history:", err);
    }
  };

  /* ----------------------------------------------------
   *  Main submit (from textarea OR one-click template)
   * -------------------------------------------------- */
  const handleSubmit = async (overrideText?: string) => {
    if (loading) return;

    const userText = (overrideText ?? input).trim();
    if (!userText) return;

    setInput("");

    const aiText = await fetchAI(userText, lang);

    const newTask: Task = {
      id: crypto.randomUUID(),
      userText,
      aiResponse: aiText,
      language: lang,
    };

    setTasks((prev) => [newTask, ...prev]);
    saveTaskToHistory(newTask, lang);
  };

  /* ----------------------------------------------------
   *  UI
   * -------------------------------------------------- */
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[260px,minmax(0,1fr)] gap-6">
      {/* SIDEBAR */}
      <aside className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-4 flex flex-col gap-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-sm">AI Creator Manager</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Get help with pricing, pitching, strategy & content — in English or
            Spanish.
          </p>
        </div>

        {/* Language toggle */}
        <div>
          <p className="text-xs font-medium mb-1 flex items-center gap-1">
            <Globe2 className="w-3 h-3" /> Language / Idioma
          </p>
          <div className="inline-flex rounded-full border border-gray-300 dark:border-gray-600 overflow-hidden text-xs">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 ${
                lang === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-3 py-1 ${
                lang === "es"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
              }`}
            >
              ES
            </button>
          </div>
        </div>

        {/* Templates */}
        <div className="flex items-center gap-2 text-xs font-medium mt-1 mb-1">
          <LayoutTemplate className="w-4 h-4 text-blue-500" />
          One-click templates
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {TEMPLATE_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {section.title}
              </p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSubmit(item)}
                    className="text-xs text-left px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* History hint */}
        <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <HistoryIcon className="w-3 h-3" />
          Your last answers are saved and loaded automatically.
        </div>
      </aside>

      {/* MAIN PANEL */}
      <main className="flex flex-col gap-4">
        {/* Input card */}
        <section className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm">
          <h1 className="text-lg font-semibold mb-1">
            What do you want help with right now?
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Describe the task like you would talk to your manager. For example:
            “Help me write a pitch to a skincare brand offering UGC” or “Fix my
            rate card so I charge more professionally.”
          </p>

          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === "es"
                ? "Ejemplo: Ayúdame a escribir un mensaje profesional para una marca de maquillaje..."
                : "Example: Help me write a professional pitch for a beauty brand..."
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm dark:bg-gray-800 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Tip: Press <span className="font-semibold">Ctrl+Enter</span> /{" "}
              <span className="font-semibold">Cmd+Enter</span> to send.
            </p>
            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading
                ? lang === "es"
                  ? "Pensando..."
                  : "Thinking..."
                : lang === "es"
                ? "Generar"
                : "Generate"}
            </button>
          </div>
        </section>

        {/* Tasks / results */}
        <section className="flex-1 space-y-4 overflow-y-auto">
          {tasks.length === 0 && !loading && (
            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No tasks yet. Use a template on the left or describe what you need
              — pricing help, pitch writing, strategy, content ideas, or
              negotiation.
            </div>
          )}

          {tasks.map((task) => (
            <article
              key={task.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex justify-between">
                <span>
                  {task.language === "es" ? "Consulta" : "Request"}
                </span>
                {task.createdAt && (
                  <span>
                    {new Date(task.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>

              <h2 className="font-semibold text-sm mb-2 text-blue-700 dark:text-blue-300">
                {task.userText}
              </h2>

              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{task.aiResponse}</ReactMarkdown>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
