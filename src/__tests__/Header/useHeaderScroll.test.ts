import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useHeaderScroll } from '../../components/Header/useHeaderScroll';

function setScrollY(value: number) {
    Object.defineProperty(globalThis, 'scrollY', {
      writable: true,
      configurable: true,
      value
    });
  }

describe('useHeaderScroll', () => {
  it('retorna false inicialmente', () => {
    setScrollY(0);

    const { result } = renderHook(() => useHeaderScroll());

    expect(result.current).toBe(false);
  });

  it('retorna true quando scrollY ultrapassa o threshold padrão', () => {
    setScrollY(10);

    const { result } = renderHook(() => useHeaderScroll());

    act(() => {
      globalThis.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);
  });

  it('retorna false quando scrollY fica abaixo do threshold', () => {
    setScrollY(10);

    const { result } = renderHook(() => useHeaderScroll());

    act(() => {
      globalThis.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);

    act(() => {
      setScrollY(0);
      globalThis.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(false);
  });

  it('respeita threshold customizado', () => {
    setScrollY(6);

    const { result } = renderHook(() => useHeaderScroll(10));

    act(() => {
      globalThis.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(false);

    act(() => {
      setScrollY(11);
      globalThis.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(true);
  });
});
