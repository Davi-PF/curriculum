/* eslint-disable @next/next/no-img-element */

import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

type IOStore = {
  callback: IntersectionObserverCallback | null;
  observe: ReturnType<typeof vi.fn> | null;
  disconnect: ReturnType<typeof vi.fn> | null;
};

const __ioStore: IOStore = {
  callback: null,
  observe: null,
  disconnect: null,
};

export function __resetIntersectionObserverStore() {
  __ioStore.callback = null;
  __ioStore.observe = null;
  __ioStore.disconnect = null;
}

export function __getIntersectionObserverStore() {
  return __ioStore;
}


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

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(cb: IntersectionObserverCallback) {
    __ioStore.callback = cb;
    __ioStore.observe = this.observe;
    __ioStore.disconnect = this.disconnect;
  }
}

vi.stubGlobal(
  "IntersectionObserver",
  MockIntersectionObserver as unknown as typeof IntersectionObserver
);

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver as unknown as typeof IntersectionObserver);
