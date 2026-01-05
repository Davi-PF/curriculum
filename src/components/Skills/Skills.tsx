"use client";

import { useModal } from './hooks/useModal';
import { useSelectedSkill } from './hooks/useSelectedSkill';
import { SkillButton } from './SkillButton';
import { SkillModal } from './SkillModal';

import { useLanguage } from '@/src/contexts/LanguageContext';
import { skillsByLanguage } from '@/src/data/skills';

export default function Skills() {
  const { t, language } = useLanguage();
  const { isOpen, isClosing, openModal, closeModal, isModalVisible } = useModal();
  const { selectedSkill, selectSkill, clearSkill } = useSelectedSkill();

  const skills = skillsByLanguage[language];

  const handleSkillClick = (skill: typeof skills[0]) => {
    selectSkill(skill);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    // Delay clearing the skill to allow animation to complete
    setTimeout(() => {
      clearSkill();
    }, 200);
  };

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t.skill.title}</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillButton
            key={skill.id}
            skill={skill}
            onClick={handleSkillClick}
          />
        ))}
      </div>

      {isModalVisible && (
        <SkillModal
          skill={selectedSkill}
          isOpen={isOpen}
          isClosing={isClosing}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}