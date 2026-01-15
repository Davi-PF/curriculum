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
    descriptionClass: ""
  },
  project: {
    title: "text-sm",
    description: "text-xs text-emerald-400/60",
    showDescription: true,
    descriptionClass: "hidden sm:block",
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
          <a
            href={primaryLink.url}
            target="_blank"
            rel="noopener noreferrer"
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

            <Image
              src={getLinkIcon(primaryLink.type)}
              alt={primaryLink.type}
              width={16}
              height={16}
              className="
                ml-2
                opacity-70
                transition-opacity
                group-hover:opacity-100
              "
            />
          </a>
        ) : (
          <span className={`text-emerald-300 ${style.title}`}>
            {activity.title}
          </span>
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
