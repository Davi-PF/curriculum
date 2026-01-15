"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { educationByLanguage } from "../../data/education";
import { FormationHeader } from "./FormationHeader";
import { FormationTimeline } from "./FormationTimeline";

export default function Formation() {
  const { language } = useLanguage();
  const education = educationByLanguage[language];

  return (
    <section className="mt-12 text-center">
      <div className="space-y-2 bg-stone-800/50 backdrop-blur-sm inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-t-lg shadow-sm relative">
        <FormationHeader />
        <FormationTimeline education={education} />
      </div>
    </section>
  );
}
