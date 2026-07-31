import { Edit3, Heart, MessageCircle, Plus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFeedStore } from "../../store/feedStore";
import { GameThumb } from "../common/GameThumb";
import { LogoMark } from "../common/LogoMark";

type InboxMode = "messages" | "activity";

const messages = [
  ["arcade_master", "Can you add another runner level?", "2m"],
  ["pixel_player", "The new profile screen looks clean.", "6m"],
  ["game_maker", "I uploaded a puzzle build for review.", "18m"],
  ["cyber_ninja", "Leaderboard is getting competitive.", "1h"]
];

const activity = [
  ["arcade_master", "liked your game", "Orbit Dash", "2m", Heart],
  ["pixel_player", "commented on your game", "This game feels polished.", "5m", MessageCircle],
  ["game_maker", "started following you", "", "12m", Plus],
  ["cyber_ninja", "liked your comment", "More levels soon.", "1h", Heart]
] as const;

export default function InboxPage() {
  const { games, fetchNextPage } = useFeedStore();
  const [mode, setMode] = useState<InboxMode>("activity");
  const [read, setRead] = useState(false);

  useEffect(() => {
    if (!games.length) void fetchNextPage(true);
  }, [fetchNextPage, games.length]);

  const toast = (message: string) => {
    window.dispatchEvent(new CustomEvent("zeel:toast", { detail: message }));
  };

  return (
    <main className="relative z-10 mx-auto h-[100dvh] max-w-[600px] overflow-y-auto bg-[#09090B] px-4 pb-28 pt-[calc(1.2rem+env(safe-area-inset-top))] text-white lg:my-4 lg:h-[calc(100dvh-32px)] lg:max-w-[500px] lg:rounded-md lg:border lg:border-white/10">
      <header className="grid grid-cols-[96px_1fr_48px] items-center">
        <div className="flex items-center gap-2">
          <LogoMark size="sm" />
          <div className="text-2xl font-black text-zeel-primary">ZEEL</div>
        </div>
        <h1 className="text-center text-2xl font-black">Inbox</h1>
        <button className="icon-btn" onClick={() => toast("New message composer opened")} aria-label="New message">
          <Edit3 size={21} />
        </button>
      </header>

      <nav className="mt-7 grid grid-cols-2 border-b border-white/10 text-center text-xl font-bold">
        <button onClick={() => setMode("messages")} className={`relative h-14 ${mode === "messages" ? "text-white" : "text-white/50"}`}>
          Messages
          {mode === "messages" ? <span className="absolute bottom-0 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-zeel-primary" /> : null}
        </button>
        <button onClick={() => setMode("activity")} className={`relative h-14 ${mode === "activity" ? "text-white" : "text-white/50"}`}>
          Activity
          {mode === "activity" ? <span className="absolute bottom-0 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-zeel-primary" /> : null}
        </button>
      </nav>

      {mode === "messages" ? (
        <section className="mt-5 rounded-md border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black">Messages</h2>
            <button className="font-bold text-zeel-primary" onClick={() => toast("All messages opened")}>Open all</button>
          </div>
          {messages.map(([name, text, time], index) => (
            <button
              key={name}
              onClick={() => toast(`Opened chat with ${name}`)}
              className="flex w-full items-center gap-3 border-b border-white/10 py-4 text-left last:border-b-0"
            >
              <Avatar label={name.slice(0, 2).toUpperCase()} />
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 font-black">{name}</div>
                <div className="line-clamp-1 text-sm text-white/55">{text}</div>
              </div>
              <div className="text-sm font-bold text-white/45">{time}</div>
              {index === 0 ? <span className="h-2.5 w-2.5 rounded-full bg-zeel-primary" /> : null}
            </button>
          ))}
        </section>
      ) : (
        <>
          <section className="mt-5 rounded-md border border-white/10 bg-white/[0.035] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black">New</h2>
              <button className="font-bold text-zeel-primary" onClick={() => setRead(true)}>
                Mark all as read
              </button>
            </div>
            {activity.slice(0, 3).map(([name, action, detail, time, Icon], index) => (
              <ActivityRow
                key={name}
                name={name}
                action={action}
                detail={detail}
                time={time}
                icon={Icon}
                game={games[index]}
                muted={read}
                onClick={() => toast(`${name} ${action}`)}
              />
            ))}
          </section>

          <section className="mt-5 rounded-md border border-white/10 bg-white/[0.035] p-4">
            <h2 className="mb-3 text-xl font-black">Earlier</h2>
            {activity.slice(3).map(([name, action, detail, time, Icon], index) => (
              <ActivityRow
                key={name}
                name={name}
                action={action}
                detail={detail}
                time={time}
                icon={Icon}
                game={games[index + 3]}
                muted
                onClick={() => toast(`${name} ${action}`)}
              />
            ))}
          </section>
        </>
      )}
    </main>
  );
}

function Avatar({ label }: { label: string }) {
  return (
    <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-zeel-primary bg-[#160713] text-xs font-black text-white">
      <span className="absolute h-8 w-8 rotate-45 bg-zeel-primary/80" />
      <span className="relative">{label}</span>
    </span>
  );
}

function ActivityRow({
  name,
  action,
  detail,
  time,
  icon: Icon,
  game,
  muted,
  onClick
}: {
  name: string;
  action: string;
  detail: string;
  time: string;
  icon: typeof Heart;
  game?: { title: string; genre: string };
  muted: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-white/10 py-4 text-left last:border-b-0">
      <div className="relative">
        <Avatar label={name.slice(0, 2).toUpperCase()} />
        <span className={`absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full ${muted ? "bg-white/20" : "bg-zeel-primary"} text-white`}>
          <Icon size={17} fill="currentColor" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-base">
          <span className="font-black">{name}</span> <span className="text-white/75">{action}</span>
        </div>
        {detail ? <div className="line-clamp-1 text-sm text-white/55">{detail}</div> : null}
        <div className="text-sm text-white/45">{time} ago</div>
      </div>
      {action.includes("following") ? (
        <span className="h-11 shrink-0 rounded-full bg-zeel-primary px-4 py-3 text-sm font-black shadow-neon">
          <UserPlus size={16} className="mr-1 inline" /> Follow back
        </span>
      ) : game ? (
        <GameThumb title={game.title} genre={game.genre} compact className="h-16 w-24 shrink-0" />
      ) : null}
    </button>
  );
}
