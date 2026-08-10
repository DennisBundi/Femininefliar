import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

describe("useOrderStatus", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("updates when a postgres_changes event reports the order is paid", async () => {
    let changeHandler: (payload: { new: { status: string } }) => void = () => {};

    const channel = {
      on: vi.fn((_event: string, _filter: unknown, handler: typeof changeHandler) => {
        changeHandler = handler;
        return channel;
      }),
      subscribe: vi.fn(() => channel),
    };
    const removeChannel = vi.fn();
    const from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { status: "pending" }, error: null }),
        })),
      })),
    }));

    vi.doMock("@/lib/supabase", () => ({
      supabase: { channel: vi.fn(() => channel), removeChannel, from },
    }));
    const { useOrderStatus } = await import("./useOrderStatus");

    const { result } = renderHook(() => useOrderStatus("order-123"));

    await waitFor(() => expect(result.current).toBe("pending"));

    changeHandler({ new: { status: "paid" } });

    await waitFor(() => expect(result.current).toBe("paid"));
  });

  it("returns null and does not subscribe when orderId is null", async () => {
    const channel = { on: vi.fn(), subscribe: vi.fn() };
    const channelFactory = vi.fn(() => channel);
    const removeChannel = vi.fn();
    const from = vi.fn();

    vi.doMock("@/lib/supabase", () => ({
      supabase: { channel: channelFactory, removeChannel, from },
    }));
    const { useOrderStatus } = await import("./useOrderStatus");

    const { result } = renderHook(() => useOrderStatus(null));

    expect(result.current).toBeNull();
    expect(channelFactory).not.toHaveBeenCalled();
    expect(from).not.toHaveBeenCalled();
  });

  it("removes the realtime channel on unmount", async () => {
    const channel = {
      on: vi.fn(function (this: unknown) {
        return this;
      }),
      subscribe: vi.fn(function (this: unknown) {
        return this;
      }),
    };
    const removeChannel = vi.fn();
    const from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { status: "pending" }, error: null }),
        })),
      })),
    }));

    vi.doMock("@/lib/supabase", () => ({
      supabase: { channel: vi.fn(() => channel), removeChannel, from },
    }));
    const { useOrderStatus } = await import("./useOrderStatus");

    const { result, unmount } = renderHook(() => useOrderStatus("order-456"));

    await waitFor(() => expect(result.current).toBe("pending"));

    unmount();

    expect(removeChannel).toHaveBeenCalledWith(channel);
  });
});
