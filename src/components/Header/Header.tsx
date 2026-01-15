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
    shadow-lg
    transition-[background-color,box-shadow] duration-300
    ${isScrolled ? "bg-stone-900/60" : "bg-stone-800/30"}
  `}
>

      <nav
        className={`
      container mx-auto px-3 py-4
      transition-transform duration-300 origin-top
      ${isScrolled ? "scale-[0.98] translate-y-[-1px]" : "scale-100 translate-y-0"}
      header-nav-anim

    `}
      >
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
