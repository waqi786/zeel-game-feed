import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";
import { usePreloader } from "../../hooks/usePreloader";
import { useSwipe } from "../../hooks/useSwipe";
import { useFeedStore } from "../../store/feedStore";
import { GameCard } from "./GameCard";
import { LoadingSkeleton } from "../common/LoadingSkeleton";
import { CommentSection } from "../Comments/CommentSection";
import { DiscoveryRail } from "./DiscoveryRail";
import { ShareSheet } from "./ShareSheet";
import { SaveSheet } from "./SaveSheet";
import type { Game } from "../../store/feedStore";

type Props = {
  onUpload: () => void;
  onAuth: () => void;
};

export function FeedViewport({ onUpload, onAuth }: Props) {
  const { games, currentIndex, isLoading, fetchNextPage, setCurrentIndex, scrollLocked, setScrollLock } = useFeedStore();
  const [commentUuid, setCommentUuid] = useState<string | null>(null);
  const [shareGame, setShareGame] = useState<Game | null>(null);
  const [saveGame, setSaveGame] = useState<Game | null>(null);

  useEffect(() => {
    void fetchNextPage(true);
  }, [fetchNextPage]);

  useEffect(() => {
    if (games.length && currentIndex >= games.length - 3) {
      void fetchNextPage();
    }
  }, [currentIndex, fetchNextPage, games.length]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "LOCK_SCROLL") setScrollLock(true);
      if (event.data?.type === "UNLOCK_SCROLL") setScrollLock(false);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setScrollLock]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName === "IFRAME") return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setCurrentIndex(currentIndex + 1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setCurrentIndex(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, setCurrentIndex]);

  usePreloader(games, currentIndex);
  const swipe = useSwipe({ currentIndex, maxIndex: games.length - 1, onIndex: setCurrentIndex });
  const visible = useMemo(
    () =>
      games
        .map((game, index) => ({ game, index }))
        .filter(({ index }) => Math.abs(index - currentIndex) <= 1),
    [games, currentIndex]
  );

  if (isLoading && !games.length) {
    return <LoadingSkeleton />;
  }

  if (!games.length) {
    return (
      <div className="grid h-[100dvh] place-items-center px-6 text-center text-white">
        <div>
          <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-zeel-primary shadow-neon">
            <UploadCloud size={42} />
          </div>
          <h1 className="text-3xl font-black">Be the first to upload a game!</h1>
          <button className="mt-7 rounded-full bg-white px-6 py-3 font-black text-black" onClick={onUpload}>
            Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <DiscoveryRail onAuth={onAuth} />
    <div className="relative mx-auto h-[100dvh] max-w-[600px] overflow-hidden bg-[#101014] lg:my-4 lg:h-[calc(100dvh-32px)] lg:max-w-[500px] lg:rounded-md lg:border lg:border-white/10 lg:shadow-2xl">
      <motion.div
        className="absolute inset-0 touch-none"
        onPointerDown={scrollLocked ? undefined : swipe.onPointerDown}
        onPointerUp={scrollLocked ? undefined : swipe.onPointerUp}
        onPointerCancel={scrollLocked ? undefined : swipe.onPointerCancel}
        onWheel={swipe.onWheel}
      >
        {visible.map(({ game, index }) => (
          <motion.div
            key={game.uuid}
            className="absolute inset-0"
            animate={{ y: `${(index - currentIndex) * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <GameCard
              game={game}
              active={index === currentIndex}
              onAuth={onAuth}
              onComments={() => setCommentUuid(game.uuid)}
              onShare={() => setShareGame(game)}
              onSave={() => setSaveGame(game)}
              onNextGame={() => setCurrentIndex(currentIndex + 1)}
              onPreviousGame={() => setCurrentIndex(currentIndex - 1)}
              isPlaying={index === currentIndex}
              />
          </motion.div>
        ))}
      </motion.div>
      <CommentSection gameUuid={commentUuid} onClose={() => setCommentUuid(null)} onAuth={onAuth} />
    </div>
    <ShareSheet game={shareGame} onClose={() => setShareGame(null)} />
    <SaveSheet game={saveGame} onClose={() => setSaveGame(null)} />
    </>
  );
}
