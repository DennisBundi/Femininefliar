export async function verifyPaystackSignature(body: string, signatureHeader: string | null, secret: string): Promise<boolean> {
  if (!signatureHeader) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const expected = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (expected.length !== signatureHeader.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  }
  return mismatch === 0;
}

export interface ChargeSuccessEvent {
  event: string;
  data: { reference: string; amount: number; status: string };
}

export function parseChargeEvent(body: string): ChargeSuccessEvent | null {
  try {
    const parsed = JSON.parse(body);
    if (parsed?.event === "charge.success" && typeof parsed?.data?.reference === "string") {
      return parsed as ChargeSuccessEvent;
    }
    return null;
  } catch {
    return null;
  }
}
