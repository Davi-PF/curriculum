import { Skill } from "@/src/types/skill";

interface SkillButtonProps {
  readonly skill: Skill;
  readonly onClick: (skill: Skill) => void;
  readonly hint?: boolean;
}

export function SkillButton({
  skill,
  onClick,
  hint = false,
}: SkillButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(skill)}
      aria-label={`Abrir detalhes da skill ${skill.label}`}
      className={`
        relative inline-flex items-center justify-center
        bg-emerald-200 text-emerald-800
        text-xs sm:text-sm
        px-3 py-2 rounded-full
        transition
        hover:bg-emerald-500/70 hover:text-emerald-200 hover:cursor-pointer
        active:scale-[0.98] active:brightness-110
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
        ${
          hint
            ? "ring-2 ring-emerald-500/30 shadow-[0_0_0_3px_rgba(16,185,129,0.12)] -translate-y-px"
            : ""
        }
transition-[box-shadow,ring-color]
duration-300

      `}
    >
      <span className="whitespace-nowrap">{skill.label}</span>
    </button>
  );
}
