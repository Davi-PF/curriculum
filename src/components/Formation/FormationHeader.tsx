"use client";

import { useLanguage } from "../../contexts/LanguageContext";

export function FormationHeader() {
  const { t } = useLanguage();

  return (
    <div className="inline-block bg-stone-300/10 backdrop-blur-sm inset-ring-1 inset-ring-stone-600 px-9 py-2 mb-4 rounded-full shadow-lg relative hover:bg-stone-300/20 transition-colors">
      <h2 className="text-xl sm:text-3xl font-bold text-emerald-400 m-1 text-center">
        {t.formation.title}
      </h2>
    </div>
  );
}
