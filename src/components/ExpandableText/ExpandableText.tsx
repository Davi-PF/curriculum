"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface ExpandableTextProps {
  readonly text: string;
  readonly className?: string;
  readonly clampLines?: number;
}

const clampClassMap: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
};

export function ExpandableText({
  text,
  className = "",
  clampLines = 3,
}: ExpandableTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { t, language } = useLanguage();

  const [expanded, setExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);

  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    setHasUserInteracted(true);
  };

  const clampClass = expanded
    ? "line-clamp-none"
    : clampClassMap[clampLines] ?? "line-clamp-3";

  const hyphenationClass = language === "pt" ? "hyphens-auto" : "hyphens-none";

  useEffect(() => {
    const el = ref.current;
    /* istanbul ignore if -- ref is always set after mount in this component */
    if (!el) return;

    el.style.display = "-webkit-box";
    el.style.webkitLineClamp = String(clampLines);
    el.style.overflow = "hidden";

    requestAnimationFrame(() => {
      setIsExpandable(el.scrollHeight > el.clientHeight);
    });
  }, [text, clampLines]);

  return (
    <div>
      <p
        ref={ref}
        className={`
          ${className}
          text-justify
          ${hyphenationClass}
          ${clampClass}
          sm:line-clamp-none
        `}
      >
        {text}
      </p>

      {(isExpandable || hasUserInteracted) && (
        <button
          onClick={toggleExpanded}
          className="
            sm:hidden
            mt-2
            text-emerald-300
            text-xs
            font-medium
            hover:underline
          "
        >
          {expanded ? t.expandable.showLess : t.expandable.showMore}
        </button>
      )}
    </div>
  );
}
