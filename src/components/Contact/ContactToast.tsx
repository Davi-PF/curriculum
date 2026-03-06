import { useLanguage } from "../../contexts/LanguageContext";

interface ContactToastProps {
  readonly type: "email" | "phone" | "error";
}

export function ContactToast({ type }: ContactToastProps) {
  const { t } = useLanguage();

  const toastMap = {
    email: {
      text: t.contact.emailCopied,
      className: "text-emerald-300 ring-emerald-400/30",
    },
    phone: {
      text: t.contact.phoneCopied,
      className: "text-sky-300 ring-sky-400/30",
    },
    error: {
      text: t.contact.copyHandlerError,
      className: "text-rose-300 ring-rose-400/30",
    },
  } as const;

  const toast = toastMap[type];

  return (
    <div
      className={`
        fixed top-6 sm:top-8 left-1/2 -translate-x-1/2
        bg-stone-900/80 backdrop-blur-sm
        inset-ring-1
        px-4 py-2
        rounded-full shadow-lg
        text-sm font-medium
        z-50 pointer-events-none
        transition-all duration-300
        animate-fade-in
        ${toast.className}
      `}
    >
      {toast.text}
    </div>
  );
}
