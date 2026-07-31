import { ChevronLeft, ChevronRight, Heart, MessageCircle, Play, Share2, ShieldCheck, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import type { Game } from "../../store/feedStore";
import { GameThumb } from "../common/GameThumb";

type Props = {
  game: Game;
  onBack: () => void;
};

const names = ["arcade_master", "pixel_player", "cyber_ninja", "level_up", "neon_queen", "zeel_creator"];
const badges = ["First Play", "Score 1K", "Survivor", "Sharer"];

export default function GameDetailPage({ game, onBack }: Props) {
  return (
    <main className="relative z-10 mx-auto h-[100dvh] max-w-[600px] overflow-y-auto bg-[#09090B] px-4 pb-28 pt-[calc(1.1rem+env(safe-area-inset-top))] text-white lg:my-4 lg:h-[calc(100dvh-32px)] lg:max-w-[500px] lg:rounded-md lg:border lg:border-white/10">
      <header className="grid grid-cols-[48px_1fr_96px] items-center">
        <button onClick={onBack} className="icon-btn" aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-center text-2xl font-black">{game.title.replace(/\s\d+$/, "")}</h1>
        <div className="flex justify-end gap-2">
          <button className="icon-btn" aria-label="Share">
            <Share2 size={21} />
          </button>
        </div>
      </header>

      <section className="mt-7 grid grid-cols-[39%_1fr] gap-4">
        <GameThumb title={game.title} genre={game.genre} className="aspect-[0.82]" />
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <img src={game.author.avatar ?? "/zeel-logo.png"} className="h-12 w-12 rounded-full border border-zeel-primary object-cover" alt="" />
            <div className="min-w-0">
              <div className="truncate text-lg font-black">@{game.author.username}</div>
              <div className="text-sm text-white/60">Creator</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_54px] gap-3">
            <button className="h-14 rounded-md bg-zeel-primary text-lg font-black shadow-neon">Follow</button>
            <button className="grid h-14 place-items-center rounded-md border border-white/10 bg-white/[0.08]" aria-label="Message">
              <MessageCircle size={22} />
            </button>
          </div>
          <p className="mt-5 text-sm leading-6 text-white/75">
            Swipe, dodge, and score in a fast ZEEL arcade challenge built for touch play.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[game.genre, "Endless", "Single Player"].map((tag) => (
              <span key={tag} className="rounded-full bg-white/[0.08] px-3 py-1 text-sm font-bold text-zeel-cyan">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-4 divide-x divide-white/10 rounded-md border border-white/10 bg-white/[0.04] py-4 text-center">
        <Stat icon={<Play />} value={Intl.NumberFormat("en", { notation: "compact" }).format(game.playCount)} label="Plays" />
        <Stat icon={<Heart />} value={Intl.NumberFormat("en", { notation: "compact" }).format(game.likesCount || 1200)} label="Likes" />
        <Stat icon={<MessageCircle />} value={String(game.commentsCount || 84)} label="Comments" />
        <Stat icon={<Share2 />} value="156" label="Shares" />
      </section>

      <nav className="mt-7 grid grid-cols-3 border-b border-white/10 text-center text-lg font-bold">
        {["Leaderboard", "Levels", "Achievements"].map((tab, index) => (
          <button key={tab} className={`relative h-14 ${index === 0 ? "text-zeel-primary" : "text-white/70"}`}>
            {tab}
            {index === 0 ? <span className="absolute bottom-0 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-zeel-primary" /> : null}
          </button>
        ))}
      </nav>

      <section className="mt-5 rounded-md border border-white/10 bg-white/[0.035] p-3">
        {names.map((name, index) => (
          <div key={name} className={`flex items-center gap-3 rounded-md px-3 py-3 ${name === "zeel_creator" ? "bg-zeel-cyan/10" : ""}`}>
            <div className={`w-8 text-xl font-black ${index < 3 ? "text-[#FFB703]" : "text-white/65"}`}>{index === 5 ? 12 : index + 1}</div>
            <img src={game.author.avatar ?? "/zeel-logo.png"} className="h-11 w-11 rounded-full border border-zeel-primary object-cover" alt="" />
            <div className="min-w-0 flex-1 truncate font-black">{name}</div>
            <div className={name === "zeel_creator" ? "font-black text-zeel-cyan" : "font-black text-zeel-primary"}>
              {Intl.NumberFormat("en").format(98765 - index * 9870)}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Achievements</h2>
          <button className="inline-flex items-center gap-1 font-bold text-zeel-primary">
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {badges.map((badge, index) => (
            <div key={badge} className="grid h-32 min-w-32 place-items-center rounded-md border border-white/10 bg-white/[0.06] p-3 text-center">
              {index % 2 ? <ShieldCheck className="text-zeel-primary" size={34} /> : <Trophy className="text-zeel-cyan" size={34} />}
              <div className="font-black">{badge}</div>
              <div className="text-xs text-white/55">Unlocked</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="px-2">
      <div className="flex items-center justify-center gap-2 text-xl font-black text-white">
        <span className="text-zeel-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span> {value}
      </div>
      <div className="mt-1 text-sm text-white/60">{label}</div>
    </div>
  );
}
