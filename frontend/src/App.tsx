import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { FeedViewport } from "./components/Feed/FeedViewport";
import type { Game } from "./store/feedStore";
import { AuthModal } from "./components/common/AuthModal";
import { Navbar } from "./components/common/Navbar";
import { Toast } from "./components/common/Toast";
import { UploadModal } from "./components/Upload/UploadModal";
import { LoadingSkeleton } from "./components/common/LoadingSkeleton";
import { LogoMark } from "./components/common/LogoMark";
import { useAuthStore } from "./store/authStore";
import { useTheme } from "./hooks/useTheme";
import { UserRound } from "lucide-react";

const ProfilePage = lazy(() => import("./components/Profile/ProfilePage"));
const ExplorePage = lazy(() => import("./components/Explore/ExplorePage"));
const InboxPage = lazy(() => import("./components/Inbox/InboxPage"));
const GameDetailPage = lazy(() => import("./components/GameDetail/GameDetailPage"));

type View = "feed" | "search" | "inbox" | "profile" | "detail";

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const user = useAuthStore((state) => state.user);
  const [view, setView] = useState<View>("feed");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);
  useTheme();

  const openGame = (game: Game) => {
    setSelectedGame(game);
    setView("detail");
  };

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-[#09090B] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[#09090B]" />
      {view === "feed" ? <div className="pointer-events-none fixed inset-x-0 top-0 z-20 mx-auto h-[104px] max-w-[600px] bg-[#09090B] lg:top-4 lg:h-[98px] lg:max-w-[500px]" /> : null}
      {view === "feed" ? <header className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[600px] items-center justify-between px-4 pt-[calc(.75rem+env(safe-area-inset-top))] lg:top-4 lg:max-w-[500px]">
        <div className="flex items-center gap-2">
          <LogoMark size="sm" />
          <div className="text-[30px] font-black uppercase leading-none tracking-normal text-zeel-primary">ZEEL</div>
        </div>
        <button
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white shadow-[0_0_18px_rgba(245,5,117,.28)]"
          onClick={() => setView("profile")}
          aria-label="Open profile"
        >
          {user?.avatar ? <img src={user.avatar} className="h-full w-full rounded-full object-cover" alt="" /> : <UserRound size={21} />}
        </button>
      </header> : null}
      <AnimatePresence mode="wait">
        {view === "feed" ? (
          <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FeedViewport
              onUpload={() => setUploadOpen(true)}
              onAuth={() => setAuthOpen(true)}
            />
          </motion.div>
        ) : view === "search" ? (
          <motion.div key="search" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Suspense fallback={<LoadingSkeleton />}>
              <ExplorePage onGame={openGame} />
            </Suspense>
          </motion.div>
        ) : view === "inbox" ? (
          <motion.div key="inbox" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Suspense fallback={<LoadingSkeleton />}>
              <InboxPage />
            </Suspense>
          </motion.div>
        ) : view === "detail" && selectedGame ? (
          <motion.div key="detail" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Suspense fallback={<LoadingSkeleton />}>
              <GameDetailPage game={selectedGame} onBack={() => setView("search")} />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Suspense fallback={<LoadingSkeleton />}>
              <ProfilePage onAuth={() => setAuthOpen(true)} onGame={openGame} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar
        active={view}
        onFeed={() => setView("feed")}
        onSearch={() => setView("search")}
        onInbox={() => setView("inbox")}
        onProfile={() => setView("profile")}
        onUpload={() => setUploadOpen(true)}
      />
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onAuth={() => setAuthOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <Toast />
    </div>
  );
}
