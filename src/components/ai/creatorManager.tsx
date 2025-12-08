"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
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
const TEMPLATE_SECTIONS = [
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
   * Load history
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

        setTasks(loaded.reverse());
      } catch (err) {
        console.error("History error:", err);
      }
    };

    loadHistory();
  }, [email]);

  /* ----------------------------------------------------
   * AI Request (catch removed)
   * -------------------------------------------------- */
  const fetchAI = async (text: string, language: Lang): Promise<string> => {
    setLoading(true);

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
          language,
        }),
      }
    );

    const data = await res.json();
    setLoading(false);

    return data.reply;
  };

  /* ----------------------------------------------------
   * Save History
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
      console.error("Save history error:", err);
    }
  };

  /* ----------------------------------------------------
   * Submit request
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
   * UI
   * -------------------------------------------------- */
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
      {/* SIDEBAR */}
      <aside className="border rounded-xl bg-white dark:bg-gray-900 p-4 flex flex-col gap-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-sm">AI Creator Manager</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Pricing, pitching, strategy & content — English or Spanish.
          </p>
        </div>

        {/* Language toggle */}
        <div>
          <p className="text-xs font-medium mb-1 flex items-center gap-1">
            <Globe2 className="w-3 h-3" /> Language
          </p>

          <div className="inline-flex rounded-full border overflow-hidden text-xs">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 ${
                lang === "en" ? "bg-blue-600 text-white" : ""
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-3 py-1 ${
                lang === "es" ? "bg-blue-600 text-white" : ""
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
              <p className="text-xs font-semibold mb-1">{section.title}</p>
              {section.items.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSubmit(item)}
                  className="text-xs text-left px-2 py-2 rounded-lg border bg-gray-50 hover:border-blue-500"
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-1">
          <HistoryIcon className="w-3 h-3" />
          Your last answers are saved automatically.
        </div>
      </aside>

      {/* MAIN PANEL */}
      <main className="flex flex-col gap-4">
        {/* Input */}
        <section className="border rounded-xl p-4 bg-white dark:bg-gray-900">
          <h1 className="text-lg font-semibold mb-1">What do you need help with?</h1>

          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "es" ? "Escribe tu pregunta aquí..." : "Type your request..."}
            className="w-full p-3 border rounded-lg bg-gray-50"
          />

          <div className="mt-3 flex justify-between">
            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Thinking..." : "Generate"}
            </button>
          </div>
        </section>

        {/* Results */}
        <section className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-xl p-4 bg-white dark:bg-gray-900"
            >
              <h2 className="font-semibold text-sm mb-2 text-blue-700">
                {task.userText}
              </h2>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{task.aiResponse}</ReactMarkdown>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
