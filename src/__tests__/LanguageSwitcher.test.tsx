import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const toggleLanguageMock = vi.fn();

vi.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'pt',
    toggleLanguage: toggleLanguageMock,
  }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    toggleLanguageMock.mockClear();
  });

  it('renders with Portuguese as default language', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button', {
      name: /language switcher/i,
    });

    expect(button).toBeInTheDocument();

    const image = screen.getByRole('img', { name: /english/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      '/images/icons/estados-unidos.png'
    );
  });

  it('calls toggleLanguage when clicked', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button', {
      name: /language switcher/i,
    });

    fireEvent.click(button);

    expect(toggleLanguageMock).toHaveBeenCalledTimes(1);
  });

  it('applies scale class when isScrolled is true', () => {
    render(<LanguageSwitcher isScrolled />);

    const button = screen.getByRole('button', {
      name: /language switcher/i,
    });

    expect(button.className).toContain('scale-87');
  });
});
