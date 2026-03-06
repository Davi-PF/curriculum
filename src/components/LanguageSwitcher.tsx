"use client";

import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";

interface LanguageSwitcherProps {
  readonly isScrolled?: boolean;
}

export function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const { language, toggleLanguage } = useLanguage();
  const isPortuguese = language === "pt";
  const isEnglish = language === "en";

  return (
    <button
      type="button"
      aria-pressed={isEnglish}
      aria-label={isPortuguese ? "Switch to English" : "Mudar para Português"}
      onClick={toggleLanguage}
      className={`
        relative
        w-23 h-9
        p-1
        cursor-pointer
        rounded-full
        border border-emerald-400/60
        bg-stone-900/60
        shadow-sm
        transition-all duration-300 ease-out
        hover:border-emerald-300/80
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-emerald-400/60
        ${isScrolled ? "scale-87" : "scale-100"}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          absolute top-1/2 z-10 w-10 -translate-y-1/2 text-center text-[11px] font-bold uppercase leading-none text-emerald-200/90
          transition-all duration-500 ease-[cubic-bezier(0.22,1.4,0.36,1)]
          ${isPortuguese ? "left-12" : "left-0.5"}
        `}
      >
        {isPortuguese ? "EN" : "PT"}
      </span>

      <span
        aria-hidden="true"
        className={`
          absolute inset-y-1 left-1 z-20 flex w-10 items-center justify-center rounded-full
          bg-emerald-500/20 inset-ring-1 inset-ring-emerald-400/50
          transition-transform duration-500 ease-[cubic-bezier(0.22,1.4,0.36,1)]
          ${isPortuguese ? "translate-x-0" : "translate-x-10.5"}
        `}
      >
        <span className="relative h-5 w-5">
          <Image
            src="/images/icons/brasil.png"
            alt=""
            width={20}
            height={20}
            className={`
              absolute left-0 top-0
              transition-opacity duration-300 ease-out
              ${isPortuguese ? "opacity-100" : "opacity-0"}
            `}
          />
          <Image
            src="/images/icons/estados-unidos.png"
            alt=""
            width={20}
            height={20}
            className={`
              absolute left-0 top-0
              transition-opacity duration-300 ease-out
              ${isEnglish ? "opacity-100" : "opacity-0"}
            `}
          />
        </span>
      </span>
    </button>
  );
}
