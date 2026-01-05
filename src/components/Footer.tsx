"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {t.footer.rights}</p>
      </div>
    </footer>
  );
}