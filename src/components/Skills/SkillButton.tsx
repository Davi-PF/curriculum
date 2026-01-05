import { Skill } from "@/src/types/skill";

interface SkillButtonProps {
  readonly skill: Skill;
  readonly onClick: (skill: Skill) => void;
}

export function SkillButton({ skill, onClick }: SkillButtonProps) {
  return (
    <button
      type="button"
      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
      onClick={() => onClick(skill)}
    >
      {skill.label}
    </button>
  );
}