import { describe, it, expect, vi } from "vitest";
import { debounce } from "../hooks/useDebounceCallback";

describe("debounce utility", () => {
  it("should debounce function calls", async () => {
    vi.useFakeTimers();

    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    // Call multiple times rapidly
    debouncedFn("call1");
    debouncedFn("call2");
    debouncedFn("call3");

    // Should not be called yet
    expect(mockFn).not.toHaveBeenCalled();

    // Advance time past debounce delay
    vi.advanceTimersByTime(300);

    // Now it should be called once with last argument
    expect(mockFn).toHaveBeenCalledOnce();
    expect(mockFn).toHaveBeenCalledWith("call3");

    vi.useRealTimers();
  });

  it("should use default delay of 500ms", async () => {
    vi.useFakeTimers();

    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn); // No delay specified

    debouncedFn("test");

    // Advance by 400ms (less than default 500ms)
    vi.advanceTimersByTime(400);
    expect(mockFn).not.toHaveBeenCalled();

    // Advance by remaining 100ms
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });

  it("should reset timer on each call", async () => {
    vi.useFakeTimers();

    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("call1");
    vi.advanceTimersByTime(200); // Less than delay

    expect(mockFn).not.toHaveBeenCalled();

    debouncedFn("call2"); // This resets the timer
    vi.advanceTimersByTime(200); // Less than delay again

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100); // Now we pass the 300ms threshold
    expect(mockFn).toHaveBeenCalledOnce();
    expect(mockFn).toHaveBeenCalledWith("call2");

    vi.useRealTimers();
  });

  it("should work with multiple arguments", async () => {
    vi.useFakeTimers();

    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("arg1", "arg2", "arg3");

    vi.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledOnce();
    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", "arg3");

    vi.useRealTimers();
  });
});
