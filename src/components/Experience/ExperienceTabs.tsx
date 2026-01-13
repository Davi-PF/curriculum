import Image from "next/image";
import { ExperienceItem } from "../../types/ExperienceRelated/ExperienceItem";

interface ExperienceTabsProps {
  readonly experiences: ExperienceItem[];
  readonly activeTab: number;
  readonly onChange: (index: number) => void;
}

export function ExperienceTabs({
  experiences,
  activeTab,
  onChange,
}: ExperienceTabsProps) {
  return (
    <div
      className="
    flex
    gap-2
    overflow-x-auto
    sm:overflow-visible
    px-4 sm:px-0
    sm:justify-center
    pb-2
    border-b border-emerald-500
    scroll-smooth
    "
    >
      {experiences.map((exp, index) => (
        <button
          key={exp.company}
          onClick={() => onChange(index)}
          className={`
            flex items-center justify-center gap-2 
            px-3 py-2
            min-w-[64px]
            transition-all duration-200
            active:scale-95
            active:bg-emerald-400/10
            ${
              activeTab === index
                ? "text-emerald-400 border-b-2 sm:border-b-0 sm:border-b-2 border-emerald-400"
                : "text-stone-400 hover:text-gray-200"
            }`}
        >
          <div
            className="
          bg-slate-200 
          inset-ring-1 inset-ring-stone-300 
          p-2 sm:p-2
          rounded-full shadow-md"
          >
            <Image
              src={exp.logo}
              alt={`${exp.company} logo`}
              width={32}
              height={32}
              className="w-8 h-8 sm:w-5 sm:h-5 object-contain"
            />
          </div>
          <span className="hidden sm:inline truncate">{exp.company}</span>
        </button>
      ))}
    </div>
  );
}
