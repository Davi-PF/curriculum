"use client";

import { useId, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { experiencesByLanguage } from "../../data/experiences";
import { ExperienceHeader } from "./ExperienceHeader";
import { ExperienceTabs } from "./ExperienceTabs";
import { ExperiencePanel } from "./ExperiencePanel";

export default function Experience() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const baseId = useId();

  const experiences = experiencesByLanguage[language];
  const headingId = `${baseId}-heading`;

  return (
    <section className="mb-12">
      <div className="bg-stone-800/50 backdrop-blur-sm inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-lg shadow-sm relative">
        <ExperienceHeader title={t.experience.title} headingId={headingId} />

        <ExperienceTabs
          experiences={experiences}
          activeTab={activeTab}
          onChange={setActiveTab}
          tabsId={baseId}
          labelledBy={headingId}
        />

        {experiences.map((exp, index) => {
          const panelId = `${baseId}-panel-${index}`;
          const tabId = `${baseId}-tab-${index}`;

          return index === activeTab ? (
            <ExperiencePanel
              // Chave posicional estável entre idiomas evitando desmontagem ao trocar PT/EN.
              key={index}
              experience={exp}
              id={panelId}
              labelledBy={tabId}
            />
          ) : (
            <div
              key={index}
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId}
              hidden
            />
          );
        })}
      </div>
    </section>
  );
}

