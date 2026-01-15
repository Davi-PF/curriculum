import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSelectedSkill } from '../../components/Skills/hooks/useSelectedSkill';
import { Skill } from '@/src/types/skill';

describe('useSelectedSkill', () => {
  const mockSkill: Skill = {
    id: 'react',
    label: 'React',
    description: 'Biblioteca para interfaces',
  };

  it('should start with no selected skill', () => {
    const { result } = renderHook(() => useSelectedSkill());

    expect(result.current.selectedSkill).toBeNull();
    expect(result.current.hasSelectedSkill).toBe(false);
  });

  it('should select a skill', () => {
    const { result } = renderHook(() => useSelectedSkill());

    act(() => {
      result.current.selectSkill(mockSkill);
    });

    expect(result.current.selectedSkill).toEqual(mockSkill);
    expect(result.current.hasSelectedSkill).toBe(true);
  });

  it('should clear selected skill', () => {
    const { result } = renderHook(() => useSelectedSkill());

    act(() => {
      result.current.selectSkill(mockSkill);
      result.current.clearSkill();
    });

    expect(result.current.selectedSkill).toBeNull();
    expect(result.current.hasSelectedSkill).toBe(false);
  });
});
