"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";

export default function Header() {
  const { t } = useLanguage();
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">{t.header.title}</h1>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}