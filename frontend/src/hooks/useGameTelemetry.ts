import { useEffect, useRef } from "react";
import { api } from "../services/api";

export function useGameTelemetry(gameUuid: string | undefined, active: boolean) {
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!gameUuid) return;
    if (active) {
      startedAt.current = Date.now();
      return;
    }
    flush(gameUuid, startedAt.current);
    startedAt.current = null;
  }, [active, gameUuid]);

  useEffect(() => {
    return () => {
      if (gameUuid) flush(gameUuid, startedAt.current);
    };
  }, [gameUuid]);
}

function flush(gameUuid: string, startedAt: number | null) {
  if (!startedAt) return;
  const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
  void api.post(`/games/${gameUuid}/play`, { durationSeconds }).catch(() => undefined);
}
