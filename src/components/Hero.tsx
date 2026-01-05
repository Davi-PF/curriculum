"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="mb-12 text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.hero.title}</h2>
      <p className="text-lg text-gray-600">{t.hero.subtitle}</p>
      <p className="text-gray-300 italic">&quot;{t.hero.quote}&quot;</p>
    </section>
  );
}
