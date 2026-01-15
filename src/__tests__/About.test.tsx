import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import About from '../components/About';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n';

/* Mock do ExpandableText */
vi.mock('../components/ExpandableText/ExpandableText', () => ({
  ExpandableText: ({ text }: { text: string }) => (
    <p data-testid="expandable-text">{text}</p>
  ),
}));

function AboutWithToggle() {
  const { toggleLanguage } = useLanguage();

  return (
    <>
      <About />
      <button onClick={toggleLanguage}>toggle</button>
    </>
  );
}

describe('About component', () => {
  it('renders about title in default language (pt)', () => {
    render(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );

    expect(
      screen.getByText(translations.pt.about.title)
    ).toBeInTheDocument();
  });

  it('renders about description via ExpandableText', () => {
    render(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );

    expect(
      screen.getByTestId('expandable-text')
    ).toHaveTextContent(translations.pt.about.description);
  });

  it('updates title and description when language changes', () => {
    render(
      <LanguageProvider>
        <AboutWithToggle />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByText('toggle'));

    expect(
      screen.getByText(translations.en.about.title)
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('expandable-text')
    ).toHaveTextContent(translations.en.about.description);
  });
});
