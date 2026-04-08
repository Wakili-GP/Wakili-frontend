import { create } from "zustand";

export type AuthModalMode =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password";

interface AuthModalState {
  isOpen: boolean;
  mode: AuthModalMode;
  setOpen: (open: boolean) => void;
  setMode: (mode: AuthModalMode) => void;
  openLogin: () => void;
  openRegister: () => void;
  openForgotPassword: () => void;
  openResetPassword: () => void;
  close: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  mode: "login",
  setOpen: (open) => set({ isOpen: open }),
  setMode: (mode) => set({ mode }),
  openLogin: () => set({ isOpen: true, mode: "login" }),
  openRegister: () => set({ isOpen: true, mode: "register" }),
  openForgotPassword: () => set({ isOpen: true, mode: "forgot-password" }),
  openResetPassword: () => set({ isOpen: true, mode: "reset-password" }),
  close: () => set({ isOpen: false }),
}));
