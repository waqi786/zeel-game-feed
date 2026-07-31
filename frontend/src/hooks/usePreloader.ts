import { useEffect } from "react";
import { apiOrigin } from "../services/api";
import type { Game } from "../store/feedStore";

export function usePreloader(games: Game[], currentIndex: number) {
  useEffect(() => {
    const links = games
      .slice(currentIndex + 1, currentIndex + 3)
      .filter(Boolean)
      .map((game) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "document";
        link.href = `${apiOrigin}${game.gameUrl}`;
        document.head.appendChild(link);
        return link;
      });

    return () => {
      links.forEach((link) => link.remove());
    };
  }, [games, currentIndex]);
}
