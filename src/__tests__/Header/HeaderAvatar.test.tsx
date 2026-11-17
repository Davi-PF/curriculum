import { fireEvent, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeaderAvatar } from '../../components/Header/HeaderAvatar';
import { useLanguage } from '../../contexts/LanguageContext';
import { renderWithLanguage } from '../test-utils';

function LanguageToggleHarness({ isScrolled }: { readonly isScrolled: boolean }) {
  const { toggleLanguage } = useLanguage();

  return (
    <>
      <button type="button" onClick={toggleLanguage}>
        toggle
      </button>
      <HeaderAvatar isScrolled={isScrolled} />
    </>
  );
}

describe('HeaderAvatar', () => {
  it('renderiza a imagem de perfil com alt em português por padrão e em inglês após alternar idioma', () => {
    renderWithLanguage(<LanguageToggleHarness isScrolled={false} />);

    expect(screen.getByAltText('Foto de perfil')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    expect(screen.getByAltText('Profile photo')).toBeInTheDocument();
    expect(screen.queryByAltText('Foto de perfil')).not.toBeInTheDocument();
  });

  it('usa tamanho grande quando não está scrollado', () => {
    const { container } = renderWithLanguage(<HeaderAvatar isScrolled={false} />);

    const avatarWrapper = container.querySelector('.rounded-full');
    expect(avatarWrapper).toHaveClass('w-16');
    expect(avatarWrapper).toHaveClass('h-16');
  });

  it('usa tamanho reduzido quando está scrollado', () => {
    const { container } = renderWithLanguage(<HeaderAvatar isScrolled />);

    const avatarWrapper = container.querySelector('.rounded-full');
    expect(avatarWrapper).toHaveClass('w-12');
    expect(avatarWrapper).toHaveClass('h-12');
  });
});