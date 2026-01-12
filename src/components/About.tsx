"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  return (
    <section className="mb-12 text-center">
      <div className="bg-stone-800/50 backdrop-blur-md inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-sm shadow-sm relative">
        <div className="inline-block bg-stone-300/20 backdrop-blur-md inset-ring-1 inset-ring-stone-600 px-9 py-2 mb-4 rounded-full shadow-lg relative hover:bg-stone-300/30 transition-color">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 p-1 text-center">
            {t.about.title}
          </h2>
        </div>
        <div className="bg-stone-600/30 backdrop-blur-md inset-ring-1 inset-ring-stone-700/40 p-4 sm:p-6 rounded-xl shadow-xl relative mb-2">
          <p className="text-emerald-500 text-justify">{t.about.description}</p>
        </div>
      </div>
    </section>
  );
}
