import { create } from "zustand";

interface ToastState {
  message: string;
  visible: boolean;
  show: (message: string) => void;
}

let hideTimer: ReturnType<typeof setTimeout>;

export const useToast = create<ToastState>((set) => ({
  message: "",
  visible: false,
  show: (message) => {
    clearTimeout(hideTimer);
    set({ message, visible: true });
    hideTimer = setTimeout(() => set({ visible: false }), 1800);
  },
}));
