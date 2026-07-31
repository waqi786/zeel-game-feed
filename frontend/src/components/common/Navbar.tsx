import { Home, MessageCircle, Plus, Search, UserRound } from "lucide-react";
import clsx from "clsx";

type Props = {
  active: "feed" | "search" | "inbox" | "profile" | "detail";
  onProfile: () => void;
  onFeed: () => void;
  onSearch: () => void;
  onInbox: () => void;
  onUpload: () => void;
};

export function Navbar({ active, onFeed, onSearch, onInbox, onProfile, onUpload }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[78px] max-w-[600px] items-center justify-around border-t border-white/10 bg-black/78 px-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:bottom-4 lg:max-w-[500px] lg:rounded-md lg:border">
      <button className={navButton(active === "feed")} onClick={onFeed} aria-label="Home">
        <Home size={24} />
        <span>Home</span>
      </button>
      <button className={navButton(active === "search")} onClick={onSearch} aria-label="Search">
        <Search size={24} />
        <span>Search</span>
      </button>
      <button
        onClick={onUpload}
        className="grid h-14 w-14 place-items-center rounded-full bg-zeel-primary text-white shadow-neon transition hover:scale-105 active:scale-95"
        aria-label="Upload"
      >
        <Plus size={30} strokeWidth={2.5} />
      </button>
      <button className={navButton(active === "inbox")} onClick={onInbox} aria-label="Inbox">
        <span className="relative">
          <MessageCircle size={24} />
          <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-zeel-primary px-1 text-[10px] font-black text-white">
            3
          </span>
        </span>
        <span>Inbox</span>
      </button>
      <button className={navButton(active === "profile")} onClick={onProfile} aria-label="Profile">
        <UserRound size={24} />
        <span>Profile</span>
      </button>
    </nav>
  );
}

function navButton(active: boolean) {
  return clsx(
    "grid h-12 min-w-12 place-items-center gap-0.5 rounded-md px-1 text-[11px] font-bold transition",
    active ? "text-zeel-cyan" : "text-white/70 hover:bg-white/10 hover:text-white"
  );
}
