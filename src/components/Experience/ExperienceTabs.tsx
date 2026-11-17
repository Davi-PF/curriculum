"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import type { KeyboardEvent } from "react";
import { ExperienceItem } from "../../types/ExperienceRelated/ExperienceItem";

interface ExperienceTabsProps {
  readonly experiences: ExperienceItem[];
  readonly activeTab: number;
  readonly onChange: (index: number) => void;
  readonly tabsId?: string;
  readonly labelledBy?: string;
  readonly ariaLabel?: string;
}

function getNextTabIndex(
  key: string,
  currentIndex: number,
  totalTabs: number,
): number | null {
  switch (key) {
    case "ArrowRight":
      return (currentIndex + 1) % totalTabs;
    case "ArrowLeft":
      return (currentIndex - 1 + totalTabs) % totalTabs;
    case "Home":
      return 0;
    case "End":
      return totalTabs - 1;
    default:
      return null;
  }
}

export function ExperienceTabs({
  experiences,
  activeTab,
  onChange,
  tabsId,
  labelledBy,
  ariaLabel,
}: ExperienceTabsProps) {
  const generatedId = useId();
  const baseId = tabsId ?? generatedId;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = getNextTabIndex(event.key, index, experiences.length);
    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    onChange(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      className="
    flex
    gap-2
    overflow-x-auto
    sm:overflow-visible
    px-4 sm:px-0
    sm:justify-center
    pb-2
    border-b border-emerald-500
    scroll-smooth
    "
    >
      {experiences.map((exp, index) => {
        const isActive = activeTab === index;
        const tabId = `${baseId}-tab-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <button
            // Índice utilizado como key para evitar desmontagem e perda de foco ao alternar idioma,
            // pois id e company variam entre PT e EN mantendo a mesma ordem posicional.
            key={index}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            aria-label={exp.company}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`
            flex items-center justify-center gap-2 
            px-3 py-2
            min-w-[64px]
            transition-all duration-200
            active:scale-95
            active:bg-emerald-400/10
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 rounded
            ${
              isActive
                ? "text-emerald-400 border-b-2 sm:border-b-0 sm:border-b-2 border-emerald-400"
                : "text-stone-400 hover:text-gray-200"
            }`}
          >
            <div
              className="
          bg-slate-200 
          inset-ring-1 inset-ring-stone-300 
          p-2 sm:p-2
          rounded-full shadow-md"
            >
              <Image
                src={exp.logo}
                alt={`${exp.company} logo`}
                width={32}
                height={32}
                className="w-8 h-8 sm:w-5 sm:h-5 object-contain"
              />
            </div>
            <span className="hidden sm:inline truncate">{exp.company}</span>
          </button>
        );
      })}
    </div>
  );
}
