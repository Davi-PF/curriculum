"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-stone-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-emerald-400">&copy; 2026, {t.footer.rights}</p>
      </div>
    </footer>
  );
}