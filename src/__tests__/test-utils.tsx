import { render } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';

export function renderWithLanguage(ui: React.ReactNode) {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
}
