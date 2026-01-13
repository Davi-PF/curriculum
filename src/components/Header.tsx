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
        ${isScrolled ? "py-0.05" : "py-1"}
      `}
    >
      <nav className="container mx-auto px-3 py-4">
        <div
          className="
  relative
  grid
  grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
  items-center
"
        >
          {/* Esquerda */}
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

          {/* Centro */}
          <div
            className="
    justify-self-center
    px-4
    sm:px-0
  "
          >
            <LanguageSwitcher isScrolled={isScrolled} />
          </div>

          {/* Direita */}
          <div className="justify-self-end pr-4.5">
            <div
              className={`
    relative rounded-full overflow-hidden
    inset-ring-1 inset-ring-emerald-500 shadow-lg
    transition-all duration-300
    ${
      isScrolled
        ? "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
        : "w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20"
    }
  `}
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
