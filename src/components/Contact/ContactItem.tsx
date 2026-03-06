import Image from "next/image";

interface ContactItemProps {
  readonly icon: string;
  readonly label: React.ReactNode;
  readonly onClick?: () => void;
  readonly href?: string;
  readonly ariaLabel?: string;
  readonly isCopied?: boolean;
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
  isCopied = false,
}: ContactItemProps) {
  const content = (
    <>
      <Image src={icon} alt="" width={22} height={22} />
      <span>{label}</span>
      {onClick && (
        <span className="text-emerald-300 leading-none" aria-hidden="true">
          {isCopied ? (
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m20 6-11 11-5-5" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </span>
      )}
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
