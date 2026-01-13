"use client";

import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Image from "next/image";

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


export default function Contact() {
  const { t } = useLanguage();

  type CopiedType = "email" | "phone" | "error" | null;

  const [copiedField, setCopiedField] = useState<CopiedType>(null);

  const copyToClipboard = async (value: string, field: CopiedType) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);

      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField("error");
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <section className="mt-12 mb-5 text-center">
      <div className="space-y-2 bg-stone-800/50 backdrop-blur-md inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-t-lg shadow-sm relative mb-2">
        <div className="inline-block bg-stone-300/20 backdrop-blur-md inset-ring-1 inset-ring-stone-600 px-9 py-2 mb-4 rounded-full shadow-lg relative hover:bg-stone-300/30 transition-color">
          <h2 className="text-3xl font-bold text-emerald-400 m-1 text-center">
            {t.contact.title}
          </h2>
        </div>

        <div className="bg-stone-600/30 backdrop-blur-md inset-ring-1 inset-ring-stone-700/40 p-4 sm:p-6 rounded-xl shadow-xl relative">
          <p className="text-emerald-500 mb-4">{t.contact.description}</p>

          <div className="flex items-center justify-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => copyToClipboard("daviprufer@gmail.com", "email")}
              className="
    flex items-center gap-2
    text-emerald-400
    text-xs
    sm:text-lg
    underline
    underline-offset-3
    sm:hover:underline
    cursor-pointer
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-emerald-400/60
  "
              aria-label={t.contact.ariaLabelCopyEmail}
            >
              <Image
                src="/images/icons/gmail.png"
                alt=""
                width={22}
                height={22}
              />

              <span>
                <strong>{t.contact.Email}</strong> daviprufer@gmail.com
              </span>
            </button>
            <span className="text-emerald-300">📋</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => copyToClipboard("47999585464", "phone")}
              className="
    flex items-center gap-2
    text-emerald-400
    text-xs
    sm:text-lg
    underline
    underline-offset-3
    sm:hover:underline
    cursor-pointer
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-emerald-400/60
  "
              aria-label={t.contact.ariaLabelCopyPhone}
            >
              <Image
                src="/images/icons/telefone.png"
                alt=""
                width={22}
                height={22}
              />

              <span>
                <strong>{t.contact.Phone}</strong> (47) 99958-5464
              </span>
            </button>
            <span className="text-emerald-300">📋</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <a
              href="https://www.linkedin.com/in/daviprudente/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-400 text-xs sm:text-lg underline underline-offset-3 sm:hover:underline"
            >
              <Image
                src="/images/icons/linkedin.png"
                alt="LinkedIn icon"
                width={22}
                height={22}
                className="object-cover"
              />

              <span>
                <strong>{t.contact.LinkedIn}</strong> {t.contact.accessHere}
              </span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <a
              href="https://github.com/Davi-PF"
              className="flex items-center gap-2 text-emerald-400 text-xs sm:text-lg underline underline-offset-3 sm:hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/icons/github.png"
                alt="GitHub icon"
                width={22}
                height={22}
              />

              <span>
                <strong>{t.contact.GitHub}</strong> {t.contact.accessHere}
              </span>
            </a>
          </div>

          <div className="inline-block bg-stone rounded-full shadow-lg px-4 py-2 mt-2 hover:bg-emerald-600/30 hover:inset-ring-1 hover:inset-ring-emerald-400 transition-all">
            <a
              href="https://drive.google.com/file/d/11aHiBKp0m4n_V8molhdG2PeAnXOTcYqw/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-emerald-200 underline underline-offset-3">
                {t.contact.curriculumText}
              </span>
            </a>
          </div>
        </div>
      </div>
      {copiedField && (
  <div
    className={`
      fixed bottom-6 left-1/2 -translate-x-1/2
      bg-stone-900/80 backdrop-blur-md
      inset-ring-1
      px-4 py-2
      rounded-full shadow-lg
      text-sm font-medium
      transition-all duration-300
      animate-fade-in
      ${toastConfig[copiedField].className}
    `}
  >
    {toastConfig[copiedField].text}
  </div>
)}

    </section>
  );
}
