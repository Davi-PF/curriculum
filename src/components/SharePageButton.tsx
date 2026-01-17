"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

type Props = {
  readonly url?: string;
  readonly title?: string;
  readonly text?: string;
  readonly className?: string;
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
    if (globalThis.window !== undefined) return globalThis.location.href;
    return "";
  }, [url]);

  async function handleShare() {
    try {
      const finalUrl = shareUrl || globalThis.location.href;

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
      globalThis.prompt("Copie o link:", finalUrl);
      setStatus("copied");
    } catch {
      setStatus("error");
    } finally {
      globalThis.setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const getLabel = () => {
    if (status === "copied") return t.shareButtonStatus.copied;
    if (status === "shared") return t.shareButtonStatus.shared;
    if (status === "error") return t.shareButtonStatus.error;
    return t.shareButtonStatus.share;
  };

  const label = getLabel();

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
