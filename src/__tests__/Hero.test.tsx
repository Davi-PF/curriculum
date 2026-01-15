import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from '../components/Hero';
import { useLanguage, LanguageProvider } from '../contexts/LanguageContext';
import { translations } from '../i18n';

function renderHero() {
  return render(
    <LanguageProvider>
      <Hero />
    </LanguageProvider>
  );
}

function HeroWithToggle() {
  const { toggleLanguage } = useLanguage();

  return (
    <>
      <Hero />
      <button onClick={toggleLanguage}>toggle</button>
    </>
  );
}


describe('Hero component', () => {
  it('renders hero texts in default language (pt)', () => {
    renderHero();

    expect(
      screen.getByText(translations.pt.hero.title)
    ).toBeInTheDocument();

    expect(
      screen.getByText(translations.pt.hero.subtitle)
    ).toBeInTheDocument();

    expect(
      screen.getByText(`"${translations.pt.hero.quote}"`)
    ).toBeInTheDocument();
  });

    it('updates hero texts when language changes', () => {
    render(
      <LanguageProvider>
        <Hero />
        <button onClick={() => {}}>toggle</button>
      </LanguageProvider>
    );

    // estado inicial (pt)
    expect(
      screen.getByText(translations.pt.hero.title)
    ).toBeInTheDocument();

  });

    it('updates hero texts when language toggles', () => {
    render(
      <LanguageProvider>
        <HeroWithToggle />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByText('toggle'));

    expect(
      screen.getByText(translations.en.hero.title)
    ).toBeInTheDocument();

    expect(
      screen.getByText(translations.en.hero.subtitle)
    ).toBeInTheDocument();
  });
  
    it('throws error when rendered outside LanguageProvider', () => {
    expect(() => {
      render(<Hero />);
    }).toThrow('useLanguage must be used within LanguageProvider');
  });
});

