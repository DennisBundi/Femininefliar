import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

test("guest can add a real product to cart and checkout creates a pending order", async ({ page }) => {
  await page.goto("/shop");

  await page.getByRole("link", { name: /amara wrap dress/i }).click();

  await page.getByRole("button", { name: /add to bag/i }).click();
  await page.getByRole("link", { name: /checkout/i }).click();

  await page.getByLabel(/full name/i).fill("Playwright Test Customer");
  await page.getByLabel(/phone number/i).fill("0722000199");
  await page.getByRole("button", { name: /pickup at simara mall/i }).click();

  await page.getByRole("button", { name: /pay with paystack/i }).click();

  await expect
    .poll(
      async () => {
        const { data } = await supabase
          .from("orders")
          .select("id, status")
          .eq("customer_name", "Playwright Test Customer")
          .eq("phone", "0722000199")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        return data?.status ?? null;
      },
      { timeout: 10_000 }
    )
    .toBe("pending");
});
