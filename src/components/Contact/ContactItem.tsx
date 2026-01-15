import Image from 'next/image';

interface ContactItemProps {
  readonly icon: string;
  readonly label: React.ReactNode;
  readonly onClick?: () => void;
  readonly href?: string;
  readonly ariaLabel?: string;
}

const baseClasses = `
  flex items-center justify-center gap-2
  text-emerald-400
  text-xs sm:text-lg
  underline underline-offset-3
  sm:hover:underline
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-emerald-400/60
`;

export function ContactItem({
  icon,
  label,
  onClick,
  href,
  ariaLabel,
}: ContactItemProps) {
  const content = (
    <>
      <Image src={icon} alt="" width={22} height={22} />
      <span>{label}</span>
      {onClick && <span className="text-emerald-300">📋</span>}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={baseClasses}
    >
      {content}
    </button>
  );
}
