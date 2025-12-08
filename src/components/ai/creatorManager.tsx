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

/* -------------------------------------
   TYPES
-------------------------------------- */
type Lang = "en" | "es";

interface Task {
  id: string;
  userText: string;
  aiResponse: string;
  createdAt: string;
  language: Lang;
}

interface ApiHistoryItem {
  id?: string | number;
  userText: string;
  aiResponse: string;
  createdAt?: string;
  language?: Lang;
}

/* -------------------------------------
   TEMPLATE SECTIONS
-------------------------------------- */
const TEMPLATE_SECTIONS = [
  {
    title: "Pricing & Money",
    items: [
      "Help me set my UGC rates for video, raw footage & usage rights.",
      "Audit my rates and tell me what to increase.",
      "Create a simple UGC rate card I can send to brands.",
    ],
  },
  {
    title: "Pitching & Outreach",
    items: [
      "Write me a pitch email to a skincare brand.",
      "Turn this rough pitch into a professional email.",
      "Give me 5 Instagram DM templates to pitch brands.",
    ],
  },
  {
    title: "Strategy & Growth",
    items: [
      "Give me a 30-day plan to grow & land brand deals.",
      "Audit my profile and tell me what to fix.",
      "What are the best platforms for my niche?",
    ],
  },
  {
    title: "Content Ideas",
    items: [
      "Give me 10 content ideas brands would love.",
      "Help me build a weekly content schedule.",
      "What content should I post to look premium?",
    ],
  },
];

export default function CreatorAIManager({ email }: { email: string }) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  /* -------------------------------------
      LOAD HISTORY FROM BACKEND
  -------------------------------------- */
  useEffect(() => {
    if (!email) return;

    const loadHistory = async () => {
      try {
        const res = await fetch(
          `https://app.grandeapp.com/g/api/ai/creatormanager/history?email=${encodeURIComponent(
            email
          )}`
        );

        const data = await res.json();

        if (!Array.isArray(data.history)) return;

        const cleaned: Task[] = data.history
          .map((item: ApiHistoryItem): Task => ({
            id: String(item.id ?? crypto.randomUUID()),
            userText: item.userText,
            aiResponse: item.aiResponse,
            createdAt: item.createdAt ?? new Date().toISOString(),
            language: item.language ?? "en",
          }))
          .reverse();

        setTasks(cleaned);
      } catch (error) {
        console.error("Failed loading history:", error);
      }
    };

    loadHistory();
  }, [email]);

  /* -------------------------------------
      CALL AI MANAGER API
  -------------------------------------- */
  const fetchAI = async (text: string): Promise<string> => {
    setLoading(true);

    try {
      const finalMessage =
        lang === "es"
          ? `Responde en español de forma clara y profesional: ${text}`
          : text;

      const res = await fetch(
        "https://app.grandeapp.com/g/api/ai/creatormanager",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            message: finalMessage,
            language: lang,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "AI error");

      return data.reply;
    } catch {
      return lang === "es"
        ? "❌ Hubo un problema. Intenta de nuevo más tarde."
        : "❌ Something went wrong. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------
      SAVE TASK TO DATABASE
  -------------------------------------- */
  const saveToHistory = async (task: Task) => {
    try {
      await fetch("https://app.grandeapp.com/g/api/ai/creatormanager/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          userText: task.userText,
          aiResponse: task.aiResponse,
          language: task.language,
        }),
      });
    } catch (error) {
      console.error("Failed saving task:", error);
    }
  };

  /* -------------------------------------
      MAIN SUBMIT HANDLER
  -------------------------------------- */
  const handleSubmit = async (override?: string) => {
    if (loading) return;

    const userText = (override ?? input).trim();
    if (!userText) return;

    setInput("");

    const aiText = await fetchAI(userText);

    const newTask: Task = {
      id: crypto.randomUUID(),
      userText,
      aiResponse: aiText,
      createdAt: new Date().toISOString(),
      language: lang,
    };

    setTasks((prev) => [newTask, ...prev]);
    saveToHistory(newTask);
  };

  /* -------------------------------------
      UI
  -------------------------------------- */
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">

      {/* SIDEBAR */}
      <aside className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-4 flex flex-col gap-4">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-sm">AI Creator Manager</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Smart help for pricing, pitching, strategy & content.
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
        <div className="flex items-center gap-2 text-xs font-medium mt-1">
          <LayoutTemplate className="w-4 h-4 text-blue-500" />
          One-click templates
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {TEMPLATE_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold mb-1">{section.title}</p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSubmit(item)}
                    className="text-xs text-left px-2 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 hover:border-blue-500 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <HistoryIcon className="w-3 h-3" />
          Your past tasks are saved.
        </div>
      </aside>

      {/* MAIN PANEL */}
      <main className="flex flex-col gap-4">

        {/* INPUT */}
        <section className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm">
          <h1 className="text-lg font-semibold mb-1">What do you need help with?</h1>

          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === "es"
                ? "Ejemplo: Ayúdame a escribir un pitch profesional..."
                : "Example: Help me write a professional pitch..."
            }
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <div className="mt-3 flex justify-between items-center">
            <p className="text-[11px] text-gray-500">
              Press <strong>Ctrl+Enter</strong> / <strong>Cmd+Enter</strong> to send.
            </p>

            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? (lang === "es" ? "Generando..." : "Generating...") : "Generate"}
            </button>
          </div>
        </section>

        {/* RESULTS */}
        <section className="flex-1 overflow-y-auto space-y-4">

          {/* EMPTY STATE */}
          {tasks.length === 0 && !loading && (
            <div className="border border-dashed rounded-xl p-6 text-center text-sm text-gray-500">
              No tasks yet — use a template or type your first task.
            </div>
          )}

          {/* LOADING SHIMMER */}
          {loading && (
            <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
          )}

          {/* TASKS */}
          {tasks.map((task) => (
            <article
              key={task.id}
              className="border rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm"
            >
              <div className="text-xs text-gray-500 flex justify-between mb-2">
                <span>{task.language === "es" ? "Consulta" : "Request"}</span>
                <span>{new Date(task.createdAt).toLocaleString()}</span>
              </div>

              <h2 className="font-semibold text-sm mb-2 text-blue-700">
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
