import { create } from "zustand";
import { api } from "../services/api";

export type Game = {
  uuid: string;
  title: string;
  description: string | null;
  thumbnailPath: string | null;
  genre: string;
  hotnessScore: number;
  fileSizeMB: number;
  playCount: number;
  createdAt: string;
  author: { username: string; avatar: string | null; uuid: string };
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount: number;
  likedByMe: boolean;
  gameUrl: string;
  shareUrl: string;
};

type FeedState = {
  games: Game[];
  currentIndex: number;
  isLoading: boolean;
  nextCursor: string | null;
  seenIds: string[];
  hasBooted: boolean;
  feedMode: "following" | "for-you";
  scrollLocked: boolean;
  setCurrentIndex: (index: number) => void;
  setFeedMode: (mode: "following" | "for-you") => void;
  setScrollLock: (locked: boolean) => void;
  fetchNextPage: (fresh?: boolean) => Promise<void>;
  addGame: (game: Game) => void;
  likeGameLocally: (uuid: string) => Promise<void>;
};

export const useFeedStore = create<FeedState>((set, get) => ({
  games: [],
  currentIndex: 0,
  isLoading: false,
  nextCursor: null,
  seenIds: [],
  hasBooted: false,
  feedMode: "for-you",
  scrollLocked: false,
  setCurrentIndex(index) {
    const max = Math.max(get().games.length - 1, 0);
    const next = Math.max(0, Math.min(index, max));
    const game = get().games[next];
    set((state) => ({
      currentIndex: next,
      seenIds: game ? uniqueIds([...state.seenIds, game.uuid]) : state.seenIds
    }));
  },
  setFeedMode(feedMode) {
    set({ feedMode });
    void get().fetchNextPage(true);
  },
  setScrollLock(scrollLocked) {
    set({ scrollLocked });
  },
  async fetchNextPage(fresh = false) {
    const { isLoading, nextCursor, hasBooted, feedMode, seenIds } = get();
    if (isLoading || (!fresh && hasBooted && !nextCursor)) return;
    set({ isLoading: true });
    const { data } = await api.get("/games/feed", {
      params: {
        cursor: fresh || seenIds.length ? undefined : nextCursor,
        exclude: fresh ? undefined : seenIds.slice(-950).join(","),
        limit: 20,
        mode: feedMode,
        refresh: fresh ? Date.now() : undefined,
        requestId: `${Date.now()}-${Math.random().toString(36).slice(2)}`
      }
    });
    const incoming = data.games;
    set((state) => ({
      games: fresh ? incoming : dedupeGames([...state.games, ...incoming]),
      nextCursor: data.nextCursor,
      isLoading: false,
      hasBooted: true,
      currentIndex: fresh ? 0 : state.currentIndex,
      seenIds: fresh ? uniqueIds(incoming.slice(0, 1).map((game: Game) => game.uuid)) : uniqueIds([...state.seenIds, ...incoming.map((game: Game) => game.uuid)])
    }));
  },
  addGame(game) {
    set((state) => ({ games: [game, ...state.games], currentIndex: 0 }));
  },
  async likeGameLocally(uuid) {
    const current = get().games.find((game) => game.uuid === uuid);
    if (!current) return;

    set((state) => ({
      games: state.games.map((game) =>
        game.uuid === uuid
          ? {
              ...game,
              likedByMe: !game.likedByMe,
              likesCount: game.likesCount + (game.likedByMe ? -1 : 1)
            }
          : game
      )
    }));

    try {
      const { data } = await api.post(`/games/${uuid}/like`);
      set((state) => ({
        games: state.games.map((game) =>
          game.uuid === uuid
            ? { ...game, likedByMe: data.liked, likesCount: data.likesCount }
            : game
        )
      }));
    } catch {
      set((state) => ({
        games: state.games.map((game) => (game.uuid === uuid ? current : game))
      }));
    }
  }
}));

function dedupeGames(games: Game[]) {
  return [...new Map(games.map((game) => [game.uuid, game])).values()];
}

function uniqueIds(ids: string[]) {
  return [...new Set(ids)].slice(-1000);
}
