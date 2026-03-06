import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactToast } from '../../components/Contact/ContactToast';
import { renderWithLanguage } from '../test-utils';
import { translations } from '../../i18n';

describe('ContactToast', () => {
  it('renders email toast correctly', () => {
    renderWithLanguage(<ContactToast type="email" />);

    const toast = screen.getByText(translations.pt.contact.emailCopied);

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('text-emerald-300');
    expect(toast).toHaveClass('ring-emerald-400/30');
  });

  it('renders phone toast correctly', () => {
    renderWithLanguage(<ContactToast type="phone" />);

    const toast = screen.getByText(translations.pt.contact.phoneCopied);

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('text-sky-300');
    expect(toast).toHaveClass('ring-sky-400/30');
  });

  it('renders error toast correctly', () => {
    renderWithLanguage(<ContactToast type="error" />);

    const toast = screen.getByText(translations.pt.contact.copyHandlerError);

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('text-rose-300');
    expect(toast).toHaveClass('ring-rose-400/30');
  });
});
