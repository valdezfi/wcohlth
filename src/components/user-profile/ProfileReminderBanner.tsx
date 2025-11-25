"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfileReminderBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [lang, setLang] = useState<"en" | "es">("en");

  useEffect(() => {
    setShowBanner(true);
  }, []);

  if (!showBanner) return null;

  const text = {
    en: (
      <>
        👤 Brands use our AI system to select creators. Please keep your profile
        consistently updated — including your category, offers, and full social
        media links (not usernames). A complete and fresh profile increases your
        chances of being chosen for campaigns.
      </>
    ),
    es: (
      <>
        👤 Las marcas usan nuestro sistema de IA para seleccionar creadores.
        Mantén tu perfil actualizado constantemente — incluyendo tu categoría,
        tus ofertas y los enlaces completos a tus redes sociales (no solo los
        nombres de usuario). Un perfil completo y reciente aumenta tus
        posibilidades de ser elegido para campañas.
      </>
    ),
  };

  return (
    <div
      className="
        bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-200
        px-4 py-3 text-sm font-medium
        relative w-full
      "
    >
      {/* TOP ROW: Language + Close */}
      <div className="flex justify-between items-center mb-1">
        {/* Language Switch */}
        <div className="flex gap-2">
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-1 rounded ${
              lang === "en" ? "bg-blue-300 dark:bg-blue-700" : "opacity-70"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => setLang("es")}
            className={`px-2 py-1 rounded ${
              lang === "es" ? "bg-blue-300 dark:bg-blue-700" : "opacity-70"
            }`}
          >
            ES
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowBanner(false)}
          className="text-blue-900 hover:text-red-500 dark:text-blue-200"
        >
          ✕
        </button>
      </div>

      {/* MAIN TEXT */}
      <div className="text-left leading-relaxed">
        <span>{text[lang]}</span>

        <Link href="/profile" className="underline font-semibold ml-2">
          {lang === "es" ? "Actualizar Perfil" : "Update Profile"}
        </Link>
      </div>
    </div>
  );
}
