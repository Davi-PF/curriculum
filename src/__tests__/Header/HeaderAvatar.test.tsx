import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeaderAvatar } from '../../components/Header/HeaderAvatar';

describe('HeaderAvatar', () => {
  it('renderiza a imagem de perfil', () => {
    render(<HeaderAvatar isScrolled={false} />);

    const img = screen.getByAltText('Foto de perfil');
    expect(img).toBeInTheDocument();
  });

  it('usa tamanho grande quando não está scrollado', () => {
    const { container } = render(<HeaderAvatar isScrolled={false} />);

    const avatarWrapper = container.querySelector('.rounded-full');
    expect(avatarWrapper).toHaveClass('w-16');
    expect(avatarWrapper).toHaveClass('h-16');
  });

  it('usa tamanho reduzido quando está scrollado', () => {
    const { container } = render(<HeaderAvatar isScrolled />);

    const avatarWrapper = container.querySelector('.rounded-full');
    expect(avatarWrapper).toHaveClass('w-12');
    expect(avatarWrapper).toHaveClass('h-12');
  });
});