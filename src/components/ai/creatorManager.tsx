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
   COPY / EXPORT / IMPROVE HELPERS
-------------------------------------- */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  } catch {
    alert("Copy failed.");
  }
};

const exportTextFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

const improveAnswer = async (
  task: Task,
  lang: Lang,
  fetchAI: (prompt: string) => Promise<string>,
  pushTask: (t: Task) => void
) => {
  const prompt =
    lang === "es"
      ? `Mejora esta respuesta. Hazla más clara y profesional:\n\n${task.aiResponse}`
      : `Improve this answer. Make it more clear and professional:\n\n${task.aiResponse}`;

  const improved = await fetchAI(prompt);

  const newTask: Task = {
    id: crypto.randomUUID(),
    userText: lang === "es" ? "Mejorar respuesta" : "Improve answer",
    aiResponse: improved,
    createdAt: new Date().toISOString(),
    language: lang,
  };

  pushTask(newTask);
};

/* -------------------------------------
   TEXT DICTIONARY
-------------------------------------- */
const T = {
  en: {
    managerTitle: "AI Creator Manager",
    managerDesc: "Smart help for pricing, pitching, strategy & content.",
    language: "Language",
    templates: "One-click templates",
    saved: "Your past tasks are saved.",
    inputTitle: "What do you need help with?",
    inputDesc: "Describe the task like you are talking to a manager.",
    inputPlaceholder: "Example: Help me write a professional pitch...",
    sendTip: "Press Ctrl+Enter / Cmd+Enter to send.",
    generating: "Generating...",
    generate: "Generate",
    empty: "No tasks yet — use a template or type your first request.",
    request: "Request",
    copy: "Copy",
    export: "Export",
    improve: "Improve",
  },
  es: {
    managerTitle: "AI Manager de Creadores",
    managerDesc:
      "Asistencia inteligente para precios, pitching, estrategia y contenido.",
    language: "Idioma",
    templates: "Plantillas rápidas",
    saved: "Tus tareas anteriores se guardan automáticamente.",
    inputTitle: "¿Con qué necesitas ayuda?",
    inputDesc:
      "Describe la tarea como si estuvieras hablando con tu representante.",
    inputPlaceholder: "Ejemplo: Ayúdame a escribir un pitch profesional...",
    sendTip: "Presiona Ctrl+Enter / Cmd+Enter para enviar.",
    generating: "Generando...",
    generate: "Generar",
    empty: "Aún no hay tareas — usa una plantilla o escribe tu primera solicitud.",
    request: "Consulta",
    copy: "Copiar",
    export: "Exportar",
    improve: "Mejorar",
  },
};

/* -------------------------------------
   TEMPLATE SECTIONS (BILINGUAL)
-------------------------------------- */

const TEMPLATE_SECTIONS = {
  en: [
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
    {
      title: "Media Kit",
      items: [
        "Create a full media kit template for my niche.",
        "Write a professional creator bio for my media kit.",
        "Generate a case study section for my media kit.",
        "Help me design a clean portfolio layout for brands.",
      ],
    },
    {
      title: "Legal & Contracts",
      items: [
        "Create a UGC contract template with usage rights.",
        "Write a sponsored post agreement for brands.",
        "Create a revision policy I can send to clients.",
        "Write a professional invoice template for creators.",
        "Create a content rights licensing agreement.",
        "Write a talent release form for UGC shoots.",
      ],
    },
  ],

  es: [
    {
      title: "Precios y Dinero",
      items: [
        "Ayúdame a definir mis tarifas UGC.",
        "Audita mis tarifas y dime qué aumentar.",
        "Crea una tarjeta de tarifas profesional.",
      ],
    },
    {
      title: "Pitching y Alcance",
      items: [
        "Escríbeme un email de pitch profesional.",
        "Convierte este pitch básico en uno profesional.",
        "Dame 5 plantillas de DM para contactar marcas.",
      ],
    },
    {
      title: "Estrategia y Crecimiento",
      items: [
        "Dame un plan de 30 días para crecer.",
        "Audita mi perfil y dime qué mejorar.",
        "¿Cuáles son las mejores plataformas para mi nicho?",
      ],
    },
    {
      title: "Ideas de Contenido",
      items: [
        "Dame 10 ideas de contenido que gusten a marcas.",
        "Ayúdame a crear un calendario semanal.",
        "¿Qué contenido debo publicar para verme premium?",
      ],
    },
    {
      title: "Media Kit",
      items: [
        "Créame una plantilla completa de media kit.",
        "Escribe una biografía profesional para mi media kit.",
        "Genera una sección de casos de estudio.",
        "Ayúdame a diseñar un portafolio limpio para marcas.",
      ],
    },
    {
      title: "Legal & Contratos",
      items: [
        "Crea un contrato UGC con derechos de uso.",
        "Escribe un acuerdo de colaboración patrocinada.",
        "Crea una política de revisiones profesional.",
        "Escribe una plantilla de factura para creadores.",
        "Crea un acuerdo de licencias y derechos de contenido.",
        "Escribe un formulario de autorización de talento.",
      ],
    },
  ],
};


export default function CreatorAIManager({ email }: { email: string }) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const t = T[lang];
  const templates = TEMPLATE_SECTIONS[lang];

  /* -------------------------------------
      PUSH NEW TASK
  -------------------------------------- */
  const pushTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
    saveHistory(task);
  };

  /* -------------------------------------
      LOAD HISTORY
  -------------------------------------- */
  useEffect(() => {
    const load = async () => {
      if (!email) return;

      try {
        const res = await fetch(
          `https://app.cohlth.com/g/api/ai/creatormanager/history?email=${email}`
        );
        const data = await res.json();

        if (!Array.isArray(data.history)) return;

        const cleaned: Task[] = data.history
          .map((i: ApiHistoryItem): Task => ({
            id: String(i.id ?? crypto.randomUUID()),
            userText: i.userText,
            aiResponse: i.aiResponse,
            createdAt: i.createdAt ?? new Date().toISOString(),
            language: i.language ?? "en",
          }))
          .reverse();

        setTasks(cleaned);
      } catch (e) {
        console.error("History load error:", e);
      }
    };

    load();
  }, [email]);

  /* -------------------------------------
      AI CALL
  -------------------------------------- */
  const fetchAI = async (text: string): Promise<string> => {
    setLoading(true);

    try {
      const finalMessage =
        lang === "es"
          ? `Responde en español de forma clara y profesional:\n${text}`
          : text;

      const res = await fetch(
        "https://app.cohlth.com//g/api/ai/creatormanager",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, message: finalMessage, language: lang }),
        }
      );

      const data = await res.json();
      return data.reply;
    } catch {
      return lang === "es"
        ? "❌ Hubo un problema. Intenta nuevamente."
        : "❌ Something went wrong.";
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------
      SAVE TASK
  -------------------------------------- */
  const saveHistory = async (task: Task) => {
    try {
      await fetch(
        "https://app.cohlth.com/g/api/ai/creatormanager/history",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userText: task.userText,
            aiResponse: task.aiResponse,
            language: task.language,
          }),
        }
      );
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  /* -------------------------------------
      SUBMIT
  -------------------------------------- */
  const handleSubmit = async (override?: string) => {
    if (loading) return;

    const userText = (override ?? input).trim();
    if (!userText) return;

    setInput("");

    const ai = await fetchAI(userText);

    pushTask({
      id: crypto.randomUUID(),
      userText,
      aiResponse: ai,
      createdAt: new Date().toISOString(),
      language: lang,
    });
  };

  /* -------------------------------------
      UI
  -------------------------------------- */
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">

      {/* SIDEBAR */}
      <aside className="border rounded-xl bg-white dark:bg-gray-900 p-4 flex flex-col gap-4">

        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-sm">{t.managerTitle}</h2>
          </div>
          <p className="text-xs text-gray-600">{t.managerDesc}</p>
        </div>

        {/* LANGUAGE */}
        <div>
          <p className="text-xs font-medium mb-1 flex items-center gap-1">
            <Globe2 className="w-3 h-3" /> {t.language}
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

        {/* TEMPLATES */}
        <div className="flex items-center gap-2 text-xs font-medium mt-1">
          <LayoutTemplate className="w-4 h-4 text-blue-500" />
          {t.templates}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {templates.map((section) => (
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

        <div className="text-[11px] text-gray-500 flex items-center gap-1">
          <HistoryIcon className="w-3 h-3" />
          {t.saved}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex flex-col gap-4">

        {/* INPUT */}
        <section className="border rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm">
          <h1 className="text-lg font-semibold mb-1">{t.inputTitle}</h1>

          <p className="text-xs text-gray-600 mb-3">{t.inputDesc}</p>

          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <div className="mt-3 flex justify-between items-center">
            <p className="text-[11px] text-gray-500">{t.sendTip}</p>

            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? t.generating : t.generate}
            </button>
          </div>
        </section>

        {/* RESULTS */}
        <section className="flex-1 overflow-y-auto space-y-4">

          {/* EMPTY */}
          {tasks.length === 0 && !loading && (
            <div className="border border-dashed rounded-xl p-6 text-center text-sm text-gray-500">
              {t.empty}
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="border rounded-xl p-4 bg-gray-50 animate-pulse">
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
                <span>{t.request}</span>
                <span>{new Date(task.createdAt).toLocaleString()}</span>
              </div>

              <h2 className="font-semibold text-sm mb-2 text-blue-700 dark:text-blue-300">
                {task.userText}
              </h2>

              <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
                <ReactMarkdown>{task.aiResponse}</ReactMarkdown>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(task.aiResponse)}
                  className="px-3 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                >
                  📋 {t.copy}
                </button>

                <button
                  onClick={() =>
                    exportTextFile(
                      `AI-Response-${task.id}.txt`,
                      task.aiResponse
                    )
                  }
                  className="px-3 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                >
                  ⬇️ {t.export}
                </button>

                <button
                  onClick={() => improveAnswer(task, lang, fetchAI, pushTask)}
                  className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-500"
                >
                  ✨ {t.improve}
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
