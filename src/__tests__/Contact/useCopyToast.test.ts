import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCopyToast } from '../../components/Contact/useCopyToast';

describe('useCopyToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should initialize with copiedField as null', () => {
    const { result } = renderHook(() => useCopyToast());

    expect(result.current.copiedField).toBeNull();
  });

  it('should set copiedField when copy succeeds and reset after timeout', async () => {
    (navigator.clipboard.writeText as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useCopyToast(2000));

    await act(async () => {
      await result.current.copyToClipboard('test@email.com', 'email');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test@email.com');
    expect(result.current.copiedField).toBe('email');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copiedField).toBeNull();
  });

  it('should set copiedField as error when copy fails and reset after timeout', async () => {
    (navigator.clipboard.writeText as unknown as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('copy failed'));

    const { result } = renderHook(() => useCopyToast(2000));

    await act(async () => {
      await result.current.copyToClipboard('123', 'phone');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('123');
    expect(result.current.copiedField).toBe('error');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copiedField).toBeNull();
  });
});
