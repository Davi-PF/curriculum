/* eslint-disable @next/next/no-img-element */

import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, beforeEach, vi } from "vitest";

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

type PendingDialogCloseTask = {
  readonly dialog: HTMLDialogElement;
  readonly run: () => void;
  timeoutId: ReturnType<typeof setTimeout> | null;
};

const pendingDialogCloseTasks = new Set<PendingDialogCloseTask>();

function cancelPendingDialogCloseTask(task: PendingDialogCloseTask) {
  if (task.timeoutId !== null) {
    clearTimeout(task.timeoutId);
    task.timeoutId = null;
  }
}

function clearPendingDialogCloseTasks() {
  for (const task of pendingDialogCloseTasks) {
    cancelPendingDialogCloseTask(task);
  }
  pendingDialogCloseTasks.clear();
}

export function flushPendingDialogCloseEvents() {
  const tasks = Array.from(pendingDialogCloseTasks);
  pendingDialogCloseTasks.clear();
  for (const task of tasks) {
    cancelPendingDialogCloseTask(task);
    task.run();
  }
}

const showModalMock = vi.fn(function (this: HTMLDialogElement) {
  if (!this.hasAttribute("open")) {
    this.setAttribute("open", "");
  }
});

const closeModalMock = vi.fn(function (
  this: HTMLDialogElement,
  returnValue?: string
) {
  if (!this.hasAttribute("open")) {
    return;
  }
  if (returnValue !== undefined) {
    this.returnValue = returnValue;
  }
  this.removeAttribute("open");

  let executed = false;
  const task: PendingDialogCloseTask = {
    dialog: this,
    timeoutId: null,
    run: () => {
      if (executed) return;
      executed = true;
      task.timeoutId = null;
      pendingDialogCloseTasks.delete(task);
      task.dialog.dispatchEvent(new Event("close"));
    },
  };

  pendingDialogCloseTasks.add(task);
  task.timeoutId = setTimeout(task.run, 0);
});

function installDialogMocks() {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    writable: true,
    value: showModalMock,
  });

  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    writable: true,
    value: closeModalMock,
  });
}

installDialogMocks();

beforeEach(() => {
  clearPendingDialogCloseTasks();
  showModalMock.mockClear();
  closeModalMock.mockClear();
  installDialogMocks();
});

afterEach(() => {
  clearPendingDialogCloseTasks();
  document.querySelectorAll("dialog[open]").forEach((dialog) => {
    dialog.removeAttribute("open");
  });
});
