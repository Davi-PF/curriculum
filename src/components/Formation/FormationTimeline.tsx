"use client";

import { FormationItem } from "./FormationItem";

interface FormationTimelineProps {
  readonly education: Array<{
    id: string;
    period: string;
    title: string;
    institution: string;
    description?: string;
  }>;
}

export function FormationTimeline({ education }: FormationTimelineProps) {
  return (
    <ol className="relative flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-6">
      {/* Linha principal da timeline (vertical no mobile, horizontal no desktop) */}
      <span
        aria-hidden="true"
        className="
          absolute left-2 top-2 bottom-0 w-px bg-emerald-500/30
          md:left-0 md:right-0 md:top-2 md:bottom-auto md:h-px md:w-auto
        "
      />

      {education.map((item) => (
        <FormationItem key={item.id} item={item} />
      ))}
    </ol>
  );
}
