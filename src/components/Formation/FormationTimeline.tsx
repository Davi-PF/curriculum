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
      {education.map((item) => (
        <FormationItem key={item.id} item={item} />
      ))}
    </ol>
  );
}
