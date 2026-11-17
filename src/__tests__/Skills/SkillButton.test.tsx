import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SkillButton } from '../../components/Skills/SkillButton';
import { Skill } from '@/src/types/skill';
import { useLanguage } from '../../contexts/LanguageContext';
import { renderWithLanguage } from '../test-utils';

function SkillButtonWithToggle({
  skill,
  onClick,
}: {
  readonly skill: Skill;
  readonly onClick: (skill: Skill) => void;
}) {
  const { toggleLanguage } = useLanguage();

  return (
    <>
      <button type="button" onClick={toggleLanguage}>
        toggle
      </button>
      <SkillButton skill={skill} onClick={onClick} />
    </>
  );
}

describe('SkillButton', () => {
  const mockSkill: Skill = {
    id: 'react',
    label: 'React',
    description: 'Biblioteca para UI',
  };

  it('renderiza o label da skill', () => {
    renderWithLanguage(<SkillButton skill={mockSkill} onClick={vi.fn()} />);

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renderiza aria-label internacionalizado em PT e EN preservando o label da skill', () => {
    renderWithLanguage(
      <SkillButtonWithToggle skill={mockSkill} onClick={vi.fn()} />,
    );

    expect(
      screen.getByRole('button', { name: 'Abrir detalhes da skill React' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    expect(
      screen.getByRole('button', { name: 'Open details for React' }),
    ).toBeInTheDocument();
  });

  it('chama onClick passando a skill ao clicar', () => {
    const onClick = vi.fn();

    renderWithLanguage(<SkillButton skill={mockSkill} onClick={onClick} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Abrir detalhes da skill React' }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(mockSkill);
  });

  it('preserva classes de contraste acessível no estado normal, hover e foco', () => {
    renderWithLanguage(<SkillButton skill={mockSkill} onClick={vi.fn()} />);

    const button = screen.getByRole('button', {
      name: 'Abrir detalhes da skill React',
    });

    expect(button.className).toContain('bg-emerald-200');
    expect(button.className).toContain('text-emerald-800');
    expect(button.className).toContain('hover:bg-emerald-800');
    expect(button.className).toContain('hover:text-emerald-200');
    expect(button.className).toContain('focus-visible:ring-2');
    expect(button.className).toContain('focus-visible:ring-emerald-300');
  });
});
