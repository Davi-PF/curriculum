type ActivityLinkType = 'github' | 'colab' | 'demo' | 'website';

export interface ActivityLink {
  type: ActivityLinkType;
  label: string;
  url: string;
}

const linkIconMap: Record<ActivityLinkType, string> = {
  github: '/images/icons/github.png',
  colab: '/images/icons/colab.png',
  demo: '/images/icons/youtube.png',
  website: '/images/icons/link.png'
};

export function getLinkIcon(type: ActivityLinkType): string {
  return linkIconMap[type];
}