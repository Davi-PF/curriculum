import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useModal } from '../../components/Skills/hooks/useModal';

describe('useModal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start closed', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isClosing).toBe(false);
    expect(result.current.isModalVisible).toBe(false);
  });

  it('should open modal after delay', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });

    // ainda não abriu
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isModalVisible).toBe(false);

    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.isClosing).toBe(false);
    expect(result.current.isModalVisible).toBe(true);
  });

  it('should close modal and keep visible while closing', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
      vi.advanceTimersByTime(10);
    });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isClosing).toBe(true);
    expect(result.current.isModalVisible).toBe(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isClosing).toBe(false);
    expect(result.current.isModalVisible).toBe(false);
  });
});
