import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getLinkIcon,
  type ActivityLinkType,
} from '../../types/ExperienceRelated/ActivityLink';

describe('ActivityLink — getLinkIcon', () => {
  const expectedIcons: Record<ActivityLinkType, string> = {
    github: '/images/icons/github.png',
    colab: '/images/icons/colab.png',
    demo: '/images/icons/icon-youtube.png',
    website: '/globe.svg',
  };

  it.each(Object.entries(expectedIcons) as [ActivityLinkType, string][])(
    'maps link type "%s" to existing asset "%s"',
    (type, expectedPath) => {
      const resolvedIcon = getLinkIcon(type);
      expect(resolvedIcon).toBe(expectedPath);

      const diskPath = path.join(
        process.cwd(),
        'public',
        resolvedIcon.replace(/^\//, '')
      );
      expect(fs.existsSync(diskPath)).toBe(true);
    }
  );

  it('falls back to the website icon when given an unknown link type', () => {
    const fallbackIcon = getLinkIcon('unknown' as ActivityLinkType);
    expect(fallbackIcon).toBe('/globe.svg');
  });
});
