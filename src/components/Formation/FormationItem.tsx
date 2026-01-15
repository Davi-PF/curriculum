"use client";

import { ExpandableText } from "../../components/ExpandableText/ExpandableText";

interface FormationItemProps {
  readonly item: {
    id: string;
    period: string;
    title: string;
    institution: string;
    description?: string;
  };
}

export function FormationItem({ item }: FormationItemProps) {
  return (
    <li className="relative flex-1">
      {/* Linha */}
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
          <ExpandableText
            text={item.description}
            clampLines={2}
            className="mt-2 text-sm text-emerald-400/70"
          />
        )}
      </div>
    </li>
  );
}
