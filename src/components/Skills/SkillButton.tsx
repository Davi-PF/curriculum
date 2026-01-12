import { Skill } from "@/src/types/skill";

interface SkillButtonProps {
  readonly skill: Skill;
  readonly onClick: (skill: Skill) => void;
}

export function SkillButton({ skill, onClick }: SkillButtonProps) {
  return (
    <button
      type="button"
      className="bg-emerald-200 text-emerald-800 text-sm px-3 py-1 rounded-full hover:bg-emerald-500/70 hover:text-emerald-200 transition-colors"
      onClick={() => onClick(skill)}
    >
      {skill.label}
    </button>
  );
}
