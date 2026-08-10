import { describe, it, expect } from "vitest";
import { verifyPaystackSignature } from "./verify";

describe("verifyPaystackSignature", () => {
  const secret = "sk_test_abc123";
  const body = '{"event":"charge.success","data":{"reference":"order-123"}}';

  it("accepts a signature that matches HMAC-SHA512 of the body with the secret", async () => {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
    const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
    const signature = Array.from(new Uint8Array(sigBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

    await expect(verifyPaystackSignature(body, signature, secret)).resolves.toBe(true);
  });

  it("rejects a mismatched signature", async () => {
    await expect(verifyPaystackSignature(body, "not-a-real-signature", secret)).resolves.toBe(false);
  });
});
