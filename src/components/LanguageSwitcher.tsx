'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="cursor-pointer px-2 rounded border border-dashed border-emerald-400 text-sm"
    >
      {language === 'pt' ? <Image src="/images/icons/estados-unidos.png" alt="English" width={45} height={30} /> : <Image src="/images/icons/brasil.png" alt="Português" width={45} height={30} />}
    </button>
  );
}
