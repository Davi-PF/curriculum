"use client";

import { Skill } from "@/src/types/skill";
import { SkillButton } from "./SkillButton";

type Props = {
  readonly title: string;
  readonly skills: Skill[];
  readonly showHint: boolean;
  readonly hintText: string;
  readonly onSkillClick: (skill: Skill) => void;
  readonly className?: string;
};

export function SkillGroup({
  title,
  skills,
  showHint,
  hintText,
  onSkillClick,
  className = "",
}: Props) {
  return (
    <div className={className}>
      <div className="bg-stone-800/50 backdrop-blur-sm inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-5 shadow-sm relative">
        <div
          className={`
            inline-flex items-center
            bg-stone-300/10 inset-ring-1 inset-ring-stone-600
            px-5 py-1 rounded-full shadow-lg relative
            hover:bg-stone-300/20
            transition-[box-shadow,ring-color,background-color]
            duration-300
            ${
              showHint
                ? "ring-2 ring-emerald-400/40 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
                : ""
            }
          `}
        >
          <h3 className="text-lg font-bold text-emerald-400 m-1 text-center">
            {title}
          </h3>
        </div>

        {/* Reserva fixa para evitar empurrar o conteúdo */}
        <div className="mt-2">
          <p hidden={!showHint} className="text-xs text-emerald-200/60">
            {hintText}
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          className="
            flex flex-wrap justify-center max-w-4xl gap-2
            bg-stone-600/30 backdrop-blur-sm
            inset-ring-1 inset-ring-stone-700/40
            p-4 sm:p-6 rounded-b-lg shadow-lg
          "
        >
          {skills.map((skill) => (
            <SkillButton
              key={skill.id}
              skill={skill}
              onClick={onSkillClick}
              hint={showHint}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
