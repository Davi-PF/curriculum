"use client";

import { useMemo } from "react";

import { useModal } from "./hooks/useModal";
import { useSelectedSkill } from "./hooks/useSelectedSkill";
import { SkillModal } from "./SkillModal";
import { SkillGroup } from "./SkillGroup";
import { useViewportHint } from "./hooks/useViewportHint";

import { useLanguage } from "../../contexts/LanguageContext";
import { skillsByLanguage } from "../../data/skills";

export default function Skills() {
  const { t, language } = useLanguage();
  const { isOpen, isClosing, openModal, closeModal, isModalVisible } =
    useModal();
  const { selectedSkill, selectSkill, clearSkill } = useSelectedSkill();

  const skills = skillsByLanguage[language];

  const hardSkills = useMemo(
    () => skills.filter((s) => s.id.startsWith("hard-")),
    [skills],
  );
  const softSkills = useMemo(
    () => skills.filter((s) => s.id.startsWith("soft-")),
    [skills],
  );

  const { ref: sectionRef, showHint } = useViewportHint({
    storageKey: "skills_hint_seen",
    threshold: 0.4,
    durationMs: 2800,
    reducedMotionDurationMs: 2200,
  });

  const handleSkillClick = (skill: (typeof skills)[0]) => {
    selectSkill(skill);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setTimeout(() => clearSkill(), 200);
  };

  return (
    <section ref={sectionRef} className="mb-12 text-center">
      <div className="bg-stone-800/50 backdrop-blur-sm inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-lg shadow-sm relative mb-2">
        <div className="inline-block bg-stone-300/10 inset-ring-1 inset-ring-stone-600 px-9 py-2 mb-7 rounded-full shadow-lg relative hover:bg-stone-300/20 transition-colors">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 m-1 text-center">
            {t.skill.title}
          </h2>
        </div>

        <SkillGroup
          title={t.skill.hardSkills}
          skills={hardSkills}
          showHint={showHint}
          hintText={t.skill.hintText}
          onSkillClick={handleSkillClick}
        />

        <SkillGroup
          className="mt-6"
          title={t.skill.softSkills}
          skills={softSkills}
          showHint={showHint}
          hintText={t.skill.hintText}
          onSkillClick={handleSkillClick}
        />

        {isModalVisible && (
          <SkillModal
            skill={selectedSkill}
            isOpen={isOpen}
            isClosing={isClosing}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </section>
  );
}
