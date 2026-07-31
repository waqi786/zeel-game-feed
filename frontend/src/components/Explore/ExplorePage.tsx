import { Bell, ChevronRight, Gamepad2, Joystick, Puzzle, Rocket, Search, Trophy, UserPlus } from "lucide-react";
import { useEffect } from "react";
import type { Game } from "../../store/feedStore";
import { useFeedStore } from "../../store/feedStore";
import { GameThumb } from "../common/GameThumb";
import { LogoMark } from "../common/LogoMark";

type Props = {
  onGame: (game: Game) => void;
};

const categories = [
  { label: "Action", icon: Gamepad2, tone: "text-zeel-primary" },
  { label: "Arcade", icon: Joystick, tone: "text-zeel-cyan" },
  { label: "Puzzle", icon: Puzzle, tone: "text-[#A15CFF]" },
  { label: "Racing", icon: Trophy, tone: "text-[#FFB703]" },
  { label: "Adventure", icon: Rocket, tone: "text-zeel-cyan" }
];

export default function ExplorePage({ onGame }: Props) {
  const { games, fetchNextPage } = useFeedStore();

  useEffect(() => {
    if (!games.length) void fetchNextPage(true);
  }, [fetchNextPage, games.length]);

  const featured = games[2] ?? games[0];
  const trending = games.slice(0, 8);
  const creators = [...new Map(games.map((game) => [game.author.username, game.author])).values()].slice(0, 4);

  return (
    <main className="relative z-10 mx-auto h-[100dvh] max-w-[600px] overflow-y-auto bg-[#09090B] px-4 pb-28 pt-[calc(1.2rem+env(safe-area-inset-top))] text-white lg:my-4 lg:h-[calc(100dvh-32px)] lg:max-w-[500px] lg:rounded-md lg:border lg:border-white/10">
      <header className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <LogoMark size="sm" />
          <div className="text-[28px] font-black leading-none text-zeel-primary">ZEEL</div>
        </div>
        <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 text-white/70">
          <Search size={20} />
          <input className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/50 focus:ring-0" placeholder="Search games or creators" />
        </label>
        <button className="icon-btn relative" aria-label="Notifications">
          <Bell size={21} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-zeel-primary" />
        </button>
      </header>

      <section className="mt-7">
        <SectionTitle title="Discover" action="View all" />
        {featured ? (
          <button onClick={() => onGame(featured)} className="relative mt-3 block w-full overflow-hidden rounded-md border border-white/12 text-left">
            <GameThumb title={featured.title} genre={featured.genre} compact className="aspect-[1.95]" />
            <div className="absolute inset-0 flex flex-col justify-center bg-black/25 p-5">
              <h2 className="max-w-[48%] text-2xl font-black">{featured.title.replace(/\s\d+$/, "")}</h2>
              <p className="mt-2 max-w-[44%] text-sm font-semibold text-white/75">Race through the neon arcade</p>
              <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-zeel-primary px-5 py-3 text-sm font-black shadow-neon">
                <Rocket size={16} /> Play Now
              </span>
            </div>
          </button>
        ) : null}
      </section>

      <section className="mt-8">
        <SectionTitle title="Trending Games" action="View all" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {trending.slice(0, 4).map((game) => (
            <GameTile key={game.uuid} game={game} onClick={() => onGame(game)} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle title="Popular Creators" action="View all" />
        <div className="mt-3 divide-y divide-white/10">
          {creators.map((creator) => (
            <div key={creator.uuid} className="flex items-center gap-3 py-3">
              <img src={creator.avatar ?? "/zeel-logo.png"} className="h-12 w-12 rounded-full border border-zeel-primary object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-black">{creator.username}</div>
                <div className="text-sm text-white/55">Creator profile</div>
              </div>
              <button className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 font-bold text-zeel-primary">
                <UserPlus size={17} /> Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <h2 className="text-xl font-black">Categories</h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {categories.map(({ label, icon: Icon, tone }) => (
            <button key={label} className="grid h-24 min-w-24 place-items-center rounded-md border border-white/10 bg-white/[0.06] px-3">
              <Icon size={30} className={tone} />
              <span className="text-sm font-bold">{label}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-black">{title}</h1>
      <button className="inline-flex items-center gap-1 text-sm font-bold text-zeel-primary">
        {action} <ChevronRight size={16} />
      </button>
    </div>
  );
}

function GameTile({ game, onClick }: { game: Game; onClick: () => void }) {
  return (
    <button onClick={onClick} className="min-w-0 text-left">
      <GameThumb title={game.title} genre={game.genre} compact />
      <div className="mt-2 line-clamp-1 font-black">{game.title.replace(/\s\d+$/, "")}</div>
      <div className="text-sm font-bold text-white/65">{Intl.NumberFormat("en", { notation: "compact" }).format(game.playCount)} plays</div>
    </button>
  );
}
