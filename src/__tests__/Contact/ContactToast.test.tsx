import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactToast } from '../../components/Contact/ContactToast';

describe('ContactToast', () => {
  it('renders email toast correctly', () => {
    render(<ContactToast type="email" />);

    const toast = screen.getByText('Email copiado');

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('text-emerald-300');
    expect(toast).toHaveClass('ring-emerald-400/30');
  });

  it('renders phone toast correctly', () => {
    render(<ContactToast type="phone" />);

    const toast = screen.getByText('Telefone copiado');

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('text-sky-300');
    expect(toast).toHaveClass('ring-sky-400/30');
  });

  it('renders error toast correctly', () => {
    render(<ContactToast type="error" />);

    const toast = screen.getByText('Não foi possível copiar');

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('text-rose-300');
    expect(toast).toHaveClass('ring-rose-400/30');
  });
});
