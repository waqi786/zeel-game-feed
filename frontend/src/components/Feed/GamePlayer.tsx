import { RefreshCcw } from "lucide-react";
import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { apiOrigin } from "../../services/api";
import { LoadingSkeleton } from "../common/LoadingSkeleton";
import type { Game } from "../../store/feedStore";
import { useAudioStore } from "../../store/audioStore";

type Props = {
  game: Game;
  active: boolean;
  isPlaying: boolean;
  onNextGame: () => void;
  onPreviousGame: () => void;
};

type GestureMode = "pending" | "game" | "feed";

export function GamePlayer({ game, active, isPlaying, onNextGame, onPreviousGame }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const muted = useAudioStore((state) => state.muted);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const gestureRef = useRef({
    active: false,
    mode: "pending" as GestureMode,
    startX: 0,
    startY: 0,
    sentDown: false
  });
  const src = useMemo(
    () => `${apiOrigin}${game.gameUrl}?v=${encodeURIComponent(`${game.uuid}-${reloadKey}-${Date.now()}`)}`,
    [game.gameUrl, game.uuid, reloadKey]
  );

  const sendToGame = (message: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(message, "*");
  };

  const forwardPoint = (x: number, y: number, kind: "pointerdown" | "pointermove") => {
    const rect = iframeRef.current?.getBoundingClientRect();
    const localX = rect ? Math.max(0, Math.min(rect.width, x - rect.left)) : x;
    const localY = rect ? Math.max(0, Math.min(rect.height, y - rect.top)) : y;
    sendToGame({
      type: "ZEEL_POINTER",
      kind,
      x: localX,
      y: localY,
      width: rect?.width ?? window.innerWidth,
      height: rect?.height ?? window.innerHeight
    });
  };

  const sendBoost = () => {
    navigator.vibrate?.(8);
    sendToGame({ type: "ZEEL_CONTROL", control: "BOOST" });
  };

  const beginGameGesture = (x: number, y: number) => {
    const gesture = gestureRef.current;
    if (gesture.sentDown) return;
    gesture.sentDown = true;
    forwardPoint(x, y, "pointerdown");
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    gestureRef.current = {
      active: true,
      mode: "pending",
      startX: event.clientX,
      startY: event.clientY,
      sentDown: false
    };
    // Immediately register the tap/press with the game so tap-driven
    // games (Tower Stack, Flappy-style, etc.) respond the instant a
    // press begins, regardless of whether it later turns into a drag.
    beginGameGesture(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture.active) return;

    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (gesture.mode === "pending") {
      if (absY > 24 && absY > absX * 1.15) {
        gesture.mode = "feed";
        event.stopPropagation();
        return;
      }

      if (absX > 12 || (absX > 8 && absX > absY + 4)) {
        gesture.mode = "game";
      }
    }

    if (gesture.mode === "game") {
      forwardPoint(event.clientX, event.clientY, "pointermove");
    } else if (gesture.mode === "feed") {
      event.stopPropagation();
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture.active) return;

    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    const isTap = Math.hypot(dx, dy) < 14;

    if (gesture.mode === "pending" && isTap) {
      sendBoost();
    } else if (gesture.mode === "feed") {
      event.stopPropagation();
      if (Math.abs(dy) > 50) {
        if (dy < 0) onNextGame();
        else onPreviousGame();
        navigator.vibrate?.(12);
      }
    } else if (gesture.mode === "game") {
      forwardPoint(event.clientX, event.clientY, "pointermove");
    }

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    gestureRef.current = { active: false, mode: "pending", startX: 0, startY: 0, sentDown: false };
  };

  const handlePointerCancel = () => {
    gestureRef.current = { active: false, mode: "pending", startX: 0, startY: 0, sentDown: false };
  };

  const startGame = () => {
    if (!loaded) return;
    setStarted(true);
    iframeRef.current?.focus();
    sendToGame({ type: "START_GAME" });
    sendToGame({ type: "globalMute", value: muted });
  };

  const sendControl = (control: "LEFT" | "RIGHT" | "JUMP" | "BOOST") => {
    if (!started) startGame();
    navigator.vibrate?.(8);
    sendToGame({ type: "ZEEL_CONTROL", control });
  };

  useEffect(() => {
    sendToGame({ type: "globalMute", value: muted });
  }, [muted, loaded]);

  useEffect(() => {
    if (!active || loaded) return;
    const timer = window.setTimeout(() => {
      setFailed(true);
    }, 10_000);
    return () => window.clearTimeout(timer);
  }, [active, game.uuid, reloadKey, loaded]);

  useEffect(() => {
    if (!active || !isPlaying || !loaded || !started) return;
    sendToGame({ type: "globalMute", value: muted });
  }, [active, isPlaying, loaded, muted, started]);

  useEffect(() => {
    if (!active || !isPlaying || !loaded || started) return;
    setStarted(true);
    iframeRef.current?.focus();
    sendToGame({ type: "START_GAME" });
    sendToGame({ type: "globalMute", value: muted });
  }, [active, isPlaying, loaded, muted, started]);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setStarted(false);
  }, [game.uuid, reloadKey]);

  useEffect(() => {
    if (active) return;
    iframeRef.current = null;
    setLoaded(false);
    setFailed(false);
    setStarted(false);
    gestureRef.current = { active: false, mode: "pending", startX: 0, startY: 0, sentDown: false };
  }, [active]);

  useEffect(() => {
    if (!active || !started) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") sendControl("LEFT");
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") sendControl("RIGHT");
      if (event.key === " " || event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        event.preventDefault();
        sendControl("JUMP");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, started]);

  if (!active) {
    return game.thumbnailPath ? (
      <img className="h-full w-full object-cover" src={`${apiOrigin}${game.thumbnailPath}`} alt="" />
    ) : (
      <div className="h-full w-full bg-[#101014]" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-zeel-dark">
      {!loaded && !failed && isPlaying ? <LoadingSkeleton /> : null}
      {!isPlaying ? (
        <div className="absolute inset-0 z-10 bg-[#0B0B0F]">
          <div className="absolute left-1/2 top-[44%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zeel-primary/90" />
          <div className="absolute left-1/2 top-[44%] h-6 w-6 -translate-x-[20px] -translate-y-[20px] rounded-full bg-white/70" />
          <div className="absolute inset-x-6 top-[30%] h-px bg-white/8" />
          <div className="absolute inset-x-6 top-[56%] h-px bg-white/8" />
          <div className="absolute inset-x-6 top-[76%] h-px bg-white/8" />
        </div>
      ) : null}
      {failed ? (
        <div className="absolute inset-0 grid place-items-center px-8 text-center">
          <div className="space-y-5">
            <div className="text-2xl font-black text-white">Game could not load</div>
            <button
              onClick={() => {
                setFailed(false);
                setLoaded(false);
                setReloadKey((key) => key + 1);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-zeel-primary px-5 py-3 font-bold text-white shadow-neon"
            >
              <RefreshCcw size={18} /> Reload
            </button>
          </div>
        </div>
      ) : null}
      <iframe
        key={reloadKey}
        title={game.title}
        src={src}
        className={`pointer-events-none h-full w-full border-0 ${isPlaying ? "opacity-100" : "opacity-0"}`}
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-modals"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        ref={(node) => {
          iframeRef.current = node;
          if (node?.contentWindow) {
            node.contentWindow.postMessage({ type: "globalMute", value: muted }, "*");
          }
        }}
      />
      {isPlaying && loaded && !started ? (
        <div className="absolute left-1/2 top-[43%] z-30 -translate-x-1/2 -translate-y-1/2 text-center text-sm font-black uppercase tracking-normal text-white/80">
          Loading Controls
        </div>
      ) : null}
      {isPlaying && started ? (
        <div
          className="absolute inset-0 z-10 touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerCancel}
        />
      ) : null}
    </div>
  );
}
