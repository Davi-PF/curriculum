import { useState } from 'react';
import { Skill } from '@/src/types/skill';


export function useSelectedSkill() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const selectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const clearSkill = () => {
    setSelectedSkill(null);
  };

  return {
    selectedSkill,
    selectSkill,
    clearSkill,
    hasSelectedSkill: selectedSkill !== null
  };
}