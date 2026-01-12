"use client";

import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { experiencesByLanguage } from "../../data/experiences";
import { ExperienceHeader } from "./ExperienceHeader";
import { ExperienceTabs } from "./ExperienceTabs";
import { ExperiencePanel } from "./ExperiencePanel";

export default function Experience() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  const experiences = experiencesByLanguage[language];
  const activeExperience = experiences[activeTab];

  return (
    <section className="mb-12">
      <div className="bg-stone-800/50 backdrop-blur-md inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-lg shadow-sm relative">
        <ExperienceHeader title={t.experience.title} />

        <ExperienceTabs
          experiences={experiences}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <ExperiencePanel experience={activeExperience} />
      </div>
    </section>
  );
}

