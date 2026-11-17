import type { ReactNode } from "react";
import Image from "next/image";
import { Activity } from "../../types/ExperienceRelated/Activity";
import {
  ActivityLink,
  ActivityVariant,
  getLinkIcon,
} from "../../types/ExperienceRelated/ActivityLink";

interface ExperienceActivityItemProps {
  readonly activity: Activity;
}

interface ActivityLinkAnchorProps {
  readonly link: ActivityLink;
  readonly className: string;
  readonly iconClassName?: string;
  readonly children: ReactNode;
}

function ActivityLinkAnchor({
  link,
  className,
  iconClassName = "",
  children,
}: ActivityLinkAnchorProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}

      <Image
        src={getLinkIcon(link.type)}
        alt={link.type}
        width={16}
        height={16}
        className={`
          opacity-70
          transition-opacity
          group-hover:opacity-100
          ${iconClassName}
        `}
      />
    </a>
  );
}

const styles = {
  experience: {
    title: "text-sm",
    description: "text-xs text-emerald-300/90",
    showDescription: true,
    descriptionClass: ""
  },
  project: {
    title: "text-sm",
    description: "text-xs text-emerald-300/90",
    showDescription: true,
    descriptionClass: "hidden sm:block",
  },
};

export function ExperienceActivityItem({
  activity,
}: ExperienceActivityItemProps) {
  const validLinks = (activity.links ?? []).flatMap((link) => {
    const normalizedUrl = link.url?.trim() ?? "";
    if (!normalizedUrl) return [];
    return [{ ...link, url: normalizedUrl }];
  });
  const singleLink = validLinks.length === 1 ? validLinks[0] : undefined;

  const variant: ActivityVariant =
    validLinks[0]?.variant ?? activity.variant ?? "experience";

  const style = styles[variant];

  return (
    <li
      className="
        rounded-md
        px-2 py-1.5
        transition-colors
        hover:bg-stone-700/30
      "
    >
      <div className="flex flex-col gap-0.5">
        {singleLink ? (
          <ActivityLinkAnchor
            link={singleLink}
            iconClassName="ml-2"
            className="
              flex items-center gap-1
              text-emerald-300 font-medium
              hover:underline
              group
            "
          >
            <span className={style.title}>
              {activity.title}
            </span>
          </ActivityLinkAnchor>
        ) : (
          <>
            <span className={`text-emerald-300 font-medium ${style.title}`}>
              {activity.title}
            </span>

            {validLinks.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {validLinks.map((link, index) => (
                  <ActivityLinkAnchor
                    key={`${link.type}-${link.label}-${link.url}-${index}`}
                    link={link}
                    className="
                      inline-flex items-center gap-1.5
                      rounded-md px-2 py-0.5
                      text-xs font-medium text-emerald-300
                      bg-stone-800/50 border border-emerald-500/20
                      hover:bg-stone-700/60 hover:underline
                      transition-colors group
                    "
                  >
                    <span>{link.label || link.type}</span>
                  </ActivityLinkAnchor>
                ))}
              </div>
            )}
          </>
        )}

        {style.showDescription && activity.description && (
          <p
            className={`
              ${style.description}
              ${style.descriptionClass}
            `}
          >
            {activity.description}
          </p>
        )}
      </div>
    </li>
  );
}
