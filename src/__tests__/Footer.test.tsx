import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../components/Footer';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n';

function FooterWithToggle() {
  const { toggleLanguage } = useLanguage();

  return (
    <>
      <Footer />
      <button onClick={toggleLanguage}>toggle</button>
    </>
  );
}

describe('Footer component', () => {
  it('renders footer text in default language (pt)', () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    expect(
      screen.getByText(`© 2026, ${translations.pt.footer.rights}`)
    ).toBeInTheDocument();
  });

  it('updates footer text when language changes', () => {
    render(
      <LanguageProvider>
        <FooterWithToggle />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByText('toggle'));

    expect(
      screen.getByText(`© 2026, ${translations.en.footer.rights}`)
    ).toBeInTheDocument();
  });
});
