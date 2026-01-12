"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-50
        bg-stone-800/90 backdrop-blur-md
        shadow-lg transition-all duration-300
        ${isScrolled ? "py-0.05" : "py-2"}
      `}
    >
      <nav className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 items-center transition-all duration-300">
          {/* Esquerda */}
          <div
            className={`
          justify-self-start inline-block 
          bg-transparent inset-ring-1 inset-ring-stone-600 
          px-5 md:px-9 py-2 rounded-full shadow-lg 
          relative 
          hover:bg-stone-800/90 transition-color
          transition-all duration-300
      ${isScrolled ? "px-4 py-1" : "px-5 md:px-9 py-2"}`}
          >
            <h1
              className={`text-center md:text-justify font-bold text-emerald-300 ${
                isScrolled ? "text-lg md:text-2xl" : "text-xl md:text-3xl"
              }`}
            >
              {t.header.title}
            </h1>
          </div>

          {/* Centro */}
          <div className="justify-self-center">
            <LanguageSwitcher />
          </div>

          {/* Direita */}
          <div className="justify-self-end inline-block">
            <div
              className={`
            relative w-30 h-20 
            md:w-24 md:h-16 rounded-full overflow-hidden inset-ring-1 inset-ring-emerald-500 shadow-lg
            ${
              isScrolled
                ? "w-16 h-12 md:w-20 md:h-14"
                : "w-20 h-16 md:w-24 md:h-16"
            }`}
            >
              <Image
                src="/images/profile.jpg"
                alt="Foto de perfil"
                fill
                className="object-cover object-[center_18%] md:object-[center_18%] border border-emerald-500 rounded-full"
                priority
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
