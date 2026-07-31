import { create } from "zustand";
import { api } from "../services/api";
import type { Game } from "./feedStore";

type UploadState = {
  uploadProgress: number;
  isUploading: boolean;
  uploadGame: (payload: {
    title: string;
    description: string;
    file: File;
    thumbnail?: File;
  }) => Promise<Game>;
};

export const useUploadStore = create<UploadState>((set) => ({
  uploadProgress: 0,
  isUploading: false,
  async uploadGame(payload) {
    const form = new FormData();
    form.append("title", payload.title);
    form.append("description", payload.description);
    form.append("file", payload.file);
    if (payload.thumbnail) form.append("thumbnail", payload.thumbnail);

    set({ isUploading: true, uploadProgress: 0 });
    try {
      const { data } = await api.post("/games/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress(event) {
          if (!event.total) return;
          set({ uploadProgress: Math.round((event.loaded / event.total) * 100) });
        }
      });
      return data.game;
    } finally {
      set({ isUploading: false, uploadProgress: 0 });
    }
  }
}));
