"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Send,
  Globe2,
  LayoutTemplate,
  History as HistoryIcon,
  Wand2,
  FileText,
  RefreshCcw,
} from "lucide-react";

type Lang = "en" | "es";

type Task = {
  id: string;
  userText: string;
  aiResponse: string;
  createdAt?: string;
  language: Lang;
  mode?: string;
};

/* --------------------------
   TEMPLATE SECTIONS
--------------------------- */
const TEMPLATE_SECTIONS = [
  {
    title: "Profile & Audit Tools",
    items: [
      { text: "Audit my creator profile and tell me what to fix.", mode: "audit" },
      { text: "Give me a brand positioning statement.", mode: "positioning" },
      { text: "Write me a professional Instagram bio.", mode: "bio" },
    ],
  },
  {
    title: "Pitching & Outreach",
    items: [
      { text: "Write me a pitch email to a skincare brand.", mode: "coach" },
      { text: "Give me 5 IG DM templates to pitch brands.", mode: "coach" },
      { text: "Turn this rough pitch into a professional email.", mode: "coach" },
    ],
  },
  {
    title: "Content & Growth",
    items: [
      { text: "Give me 10 content ideas for my niche.", mode: "coach" },
      { text: "Give me a 30-day plan to land brand deals.", mode: "coach" },
      { text: "Audit my content style and tell me how to improve.", mode: "audit" },
    ],
  },
];

export default function CreatorAIManager({ email }: { email: string }) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  /* ---------------------------------------------------------
   *  Load history on mount
   * ------------------------------------------------------- */
  useEffect(() => {
    const loadHistory = async () => {
      if (!email) return;

      try {
        const res = await fetch(
          `https://app.grandeapp.com/g/api/ai/creatormanager/history?email=${encodeURIComponent(email)}`
        );

        const data = await res.json();
        if (!Array.isArray(data.history)) return;

        const cleaned = data.history
          .map((item: any) => ({
            id: String(item.id ?? crypto.randomUUID()),
            userText: item.userText,
            aiResponse: item.aiResponse,
            createdAt: item.createdAt,
            language: item.language ?? "en",
          }))
          .reverse();

        setTasks(cleaned);
      } catch (err) {
        console.error("History load failed:", err);
      }
    };

    loadHistory();
  }, [email]);

  /* ---------------------------------------------------------
   *  Auto-save DRAFTS
   * ------------------------------------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("creator_ai_draft");
    if (saved) setInput(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("creator_ai_draft", input);
  }, [input]);

  /* ---------------------------------------------------------
   *  Fetch AI Response
   * ------------------------------------------------------- */
  const fetchAI = async (text: string, mode: string = "coach") => {
    setLoading(true);

    try {
      const finalMessage =
        lang === "es"
          ? `Responde en español profesionalmente: ${text}`
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
            mode,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");

      return data.reply as string[];
    } catch {
      return [
        lang === "es"
          ? "❌ Hubo un problema. Intenta nuevamente."
          : "❌ Something went wrong. Please try again.",
      ];
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------
   *  Submit handler (supports override text + override mode)
   * ------------------------------------------------------- */
  const handleSubmit = async (override?: string, mode: string = "coach") => {
    if (loading) return;

    const userText = (override ?? input).trim();
    if (!userText) return;

    setInput("");

    const aiLines = await fetchAI(userText, mode);

    const newTask: Task = {
      id: crypto.randomUUID(),
      userText,
      aiResponse: aiLines.join("\n"),
      createdAt: new Date().toISOString(),
      language: lang,
      mode,
    };

    setTasks((prev) => [newTask, ...prev]);

    // save history
    fetch("https://app.grandeapp.com/g/api/ai/creatormanager/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
  };

  /* ---------------------------------------------------------
   *  Improve answer — ask AI to rewrite better
   * ------------------------------------------------------- */
  const improveAnswer = async (task: Task) => {
    await handleSubmit(
      `Improve this answer and make it more actionable:\n\n${task.aiResponse}`,
      "coach"
    );
  };

  /* ---------------------------------------------------------
   *  Export pitch (copy to clipboard)
   * ------------------------------------------------------- */
  const exportPitch = async (task: Task) => {
    await navigator.clipboard.writeText(task.aiResponse);
    alert("Copied to clipboard!");
  };

  /* ===================== UI ======================= */

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">

      {/* SIDEBAR */}
      <aside className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-black/40 backdrop-blur-xl p-4 shadow-xl transition-all">

        {/* header */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          <h2 className="font-semibold text-sm">AI Creator Manager</h2>
        </div>

        {/* LANGUAGE */}
        <div className="mb-4">
          <p className="text-xs mb-1 flex items-center gap-1">
            <Globe2 className="w-3 h-3" /> Language
          </p>

          <div className="inline-flex rounded-full border overflow-hidden text-xs">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 transition ${
                lang === "en" ? "bg-blue-600 text-white" : ""
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-3 py-1 transition ${
                lang === "es" ? "bg-blue-600 text-white" : ""
              }`}
            >
              ES
            </button>
          </div>
        </div>

        {/* Templates */}
        {TEMPLATE_SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="font-semibold text-xs mb-1">{section.title}</p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <button
                  key={item.text}
                  onClick={() => handleSubmit(item.text, item.mode)}
                  className="text-xs text-left px-2 py-2 rounded-lg border bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 transition"
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-auto text-[11px] opacity-60 flex gap-1">
          <HistoryIcon className="w-3 h-3" />
          Auto-saved history enabled
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex flex-col gap-4">

        {/* INPUT */}
        <section className="border rounded-xl p-4 bg-white dark:bg-black/40 backdrop-blur-xl shadow-md transition-all">

          <h1 className="text-lg font-semibold mb-2">What do you need help with?</h1>

          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: Help me write a pitch to a beauty brand..."
            className="w-full p-3 border rounded-lg text-sm dark:bg-gray-900 dark:text-white"
          />

          <div className="flex justify-between items-center mt-3">
            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? "Thinking..." : "Generate"}
            </button>
          </div>
        </section>

        {/* RESULTS */}
        <section className="space-y-4">
          {loading && (
            <div className="p-4 border rounded-xl animate-pulse bg-gray-50 dark:bg-gray-900">
              <div className="h-4 bg-gray-300 w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-300 mb-1"></div>
              <div className="h-3 bg-gray-300 w-3/4"></div>
            </div>
          )}

          {tasks.map((task) => (
            <article key={task.id} className="border rounded-xl p-4 bg-white dark:bg-black/40 backdrop-blur-xl shadow">

              <div className="text-xs text-gray-500 flex justify-between mb-2">
                <span>{task.mode === "audit" ? "Profile Audit" : "AI Response"}</span>
                {task.createdAt && <span>{new Date(task.createdAt).toLocaleString()}</span>}
              </div>

              <h2 className="font-semibold text-sm text-blue-600 dark:text-blue-300 mb-2">
                {task.userText}
              </h2>

              <ReactMarkdown className="prose dark:prose-invert">
                {task.aiResponse}
              </ReactMarkdown>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => improveAnswer(task)}
                  className="text-xs bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-gray-200"
                >
                  <RefreshCcw className="w-3 h-3" /> Improve
                </button>

                <button
                  onClick={() => exportPitch(task)}
                  className="text-xs bg-blue-100 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-200"
                >
                  <FileText className="w-3 h-3" /> Export
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
