import Image from "next/image";
import { ExperienceItem } from "../../types/ExperienceRelated/ExperienceItem";
import { ExperienceActivityItem } from "./ExperienceActivityItem";
import { useState } from "react";

interface ExperiencePanelProps {
  readonly experience: ExperienceItem;
}

export function ExperiencePanel({ experience }: ExperiencePanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="
    bg-stone-600/30 
    backdrop-blur-md 
    inset-ring-1 inset-ring-stone-700/40 
    p-4 sm:p-6 
    rounded-b-lg shadow-xl relative 
    mb-2 
    hover:bg-stone-600/20 
    transition-all duration-300
    animate-fade-in"
    >
      <div className="absolute top-5 left-5 bg-slate-200 inset-ring-1 inset-ring-stone-300 p-1.5 rounded-full shadow-md">
        <Image
          src={experience.logo}
          alt={`${experience.company} logo`}
          width={48}
          height={48}
          className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
        />
      </div>

      <div className="pl-16 sm:pl-20">
        <h3 className="text-xl font-semibold text-emerald-300 mb-2">
          {experience.title}
        </h3>

        <p className="text-emerald-500/60 mb-4">
          {experience.company} | {experience.period}
        </p>

        <p
          className={`
            
    text-emerald-400
    text-sm
    text-left 
    leading-relaxed
    transition-all
    sm:text-justify
    ${expanded ? "max-h-none" : "max-h-[5.5rem] overflow-hidden"}
    sm:max-h-none
  `}
        >
          {experience.description}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="
    sm:hidden
    mt-2
    text-emerald-300
    text-xs
    font-medium
    hover:underline
  "
        >
          {expanded ? "Mostrar menos" : "Ler mais"}
        </button>

        {experience.activities.length > 0 && (
          <>
          <h4 className="
  mt-5 mb-2
  text-xs sm:text-sm
  font-semibold
  text-emerald-300/80
  uppercase tracking-wide
">
  Principais entregas / projetos
</h4>
            <p className="text-emerald-300 mb-3">
              {experience.extraActivities}
            </p>

            <ul className="ml-6 list-disc space-y-1 pr-8">
              {experience.activities.map((activity) => (
                <ExperienceActivityItem
                  key={activity.title}
                  activity={activity}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
