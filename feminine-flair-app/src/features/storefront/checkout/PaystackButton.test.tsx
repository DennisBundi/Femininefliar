import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const { createOrder, payWithPaystack } = vi.hoisted(() => ({
  createOrder: vi.fn(),
  payWithPaystack: vi.fn(),
}));
let mockedStatus: string | null = null;

vi.mock("@/lib/orders", () => ({ createOrder }));
vi.mock("@/lib/paystack", () => ({ payWithPaystack: (...args: unknown[]) => payWithPaystack(...args) }));
vi.mock("@/hooks/useOrderStatus", () => ({ useOrderStatus: () => mockedStatus }));

import { PaystackButton } from "./PaystackButton";

const product = {
  id: "p1", slug: "amara-wrap-dress", name: "Amara Wrap Dress", category: "Dresses",
  priceKes: 3200, images: [], colors: [], sizes: [], stock: 12, unitsSold: 8, createdAt: "2026-08-01",
};

beforeEach(() => {
  createOrder.mockReset();
  payWithPaystack.mockReset();
  mockedStatus = null;
  useCart.setState({ lines: [{ product, qty: 1 }], deliveryMode: "pickup", isOpen: false });
});

function renderButton() {
  return render(
    <MemoryRouter>
      <PaystackButton
        customerName="Faith Wanjiru"
        phone="0722000101"
        email=""
        address=""
        disabled={false}
        onAttemptWhileInvalid={() => {}}
      />
    </MemoryRouter>
  );
}

describe("PaystackButton", () => {
  it("creates a real order and opens Paystack on click", async () => {
    createOrder.mockResolvedValue({ orderId: "order-123" });
    renderButton();

    fireEvent.click(screen.getByRole("button", { name: /pay with paystack/i }));

    await waitFor(() => expect(createOrder).toHaveBeenCalledWith(
      expect.objectContaining({ customerName: "Faith Wanjiru", totalKes: 3200 })
    ));
    expect(payWithPaystack).toHaveBeenCalledWith(
      expect.objectContaining({ reference: "order-123" })
    );
  });

  it("keeps the cart intact and does not treat click as success when disabled", async () => {
    const onAttemptWhileInvalid = vi.fn();
    render(
      <MemoryRouter>
        <PaystackButton
          customerName="" phone="" email="" address=""
          disabled onAttemptWhileInvalid={onAttemptWhileInvalid}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /pay with paystack/i }));

    expect(onAttemptWhileInvalid).toHaveBeenCalled();
    expect(createOrder).not.toHaveBeenCalled();
  });

  it("does NOT clear the cart when Paystack's onSuccess fires but the order status has not become paid", async () => {
    createOrder.mockResolvedValue({ orderId: "order-456" });
    // Simulate the Paystack popup itself reporting a successful charge client-side.
    payWithPaystack.mockImplementation(({ onSuccess }: { onSuccess: (ref: string) => void }) => {
      onSuccess("order-456");
    });

    renderButton();
    fireEvent.click(screen.getByRole("button", { name: /pay with paystack/i }));

    await waitFor(() => expect(payWithPaystack).toHaveBeenCalled());

    // mockedStatus is never flipped to "paid" (no webhook confirmation arrived),
    // so the cart must remain exactly as it was even though onSuccess ran.
    expect(mockedStatus).toBeNull();
    expect(useCart.getState().lines).toHaveLength(1);
  });

  it("clears the cart only once useOrderStatus reports the order as paid", async () => {
    createOrder.mockResolvedValue({ orderId: "order-789" });
    payWithPaystack.mockImplementation(() => {});

    const { rerender } = renderButton();
    fireEvent.click(screen.getByRole("button", { name: /pay with paystack/i }));

    await waitFor(() => expect(payWithPaystack).toHaveBeenCalled());

    // Still not paid yet - cart must stay intact.
    expect(useCart.getState().lines).toHaveLength(1);

    // Simulate the webhook (Task 9) confirming the charge server-side: useOrderStatus's
    // Realtime subscription would report the new status, so re-render as if that arrived.
    mockedStatus = "paid";
    rerender(
      <MemoryRouter>
        <PaystackButton
          customerName="Faith Wanjiru"
          phone="0722000101"
          email=""
          address=""
          disabled={false}
          onAttemptWhileInvalid={() => {}}
        />
      </MemoryRouter>
    );

    await waitFor(() => expect(useCart.getState().lines).toHaveLength(0));
  });
});
