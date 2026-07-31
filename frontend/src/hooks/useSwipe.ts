import { useCallback, useRef } from "react";
import type { PointerEvent, WheelEvent } from "react";

export function useSwipe(options: { currentIndex: number; maxIndex: number; onIndex: (index: number) => void }) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const snap = useCallback(
    (delta: number, velocity = 0) => {
      const distanceThreshold = 50;
      const velocityThreshold = 500;
      const shouldMove = Math.abs(delta) >= distanceThreshold || Math.abs(velocity) >= velocityThreshold;
      if (!shouldMove) return;
      const direction = Math.abs(velocity) >= velocityThreshold ? velocity : delta;
      const next = direction < 0 ? options.currentIndex + 1 : options.currentIndex - 1;
      const clamped = Math.max(0, Math.min(next, options.maxIndex));
      if (clamped !== options.currentIndex) {
        options.onIndex(clamped);
        navigator.vibrate?.(12);
      }
    },
    [options]
  );

  return {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      pointerStart.current = { x: event.clientX, y: event.clientY };
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      const start = pointerStart.current;
      pointerStart.current = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dy) <= Math.abs(dx) * 1.2) return;
      snap(dy);
    },
    onPointerCancel: () => {
      pointerStart.current = null;
    },
    onWheel: (event: WheelEvent) => snap(-event.deltaY)
  };
}
