import { useLanguage } from "../../contexts/LanguageContext";

type Props = {
  href: string;
  className?: string;
};

export default function CurriculumDriveAccess({ href, className = "" }: Props) {
  const { t } = useLanguage();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-block
        bg-stone-200/20
        inset-ring-1 inset-ring-stone-600
        rounded-full shadow-lg
        relative
        hover:bg-stone-700/60
        transition-colors
        ${className}
      `}
    >
      <span className="block px-5 py-2 text-lg font-semibold text-emerald-300 text-center">
        {t.contact.curriculumText}
      </span>
    </a>
  );
}
