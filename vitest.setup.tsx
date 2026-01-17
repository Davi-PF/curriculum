/* eslint-disable @next/next/no-img-element */

import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const imgProps = { ...props };

    // Remove props específicas do next/image que não existem no DOM
    delete (imgProps as { fill?: unknown }).fill;
    delete (imgProps as { priority?: unknown }).priority;
    delete (imgProps as { sizes?: unknown }).sizes;
    delete (imgProps as { quality?: unknown }).quality;
    delete (imgProps as { placeholder?: unknown }).placeholder;
    delete (imgProps as { blurDataURL?: unknown }).blurDataURL;

    return <img alt="test-img" {...imgProps} />;
  },
}));
