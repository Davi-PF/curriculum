import Image from "next/image";
import { ExperienceItem } from "../../types/ExperienceRelated/ExperienceItem";
import { ExperienceActivityItem } from "./ExperienceActivityItem";

import { ExpandableText } from "../ExpandableText/ExpandableText";

interface ExperiencePanelProps {
  readonly experience: ExperienceItem;
}

export function ExperiencePanel({ experience }: ExperiencePanelProps) {
  return (
    <div
      className="
    bg-stone-600/30 backdrop-blur-sm 
    inset-ring-1 inset-ring-stone-700/40 
    p-4 sm:p-6 mb-2 
    rounded-b-lg shadow-xl relative 
    hover:bg-stone-600/20 
    transition-colors duration-300
    animate-fade-in"
    >
      <div className="absolute top-6 left-3 sm:left-6.5 bg-slate-200 inset-ring-1 inset-ring-stone-300 p-1.5 rounded-full shadow-md">
        <Image
          src={experience.logo}
          alt={`${experience.company} logo`}
          width={48}
          height={48}
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
        />
      </div>

      <div className="pl-15 sm:pl-20">
        <h3 className="text-xl font-semibold text-emerald-300 mb-2">
          {experience.title}
        </h3>
        <p className="text-emerald-500/60 mb-4">
          {experience.company} | {experience.period}
        </p>
      </div>
      <div>
        <ExpandableText
          text={experience.description}
          clampLines={3}
          className="pt-2 text-emerald-400 text-sm text-justify"
          key={experience.id}
        />

        {experience.activities.length > 0 && (
          <div className="mt-3">
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
          </div>
        )}
      </div>
    </div>
  );
}
