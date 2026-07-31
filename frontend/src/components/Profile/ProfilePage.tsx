import { Bell, ChevronDown, Gamepad2, Grid3X3, Heart, LogOut, MoreVertical } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import type { Game } from "../../store/feedStore";
import { useAuthStore } from "../../store/authStore";
import { useFeedStore } from "../../store/feedStore";
import { useCollectionStore } from "../../store/collectionStore";
import { GameThumb } from "../common/GameThumb";
import { LogoMark } from "../common/LogoMark";
import { useState } from "react";

type ProfileTab = "games" | "played" | "saved";

export default function ProfilePage({ onAuth, onGame }: { onAuth: () => void; onGame: (game: Game) => void }) {
  const { user, logout } = useAuthStore();
  const { games, fetchNextPage } = useFeedStore();
  const { collections, fetchCollections } = useCollectionStore();
  const [tab, setTab] = useState<ProfileTab>("games");

  useEffect(() => {
    if (!games.length) void fetchNextPage(true);
  }, [fetchNextPage, games.length]);

  useEffect(() => {
    if (user) void fetchCollections().catch(() => undefined);
  }, [fetchCollections, user]);

  const myGames = games.slice(0, 9);
  const playedGames = games.slice(9, 18);
  const savedGames = collections.flatMap((collection) => collection.games);
  const profile = {
    username: user?.username ?? "zeel_creator",
    avatar: user?.avatar ?? "/zeel-logo.png",
    bio: user?.bio ?? "Building fun games for everyone."
  };

  return (
    <main className="relative z-10 mx-auto h-[100dvh] max-w-[600px] overflow-y-auto bg-[#09090B] px-4 pb-28 pt-[calc(1.2rem+env(safe-area-inset-top))] text-white lg:my-4 lg:h-[calc(100dvh-32px)] lg:max-w-[500px] lg:rounded-md lg:border lg:border-white/10">
      <header className="flex items-center justify-between">
        <button className="icon-btn" onClick={() => history.back()} aria-label="Back">
          <ChevronDown className="rotate-90" size={22} />
        </button>
        <div className="flex items-center gap-3">
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <button className="icon-btn" onClick={() => user ? void logout() : onAuth()} aria-label={user ? "Logout" : "Sign in"}>
            <LogOut size={18} />
          </button>
          <button className="icon-btn" aria-label="More">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <section className="mt-5 text-center">
        {user?.avatar ? (
          <img
            src={profile.avatar}
            className="mx-auto h-28 w-28 rounded-full border-4 border-zeel-primary object-cover shadow-neon"
            alt=""
          />
        ) : (
          <LogoMark size="xl" className="mx-auto border-4" />
        )}
        <h1 className="mt-4 text-3xl font-black">{profile.username}</h1>
        <p className="mt-1 text-lg font-semibold text-white/75">Game Developer</p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">{profile.bio}</p>
        <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 divide-x divide-white/15 text-center">
          <Metric value="24" label="Games" />
          <Metric value="12.4K" label="Followers" />
          <Metric value="98" label="Following" />
        </div>
        <div className="mt-6 grid grid-cols-[1fr_1fr_56px] gap-3">
          <button className="h-14 rounded-md bg-zeel-primary text-lg font-black shadow-neon">Follow</button>
          <button className="h-14 rounded-md border border-white/10 bg-white/[0.08] text-lg font-black">Message</button>
          <button className="grid h-14 place-items-center rounded-md border border-white/10 bg-white/[0.08]" aria-label="More profile actions">
            <ChevronDown size={24} />
          </button>
        </div>
      </section>

      <nav className="mt-7 grid grid-cols-3 border-y border-white/10">
        <Tab icon={<Grid3X3 />} active={tab === "games"} onClick={() => setTab("games")} label="My games" />
        <Tab icon={<Gamepad2 />} active={tab === "played"} onClick={() => setTab("played")} label="Played games" />
        <Tab icon={<Heart />} active={tab === "saved"} onClick={() => setTab("saved")} label="Saved games" />
      </nav>

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">{tab === "saved" ? "Saved Games" : tab === "played" ? "Played Games" : "My Games"}</h2>
          <button className="font-bold text-zeel-primary">View all</button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tab !== "saved" ? (tab === "played" ? playedGames : myGames).map((game) => (
            <button key={game.uuid} onClick={() => onGame(game)} className="min-w-0 text-left">
              <GameThumb title={game.title} genre={game.genre} />
              <div className="mt-2 line-clamp-1 text-lg font-black">{game.title.replace(/\s\d+$/, "")}</div>
              <div className="text-sm font-bold text-white/65">
                {Intl.NumberFormat("en", { notation: "compact" }).format(game.playCount)} plays
              </div>
            </button>
          )) : savedGames.length ? savedGames.slice(0, 9).map((saved) => {
            const fullGame = games.find((game) => game.uuid === saved.uuid);
            return (
              <button key={saved.uuid} onClick={() => fullGame ? onGame(fullGame) : undefined} className="min-w-0 text-left">
                <GameThumb title={saved.title} genre={saved.genre} />
                <div className="mt-2 line-clamp-1 text-lg font-black">{saved.title.replace(/\s\d+$/, "")}</div>
                <div className="text-sm font-bold text-white/65">
                  {Intl.NumberFormat("en", { notation: "compact" }).format(saved.playCount)} plays
                </div>
              </button>
            );
          }) : (
            <div className="col-span-2 rounded-md border border-white/10 bg-white/[0.04] p-5 text-sm font-semibold text-white/65 sm:col-span-3">
              Saved games will appear here after you tap Save on the feed.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-sm text-white/65">{label}</div>
    </div>
  );
}

function Tab({ icon, active = false, onClick, label }: { icon: ReactNode; active?: boolean; onClick: () => void; label: string }) {
  return (
    <button className={`relative grid h-16 place-items-center ${active ? "text-zeel-primary" : "text-white/60"}`} onClick={onClick} aria-label={label}>
      <span className="[&>svg]:h-7 [&>svg]:w-7">{icon}</span>
      {active ? <span className="absolute bottom-0 h-1 w-20 rounded-full bg-zeel-primary" /> : null}
    </button>
  );
}
