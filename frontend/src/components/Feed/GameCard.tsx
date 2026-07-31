import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Game } from "../../store/feedStore";
import { GamePlayer } from "./GamePlayer";
import { InteractionBar } from "./InteractionBar";
import { useGameTelemetry } from "../../hooks/useGameTelemetry";

type Props = {
  game: Game;
  active: boolean;
  onComments: () => void;
  onAuth: () => void;
  onShare: () => void;
  onSave: () => void;
  onNextGame: () => void;
  onPreviousGame: () => void;
  isPlaying: boolean;
};

export function GameCard({
  game,
  active,
  onComments,
  onAuth,
  onShare,
  onSave,
  onNextGame,
  onPreviousGame,
  isPlaying
}: Props) {
  const [expanded, setExpanded] = useState(false);
  useGameTelemetry(game.uuid, active && isPlaying);

  return (
    <motion.section
      className={`absolute inset-0 overflow-hidden bg-black ${active ? "" : "pointer-events-none"}`}
      aria-hidden={!active}
      initial={{ opacity: 0.6, scale: 0.98 }}
      animate={{ opacity: 1, scale: active ? 1 : 0.985 }}
      transition={{ duration: 0.28 }}
    >
      <GamePlayer
        game={game}
        active={active}
        isPlaying={isPlaying}
        onNextGame={onNextGame}
        onPreviousGame={onPreviousGame}
      />
      {active ? (
        <InteractionBar game={game} onComments={onComments} onAuth={onAuth} onShare={onShare} onSave={onSave} />
      ) : null}
      {active ? (
      <div className="pointer-events-none absolute inset-x-0 bottom-[86px] z-20 px-4 pb-[env(safe-area-inset-bottom)] sm:bottom-24 lg:bottom-[92px]">
        <div className="max-w-[74%] text-white">
          <div className="mb-3 flex items-center gap-2">
            <img
              src={game.author.avatar ?? "/zeel-logo.png"}
              alt=""
              className="h-8 w-8 rounded-full border border-white/70 object-cover"
            />
            <div className="min-w-0">
              <div className="truncate text-xs font-black">@{game.author.username}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">ZEEL Creator</div>
            </div>
          </div>
          <h2 className="text-2xl font-black leading-tight tracking-normal">{game.title}</h2>
          {game.description ? (
            <button
              className="pointer-events-auto mt-2 flex max-w-full items-end gap-1 text-left text-sm leading-5 text-white/80"
              onClick={() => setExpanded((value) => !value)}
            >
              <span className={expanded ? "" : "line-clamp-2"}>{game.description}</span>
              <ChevronDown size={16} className={expanded ? "shrink-0 rotate-180" : "shrink-0"} />
            </button>
          ) : null}
        </div>
      </div>
      ) : null}
    </motion.section>
  );
}
