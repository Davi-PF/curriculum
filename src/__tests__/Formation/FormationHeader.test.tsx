import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormationHeader } from '../../components/Formation/FormationHeader';
import { LanguageProvider } from '../../contexts/LanguageContext';

function renderWithLanguage(ui: React.ReactNode) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('FormationHeader', () => {
  it('renderiza o título vindo do i18n', () => {
    renderWithLanguage(<FormationHeader />);

    expect(
      screen.getByRole('heading', { level: 2 })
    ).toHaveTextContent(/forma/i);
  });
});
