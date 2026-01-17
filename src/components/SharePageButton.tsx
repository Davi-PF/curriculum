"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

type Props = {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
};

type Status = "idle" | "copied" | "shared" | "error";

export default function SharePageButton({
  url,
  title = "Currículo / Portfólio",
  text = "Confira meu currículo/portfólio:",
  className = "",
}: Props) {
  const [status, setStatus] = useState<Status>("idle"); 
  const { t } = useLanguage();

  const shareUrl = useMemo(() => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  }, [url]);

  async function handleShare() {
    try {
      const finalUrl = shareUrl || window.location.href;

      // 1) Web Share API
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
          title,
          text,
          url: finalUrl,
        });
        setStatus("shared");
        return;
      }

      // 2) Clipboard API
      if (typeof navigator !== "undefined" && "clipboard" in navigator) {
        await (navigator as Navigator & { clipboard: Clipboard }).clipboard.writeText(finalUrl);
        setStatus("copied");
        return;
      }

      // 3) Último fallback
      window.prompt("Copie o link:", finalUrl);
      setStatus("copied");
    } catch {
      setStatus("error");
    } finally {
      window.setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const label =
    status === "copied"
      ? t.shareButtonStatus.copied
      : status === "shared"
      ? t.shareButtonStatus.shared
      : status === "error"
      ? t.shareButtonStatus.error
      : t.shareButtonStatus.share;

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`
        inline-flex items-center justify-center
        bg-stone-200/20
        inset-ring-1 inset-ring-stone-600
        rounded-full shadow-lg
        hover:bg-stone-400/50
        transition-colors
        px-5 py-2
        text-lg font-semibold text-emerald-400
        ${className}
      `}
      aria-label="Compartilhar link da página"
    >
      {label}
    </button>
  );
}
