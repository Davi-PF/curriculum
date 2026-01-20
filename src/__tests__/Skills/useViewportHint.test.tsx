import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useViewportHint } from "../../components/Skills/hooks/useViewportHint";
import {
  __getIntersectionObserverStore,
  __resetIntersectionObserverStore,
} from "../../../vitest.setup";

type HarnessProps = Parameters<typeof useViewportHint>[0];

function HookHarness({ storageKey, threshold, durationMs, reducedMotionDurationMs }: NonNullable<HarnessProps>) {
  const { ref, showHint } = useViewportHint({
    storageKey,
    threshold,
    durationMs,
    reducedMotionDurationMs,
  });

  return (
    <div>
      {/* atribui ref no commit (antes do useEffect do hook rodar) */}
      <div
        data-testid="target"
        ref={ref as unknown as React.Ref<HTMLDivElement>}
      />
      <span data-testid="state">{showHint ? "on" : "off"}</span>
    </div>
  );
}

describe("useViewportHint", () => {
  const originalMatchMedia = globalThis.matchMedia;

  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
    __resetIntersectionObserverStore();

    globalThis.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof globalThis.matchMedia;
  });

  afterEach(() => {
    globalThis.matchMedia = originalMatchMedia;
    vi.useRealTimers();
  });

  it("não cria observer se a chave já estiver setada no sessionStorage", async () => {
    sessionStorage.setItem("skills_hint_seen", "1");

    render(
      <HookHarness
        storageKey="skills_hint_seen"
        threshold={0.4}
        durationMs={2800}
        reducedMotionDurationMs={2200}
      />
    );

    // flush effects
    await act(async () => {});

    expect(screen.getByTestId("state")).toHaveTextContent("off");

    const store = __getIntersectionObserverStore();
    expect(store.callback).toBeNull();
    expect(store.observe).toBeNull();
    expect(store.disconnect).toBeNull();
  });

  it("observa o elemento e ativa/desativa hint ao intersectar (durationMs)", async () => {
    render(
      <HookHarness
        storageKey="skills_hint_seen"
        threshold={0.4}
        durationMs={2800}
        reducedMotionDurationMs={2200}
      />
    );

    // flush effects para garantir que o observer foi criado
    await act(async () => {});

    const store = __getIntersectionObserverStore();
    expect(store.callback).not.toBeNull();
    expect(store.observe).not.toBeNull();
    expect(store.disconnect).not.toBeNull();

    const target = screen.getByTestId("target");
    expect(store.observe!).toHaveBeenCalledWith(target);

    act(() => {
      store.callback!(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.5,
            target: target as unknown as Element,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByTestId("state")).toHaveTextContent("on");
    expect(sessionStorage.getItem("skills_hint_seen")).toBe("1");
    expect(store.disconnect!).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(2800);
    });

    expect(screen.getByTestId("state")).toHaveTextContent("off");
  });

  it("usa reducedMotionDurationMs quando prefers-reduced-motion está ativo", async () => {
    globalThis.matchMedia = ((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof globalThis.matchMedia;

    render(
      <HookHarness
        storageKey="skills_hint_seen"
        threshold={0.4}
        durationMs={2800}
        reducedMotionDurationMs={2200}
      />
    );

    await act(async () => {});

    const store = __getIntersectionObserverStore();
    const target = screen.getByTestId("target");

    act(() => {
      store.callback!(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.5,
            target: target as unknown as Element,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByTestId("state")).toHaveTextContent("on");

    act(() => vi.advanceTimersByTime(2199));
    expect(screen.getByTestId("state")).toHaveTextContent("on");

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId("state")).toHaveTextContent("off");
  });

  it("não ativa hint quando intersectionRatio é menor que o threshold", async () => {
    render(
      <HookHarness
        storageKey="skills_hint_seen"
        threshold={0.4}
        durationMs={2800}
        reducedMotionDurationMs={2200}
      />
    );

    await act(async () => {});

    const store = __getIntersectionObserverStore();
    const target = screen.getByTestId("target");

    act(() => {
      store.callback!(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: target as unknown as Element,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByTestId("state")).toHaveTextContent("off");
    expect(sessionStorage.getItem("skills_hint_seen")).toBeNull();
  });
});
