"use client";

import { useLanguage } from "../contexts/LanguageContext";

import { educationByLanguage } from "../data/education";

export default function Formation() {
  const { t, language } = useLanguage();

  const education = educationByLanguage[language];

  return (
    <section className="mt-12 text-center">
      <div className="space-y-2 bg-stone-800/50 backdrop-blur-md inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-t-lg shadow-sm relative">
        <div className="inline-block bg-stone-300/20 backdrop-blur-md inset-ring-1 inset-ring-stone-600 px-9 py-2 mb-4 rounded-full shadow-lg relative hover:bg-stone-300/30 transition-color">
          <h2 className="text-3xl font-bold text-emerald-400 m-1 text-center">
            {t.formation.title}
          </h2>
        </div>

        <ol className="relative flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-6">
          {education.map((item) => (
            <li key={item.id} className="relative flex-1">
              {/* Linha (vertical mobile / horizontal desktop) */}
              <span
                className="
            absolute left-2 top-0 h-full w-px bg-emerald-500/30
            md:top-2 md:left-0 md:h-px md:w-full
          "
              />

              {/* Ponto */}
              <span
                className="
            absolute left-0 top-2 h-4 w-4 rounded-full bg-emerald-500
            ring-4 ring-stone-900
            md:left-1/2 md:-translate-x-1/2
          "
              />

              {/* Card */}
              <div className="ml-8 md:ml-0 md:mt-12 bg-stone-800/50 rounded-lg p-4 shadow-sm hover:bg-stone-800/60 transition-color mb-3">
                <time className="block text-sm text-emerald-400/80 mb-1">
                  {item.period}
                </time>

                <h3 className="text-base font-semibold text-emerald-300">
                  {item.title}
                </h3>

                <p className="text-sm text-emerald-400/90">
                  {item.institution}
                </p>

                {item.description && (
                  <p className="mt-2 text-sm text-emerald-400/70">
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
