"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProfileReminderBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const [lang, setLang] = useState<"en" | "es">("en");

  const text = {
    en: (
      <>
        👤 Brands use our AI system to select creators. Please keep your profile
        consistently updated — including your category, offers, and full social
        media links. A complete profile increases your chances of being chosen.
      </>
    ),
    es: (
      <>
        👤 Las marcas usan nuestro sistema de IA para seleccionar creadores.
        Mantén tu perfil actualizado — categoría, ofertas y enlaces completos.
        Un perfil completo aumenta tus posibilidades de ser elegido.
      </>
    ),
  };

  if (!showBanner) return null;

  return (
    <div className="w-full max-w-full overflow-visible">
      <div
        className="
          bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-200
          px-4 py-3 text-sm font-medium 
          relative w-full
          md:pl-[290px]   /* sidebar offset fix */
        "
      >
        {/* Top Row */}
        <div className="flex justify-between items-center mb-1">
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

          <button
            onClick={() => setShowBanner(false)}
            className="text-blue-900 hover:text-red-500 dark:text-blue-200"
          >
            ✕
          </button>
        </div>

        {/* Main Text */}
        <div className="text-left leading-relaxed">
          <span>{text[lang]}</span>

          <Link href="/profile" className="underline font-semibold ml-2">
            {lang === "es" ? "Actualizar Perfil" : "Update Profile"}
          </Link>
        </div>
      </div>
    </div>
  );
}
