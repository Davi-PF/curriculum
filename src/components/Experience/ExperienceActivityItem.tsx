import Image from "next/image";
import { Activity } from "../../types/ExperienceRelated/Activity";
import { ActivityVariant, getLinkIcon } from "../../types/ExperienceRelated/ActivityLink";

interface ExperienceActivityItemProps {
  readonly activity: Activity;
}

const styles = {
  experience: {
    title: "text-sm",
    description: "text-xs text-emerald-400/70",
    showDescription: true,
  },
  project: {
    title: "text-sm",
    description: "text-xs text-emerald-400/60",
    showDescription: "sm:block hidden",
  },
};

export function ExperienceActivityItem({
  activity,
}: ExperienceActivityItemProps) {
  const primaryLink = activity.links?.[0];

  const variant: ActivityVariant = primaryLink?.variant ?? "experience";

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
        {primaryLink ? (
          <div className="flex items-center gap-1">
            <a
              href={primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-emerald-300 font-medium hover:underline ${style.title}`}
            >
              {activity.title}
            </a>

            <span className="text-emerald-400/70 text-xs">↗</span>

            <Image
              src={getLinkIcon(primaryLink.type)}
              alt={primaryLink.type}
              width={16}
              height={16}
            />
          </div>
        ) : (
          <span className={`text-emerald-300 ${style.title}`}>
            {activity.title}
          </span>
        )}

        {style.showDescription && (
          <p className={`${style.description} ${style.showDescription}`}>
            {activity.description}
          </p>
        )}
      </div>
    </li>
  );
}
