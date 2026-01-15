import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../../components/Header/Header';

// mock do hook
vi.mock('../../components/Header/useHeaderScroll', () => ({
  useHeaderScroll: vi.fn(),
}));

// mocks dos componentes filhos
vi.mock('../../components/Header/HeaderTitle', () => ({
  HeaderTitle: ({ isScrolled }: { isScrolled: boolean }) => (
    <div data-testid="header-title">{String(isScrolled)}</div>
  ),
}));

vi.mock('../../components/Header/HeaderAvatar', () => ({
  HeaderAvatar: ({ isScrolled }: { isScrolled: boolean }) => (
    <div data-testid="header-avatar">{String(isScrolled)}</div>
  ),
}));

vi.mock('../../components/LanguageSwitcher', () => ({
  LanguageSwitcher: ({ isScrolled }: { isScrolled: boolean }) => (
    <div data-testid="language-switcher">{String(isScrolled)}</div>
  ),
}));

import { useHeaderScroll } from '../../components/Header/useHeaderScroll';

describe('Header', () => {
  it('renderiza o header com estado não scrollado', () => {
    vi.mocked(useHeaderScroll).mockReturnValue(false);


    render(<Header />);

    expect(screen.getByTestId('header-title')).toHaveTextContent('false');
    expect(screen.getByTestId('header-avatar')).toHaveTextContent('false');
    expect(screen.getByTestId('language-switcher')).toHaveTextContent('false');
  });

  it('renderiza o header com estado scrollado', () => {
    vi.mocked(useHeaderScroll).mockReturnValue(true);


    render(<Header />);

    expect(screen.getByTestId('header-title')).toHaveTextContent('true');
    expect(screen.getByTestId('header-avatar')).toHaveTextContent('true');
    expect(screen.getByTestId('language-switcher')).toHaveTextContent('true');
  });
});
