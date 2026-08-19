import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StorefrontLayout } from "./StorefrontLayout";
import { HomePage } from "@/features/storefront/home/HomePage";
import { AboutPage } from "@/features/storefront/home/AboutPage";
import { ShopPage } from "@/features/storefront/catalog/ShopPage";
import { ProductDetailPage } from "@/features/storefront/product/ProductDetailPage";
import { CartPage } from "@/features/storefront/cart/CartPage";
import { CheckoutPage } from "@/features/storefront/checkout/CheckoutPage";
import { LoginPage } from "@/features/storefront/account/LoginPage";
import { OrderHistoryPage } from "@/features/storefront/account/OrderHistoryPage";
import { WishlistPage } from "@/features/storefront/account/WishlistPage";
import { ReturnsPage } from "@/features/storefront/policies/ReturnsPage";
import { AdminLayout } from "@/features/admin/AdminLayout";
import { AdminGuard } from "@/features/admin/AdminGuard";
import { DashboardPage } from "@/features/admin/dashboard/DashboardPage";
import { ProductTable } from "@/features/admin/products/ProductTable";
import { OrderTable } from "@/features/admin/orders/OrderTable";
import { CustomerTable } from "@/features/admin/customers/CustomerTable";
import { Register } from "@/features/admin/pos/Register";
import { ReportsPage } from "@/features/admin/reports/ReportsPage";
import { Toast } from "@/components/shared/Toast";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account/login" element={<LoginPage />} />
          <Route path="/account/orders" element={<OrderHistoryPage />} />
          <Route path="/account/wishlist" element={<WishlistPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductTable />} />
          <Route path="orders" element={<OrderTable />} />
          <Route path="customers" element={<CustomerTable />} />
          <Route path="pos" element={<Register />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
