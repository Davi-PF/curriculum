"use client";

import { useModal } from "./hooks/useModal";
import { useSelectedSkill } from "./hooks/useSelectedSkill";
import { SkillButton } from "./SkillButton";
import { SkillModal } from "./SkillModal";

import { useLanguage } from "@/src/contexts/LanguageContext";
import { skillsByLanguage } from "@/src/data/skills";

export default function Skills() {
  const { t, language } = useLanguage();
  const { isOpen, isClosing, openModal, closeModal, isModalVisible } =
    useModal();
  const { selectedSkill, selectSkill, clearSkill } = useSelectedSkill();

  const skills = skillsByLanguage[language];
  const hardSkills = skills.filter((skill) => skill.id.startsWith("hard-"));
  const softSkills = skills.filter((skill) => skill.id.startsWith("soft-"));

  const handleSkillClick = (skill: (typeof skills)[0]) => {
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
    <section className="mb-12 text-center">
      <div className="bg-stone-800/50 backdrop-blur-md inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-lg shadow-sm relative mb-2">
        <div className="inline-block bg-stone-300/20 backdrop-blur-md inset-ring-1 inset-ring-stone-600 px-9 py-2 mb-7 rounded-full shadow-lg relative hover:bg-stone-300/30 transition-color">
          <h2 className="text-3xl font-bold text-emerald-400 m-1 text-center">
            {t.skill.title}
          </h2>
        </div>
        <div>
          <div className="bg-stone-800/50 backdrop-blur-md inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-5 shadow-sm relative">
            <div className="inline-block bg-stone-300/20 backdrop-blur-md inset-ring-1 inset-ring-stone-600 px-5 py-1 rounded-full shadow-lg relative hover:bg-stone-300/30 transition-color">
              <h3 className="text-lg font-bold text-emerald-400 m-1 text-center">
                {t.skill.hardSkills}
              </h3>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="
          flex flex-wrap justify-center
          max-w-4xl
          gap-2 bg-stone-600/30 backdrop-blur-md 
          inset-ring-1 inset-ring-stone-700/40 
          p-4 sm:p-6 
          rounded-b-lg shadow-lg "
            >
              {hardSkills.map((skill) => (
                <SkillButton
                  key={skill.id}
                  skill={skill}
                  onClick={handleSkillClick}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-stone-800/50 backdrop-blur-md inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-5 shadow-sm relative mt-7">
            <div className="inline-block bg-stone-300/20 backdrop-blur-md inset-ring-1 inset-ring-stone-600 px-5 py-1 rounded-full shadow-lg relative hover:bg-stone-300/30 transition-color">
              <h3 className="text-lg font-bold text-emerald-400 m-1 text-center">
                {t.skill.softSkills}
              </h3>
            </div>
          </div>
          <div className="flex justify-center">
            <div
              className="
          flex flex-wrap justify-center
          max-w-4xl
          gap-2 bg-stone-600/30 backdrop-blur-md 
          inset-ring-1 inset-ring-stone-700/40 
          p-4 sm:p-6 
          rounded-b-lg shadow-lg "
            >
              {softSkills.map((skill) => (
                <SkillButton
                  key={skill.id}
                  skill={skill}
                  onClick={handleSkillClick}
                />
              ))}
            </div>
          </div>
        </div>

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
