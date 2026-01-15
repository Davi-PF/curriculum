/* eslint-disable @next/next/no-img-element */

import '@testing-library/jest-dom';

import React from 'react';
import { vi } from 'vitest';

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

