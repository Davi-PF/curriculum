"use client";

import { useEffect, useState } from "react";

export function useHeaderScroll(enterThreshold = 24, exitThreshold = 8) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => (prev ? y > exitThreshold : y > enterThreshold));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [enterThreshold, exitThreshold]);

  return isScrolled;
}
