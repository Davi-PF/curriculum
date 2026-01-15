"use client";

import { useLanguage } from "../../contexts/LanguageContext";

interface HeaderTitleProps {
  readonly isScrolled: boolean;
}

export function HeaderTitle({ isScrolled }: HeaderTitleProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`
        justify-self-start
        bg-stone-800/50 backdrop-blur-md
        inset-ring-1 inset-ring-stone-600/40
        rounded-full
        sm:p-3 sm:px-6
        shadow-sm
        transition-all duration-300
        ${
          isScrolled
            ? "px-2 py-2"
            : "px-3 py-2 sm:px-4 sm:py-2"
        }
        mr-2 sm:mr-0
      `}
    >
      <h1
        className={`
          text-center
          font-bold text-emerald-300
          leading-tight
          transition-all duration-300
          ${
            isScrolled
              ? "text-xs sm:text-lg md:text-xl"
              : "text-sm sm:text-xl md:text-3xl"
          }
        `}
      >
        {t.header.title}
      </h1>
    </div>
  );
}
