"use client";

import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { useHeaderScroll } from "./useHeaderScroll";
import { HeaderTitle } from "./HeaderTitle";
import { HeaderAvatar } from "./HeaderAvatar";

export default function Header() {
  const isScrolled = useHeaderScroll();

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
          <HeaderTitle isScrolled={isScrolled} />

          <div className="justify-self-center px-4 sm:px-0">
            <LanguageSwitcher isScrolled={isScrolled} />
          </div>

          <HeaderAvatar isScrolled={isScrolled} />
        </div>
      </nav>
    </header>
  );
}
