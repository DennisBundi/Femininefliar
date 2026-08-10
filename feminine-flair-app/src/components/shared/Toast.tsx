import { useToast } from "@/hooks/useToast";

export function Toast() {
  const { message, visible } = useToast();
  return (
    <div
      className={`fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 rounded bg-ink px-6 py-3 text-sm text-white transition-opacity ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
