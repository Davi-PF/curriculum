"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useCopyToast } from "./useCopyToast";
import { ContactItem } from "./ContactItem";
import { ContactToast } from "./ContactToast";

export default function Contact() {
  const { t } = useLanguage();
  const { copiedField, copyToClipboard } = useCopyToast();

  return (
    <section className="mt-12 mb-5 text-center">
      <div className="space-y-2 bg-stone-800/50 backdrop-blur-md inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-t-lg shadow-sm relative mb-2">
        {/* título + descrição */}
        <div className="inline-block bg-stone-300/20 backdrop-blur-md inset-ring-1 inset-ring-stone-600 px-9 py-2 mb-4 rounded-full shadow-lg relative hover:bg-stone-300/30 transition-color">
          <h2 className="text-3xl font-bold text-emerald-400 m-1 text-center">
            {t.contact.title}
          </h2>
        </div>

        <div className="flex flex-col items-center gap-2 mb-2">
          <ContactItem
            icon="/images/icons/gmail.png"
            label={
              <>
                <strong>{t.contact.Email}</strong> daviprufer@gmail.com
              </>
            }
            ariaLabel={t.contact.ariaLabelCopyEmail}
            onClick={() => copyToClipboard("daviprufer@gmail.com", "email")}
          />

          <ContactItem
            icon="/images/icons/telefone.png"
            label={
              <>
                <strong>{t.contact.Phone}</strong> (47) 99958-5464
              </>
            }
            ariaLabel={t.contact.ariaLabelCopyPhone}
            onClick={() => copyToClipboard("47999585464", "phone")}
          />
        </div>

        <div className="flex flex-col items-center gap-2 mb-2">
          <ContactItem
            icon="/images/icons/linkedin.png"
            label={
              <>
                <strong>{t.contact.LinkedIn}</strong> {t.contact.accessHere}
              </>
            }
            href="https://www.linkedin.com/in/daviprudente/"
          />

          <ContactItem
            icon="/images/icons/github.png"
            label={
              <>
                <strong>{t.contact.GitHub}</strong> {t.contact.accessHere}
              </>
            }
            href="https://github.com/Davi-PF"
          />
        </div>

        {copiedField && <ContactToast type={copiedField} />}
      </div>
    </section>
  );
}
