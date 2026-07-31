import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Heart, MessageCircle, Share2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import type { Game } from "../../store/feedStore";
import { useFeedStore } from "../../store/feedStore";
import { useAuthStore } from "../../store/authStore";
import { useAudioStore } from "../../store/audioStore";

type Props = {
  game: Game;
  onComments: () => void;
  onAuth: () => void;
  onShare: () => void;
  onSave: () => void;
};

export function InteractionBar({ game, onComments, onAuth, onShare, onSave }: Props) {
  const likeGameLocally = useFeedStore((state) => state.likeGameLocally);
  const user = useAuthStore((state) => state.user);
  const muted = useAudioStore((state) => state.muted);
  const toggleMuted = useAudioStore((state) => state.toggleMuted);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (muted) {
      stopFeedMusic();
      return;
    }
    startFeedMusic(game.uuid, game.title);
    return () => stopFeedMusic();
  }, [game.title, game.uuid, muted]);

  const like = () => {
    if (!user) return onAuth();
    navigator.vibrate?.(15);
    setBurst((count) => count + 1);
    void likeGameLocally(game.uuid);
  };

  const share = async () => {
    const url = `${window.location.origin}${game.shareUrl}`;
    await navigator.clipboard?.writeText(url);
    window.dispatchEvent(new CustomEvent("zeel:toast", { detail: "Link copied" }));
  };

  return (
    <div className="absolute bottom-[82px] right-3 z-40 flex flex-col items-center gap-2 pb-[env(safe-area-inset-bottom)] sm:right-4 lg:bottom-[78px]">
      <button className="relative action-btn" onClick={like} aria-label="Like">
        <Heart fill={game.likedByMe ? "#F50575" : "transparent"} color={game.likedByMe ? "#F50575" : "white"} />
        <AnimatePresence>
          {burst ? (
            <>
              {Array.from({ length: 8 }).map((_, index) => {
                const angle = (Math.PI * 2 * index) / 8;
                return (
                  <motion.span
                    key={`${burst}-${index}`}
                    className="pointer-events-none absolute inset-0 grid place-items-center text-zeel-primary"
                    initial={{ scale: 0.5, opacity: 1, x: 0, y: 0 }}
                    animate={{
                      scale: 1.35,
                      x: Math.cos(angle) * 34,
                      y: Math.sin(angle) * 34 - 18,
                      opacity: 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <Heart fill="#F50575" size={14} />
                  </motion.span>
                );
              })}
            </>
          ) : null}
        </AnimatePresence>
      </button>
      <span className="counter">{compact(game.likesCount)}</span>

      <button className="action-btn" onClick={onComments} aria-label="Comments">
        <MessageCircle />
      </button>
      <span className="counter">{compact(game.commentsCount)}</span>

      <button className="action-btn" onClick={() => (user ? onSave() : onAuth())} aria-label="Save">
        <Bookmark />
      </button>
      <span className="counter">{compact(game.savesCount)}</span>

      <button className="action-btn" onClick={onShare} aria-label="Share">
        <Share2 />
      </button>
      <span className="counter">{compact(game.sharesCount)}</span>

      <button className="action-btn" onClick={toggleMuted} aria-label={muted ? "Music on" : "Music off"}>
        {muted ? <VolumeX /> : <Volume2 />}
      </button>
      <span className="counter">{muted ? "Music" : "On"}</span>
    </div>
  );
}

function compact(value: number) {
  return Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

let audioContext: AudioContext | null = null;
let musicTimer: number | null = null;

function startFeedMusic(seed: string, title: string) {
  stopFeedMusic();
  const AudioCtor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;
  audioContext = audioContext ?? new AudioCtor();
  void audioContext.resume();

  const code = Array.from(`${seed}-${title}`).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const scale = [0, 3, 5, 7, 10, 12, 15, 17];
  const base = 110 + (code % 5) * 22;
  let step = 0;

  const playNote = () => {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    osc.type = code % 3 === 0 ? "triangle" : code % 3 === 1 ? "sine" : "square";
    osc.frequency.value = base * Math.pow(2, scale[(step + code) % scale.length] / 12);
    filter.type = "lowpass";
    filter.frequency.value = 800 + (code % 7) * 120;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.2);
    step += 1;
  };

  playNote();
  musicTimer = window.setInterval(playNote, 280 + (code % 4) * 35);
}

function stopFeedMusic() {
  if (musicTimer) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}
