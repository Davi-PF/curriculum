
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactItem } from '../../components/Contact/ContactItem';

describe('ContactItem', () => {
  it('renders as a link when href is provided', () => {
    render(
      <ContactItem
        icon="/icon.png"
        label={<strong>GitHub</strong>}
        href="https://github.com/test"
      />
    );

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/test');
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders as a button when href is not provided', () => {
    render(
      <ContactItem
        icon="/icon.png"
        label="Email"
        ariaLabel="Copiar email"
        onClick={() => {}}
      />
    );

    const button = screen.getByRole('button', {
      name: 'Copiar email',
    });

    expect(button).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const onClick = vi.fn();

    render(
      <ContactItem
        icon="/icon.png"
        label="Telefone"
        ariaLabel="Copiar telefone"
        onClick={onClick}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Copiar telefone' })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows clipboard icon when onClick is provided', () => {
    render(
      <ContactItem
        icon="/icon.png"
        label="Email"
        onClick={() => {}}
      />
    );

    expect(screen.getByText('📋')).toBeInTheDocument();
  });

  it('does not show clipboard icon when onClick is not provided', () => {
    render(
      <ContactItem
        icon="/icon.png"
        label="LinkedIn"
        href="https://linkedin.com"
      />
    );

    expect(screen.queryByText('📋')).not.toBeInTheDocument();
  });
});
