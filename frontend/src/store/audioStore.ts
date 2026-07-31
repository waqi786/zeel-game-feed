import { create } from "zustand";

type AudioState = {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
};

export const useAudioStore = create<AudioState>((set, get) => ({
  muted: localStorage.getItem("zeel-muted") !== "false",
  setMuted(muted) {
    localStorage.setItem("zeel-muted", String(muted));
    set({ muted });
    window.dispatchEvent(new CustomEvent("zeel:global-mute", { detail: muted }));
  },
  toggleMuted() {
    get().setMuted(!get().muted);
  }
}));
