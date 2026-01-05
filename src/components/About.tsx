"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.about.title}</h2>
      <p className="text-gray-700 leading-relaxed">
        {t.about.description}
      </p>
    </section>
  );
}