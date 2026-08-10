import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ShopPage } from "./ShopPage";

beforeEach(() => {
  useProducts.setState({ products: [], isLoading: true, error: null });
});

describe("ShopPage", () => {
  it("shows a loading state while products are being fetched", () => {
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText(/loading pieces/i)).toBeInTheDocument();
  });

  it("shows the empty-filters message once loaded with no matches", () => {
    useProducts.setState({ products: [], isLoading: false, error: null });
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByText(/no pieces match those filters yet/i)).toBeInTheDocument();
  });
});
