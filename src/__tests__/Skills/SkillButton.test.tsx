import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SkillButton } from '../../components/Skills/SkillButton';
import { Skill } from '@/src/types/skill';

describe('SkillButton', () => {
  const mockSkill: Skill = {
    id: 'react',
    label: 'React',
    description: 'Biblioteca para UI',
  };

  it('renderiza o label da skill', () => {
    render(<SkillButton skill={mockSkill} onClick={vi.fn()} />);

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('chama onClick passando a skill ao clicar', () => {
    const onClick = vi.fn();

    render(<SkillButton skill={mockSkill} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(mockSkill);
  });
});
