import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Copy, Download, ExternalLink, Flag, Heart, Link, MessageCircle, Send, X } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";
import type { Game } from "../../store/feedStore";
import { apiOrigin } from "../../services/api";

type Props = {
  game: Game | null;
  onClose: () => void;
};

const shareTargets = [
  ["WhatsApp", Send],
  ["Instagram", ExternalLink],
  ["Messenger", MessageCircle],
  ["Copy Link", Link],
  ["Save Card", Download],
  ["More", Copy]
] as const;

export function ShareSheet({ game, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const link = game ? `${window.location.origin}${game.shareUrl}` : "";

  const copy = async (message = "Link copied") => {
    await navigator.clipboard?.writeText(link);
    window.dispatchEvent(new CustomEvent("zeel:toast", { detail: message }));
  };

  const download = async () => {
    if (!cardRef.current || !game) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#0A0A0F", scale: 2 });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${game.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-zeel-card.png`;
    a.click();
  };

  const action = (label: string) => {
    if (label === "Save Card") return void download();
    void copy(label === "Copy Link" ? "Link copied" : `${label} share prepared`);
  };

  return (
    <AnimatePresence>
      {game ? (
        <motion.div className="fixed inset-0 z-[74] grid place-items-end bg-black/70 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="w-full max-w-[560px] rounded-t-md border border-white/10 bg-[#0B0F17]/98 p-5 text-white shadow-neon sm:mx-auto sm:mb-6 sm:rounded-md"
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/70" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black">Share this game</h2>
              <button className="icon-btn" onClick={onClose} aria-label="Close share">
                <X size={18} />
              </button>
            </div>

            <div ref={cardRef} className="mb-5 overflow-hidden rounded-md border border-white/10 bg-[#0A0A0F] p-5">
              <div className="mb-8 flex items-center justify-between">
                <div className="text-2xl font-black text-zeel-primary">ZEEL</div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">{game.genre}</div>
              </div>
              <div className="text-3xl font-black leading-tight">{game.title}</div>
              <div className="mt-2 text-sm font-bold text-white/60">@{game.author.username}</div>
              <div className="mt-7 grid grid-cols-2 gap-3 text-sm font-black">
                <div className="rounded-md bg-white/10 p-3">{game.playCount.toLocaleString()} plays</div>
                <div className="rounded-md bg-white/10 p-3">{game.likesCount.toLocaleString()} likes</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {shareTargets.map(([label, Icon]) => (
                <button key={label} className="grid place-items-center gap-2 text-xs font-bold text-white/80" onClick={() => action(label)}>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.08] text-white">
                    <Icon size={22} />
                  </span>
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 overflow-hidden rounded-md border border-white/10">
              <SheetAction icon={<Bookmark size={18} />} label="Save Game" onClick={() => copy("Game saved")} />
              <SheetAction icon={<Heart size={18} />} label="Add to Favorites" onClick={() => copy("Added to favorites")} />
              <SheetAction icon={<Flag size={18} />} label="Report Game" onClick={() => copy("Report flow opened")} />
            </div>

            <button className="mt-5 h-12 w-full rounded-md border border-white/10 bg-white/[0.06] font-black" onClick={onClose}>
              Cancel
            </button>
            <img src={`${apiOrigin}/api/v1/og/game/${game.uuid}`} className="sr-only" alt="" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SheetAction({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex h-12 w-full items-center gap-3 border-b border-white/10 px-4 text-left text-sm font-bold last:border-b-0">
      <span className="text-zeel-primary">{icon}</span>
      {label}
    </button>
  );
}
