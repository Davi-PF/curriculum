"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function Contact() {
  const {t} = useLanguage();
  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.contact.title}</h2>
      <p className="text-gray-700 mb-4">
        {t.contact.description}
      </p>
      <div className="space-y-2">
        <p className="text-stone-500"><strong>{t.contact.Email}</strong> daviprufer@gmail.com</p>
        <p className="text-stone-500"><strong>{t.contact.Phone}</strong> (47) 99958-5464</p>
        <p className="text-stone-500"><strong>{t.contact.LinkedIn}</strong> <a href="https://www.linkedin.com/in/daviprudente/" className="text-slate-900 hover:underline">{t.contact.accessHere}</a></p>
        <p className="text-stone-500"><strong>{t.contact.GitHub}</strong> <a href="https://github.com/Davi-PF" className="text-slate-900 hover:underline">{t.contact.accessHere}</a></p>
      </div>
    </section>
  );
}