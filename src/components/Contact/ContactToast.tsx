const toastConfig = {
  email: {
    text: 'Email copiado',
    className: 'text-emerald-300 ring-emerald-400/30',
  },
  phone: {
    text: 'Telefone copiado',
    className: 'text-sky-300 ring-sky-400/30',
  },
  error: {
    text: 'Não foi possível copiar',
    className: 'text-rose-300 ring-rose-400/30',
  },
} as const;

interface ContactToastProps {
  readonly type: keyof typeof toastConfig;
}

export function ContactToast({ type }: ContactToastProps) {
  const toast = toastConfig[type];

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2
        bg-stone-900/80 backdrop-blur-sm
        inset-ring-1
        px-4 py-2
        rounded-full shadow-lg
        text-sm font-medium
        transition-all duration-300
        animate-fade-in
        ${toast.className}
      `}
    >
      {toast.text}
    </div>
  );
}
