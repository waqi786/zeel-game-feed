import { create } from "zustand";
import { api } from "../services/api";

export type Collection = {
  uuid: string;
  name: string;
  gamesCount: number;
  games: Array<{ uuid: string; title: string; genre: string; playCount: number; likesCount: number }>;
};

type CollectionState = {
  collections: Collection[];
  fetchCollections: () => Promise<void>;
  createCollection: (name: string) => Promise<void>;
  toggleSave: (gameUuid: string, collectionUuid?: string) => Promise<boolean>;
};

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  async fetchCollections() {
    const { data } = await api.get("/collections");
    set({ collections: data.collections });
  },
  async createCollection(name) {
    await api.post("/collections", { name });
    await get().fetchCollections();
  },
  async toggleSave(gameUuid, collectionUuid) {
    const { data } = await api.post("/collections/save", { gameUuid, collectionUuid });
    await get().fetchCollections();
    return data.saved;
  }
}));
