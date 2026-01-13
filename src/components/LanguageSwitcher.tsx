'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';

interface LanguageSwitcherProps {
  readonly isScrolled?: boolean;
}

export function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      aria-label="Language Switcher"
      onClick={toggleLanguage}
      className={`
        cursor-pointer
        px-2
        rounded
        border border-dashed border-emerald-400

        transition-all duration-300
        transform
        ${isScrolled ? 'scale-87' : 'scale-100'}
      `}
    >
      <Image
        src={
          language === 'pt'
            ? '/images/icons/estados-unidos.png'
            : '/images/icons/brasil.png'
        }
        alt={language === 'pt' ? 'English' : 'Português'}
        width={45}
        height={30}
        className="transition-transform duration-300"
      />
    </button>
  );
}
