import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, FolderPlus, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useCollectionStore } from "../../store/collectionStore";
import type { Game } from "../../store/feedStore";

type Props = {
  game: Game | null;
  onClose: () => void;
};

export function SaveSheet({ game, onClose }: Props) {
  const { collections, fetchCollections, createCollection, toggleSave } = useCollectionStore();
  const [name, setName] = useState("");

  useEffect(() => {
    if (game) void fetchCollections();
  }, [fetchCollections, game]);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    await createCollection(name.trim());
    setName("");
  };

  return (
    <AnimatePresence>
      {game ? (
        <motion.div className="fixed inset-0 z-[73] grid place-items-end bg-black/70 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="w-full max-w-[520px] rounded-t-md border border-white/10 bg-[#14141e]/95 p-5 text-white shadow-neon sm:mx-auto sm:mb-6 sm:rounded-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black">Save to Collection</h2>
              <button className="icon-btn" onClick={onClose} aria-label="Close save">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-2">
              {collections.map((collection) => (
                <button
                  key={collection.uuid}
                  onClick={async () => {
                    const saved = await toggleSave(game.uuid, collection.uuid);
                    window.dispatchEvent(new CustomEvent("zeel:toast", { detail: saved ? "Saved" : "Removed" }));
                  }}
                  className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.06] px-4 py-3 text-left"
                >
                  <span className="flex items-center gap-3 font-bold"><Bookmark size={17} /> {collection.name}</span>
                  <span className="text-xs text-white/55">{collection.gamesCount}</span>
                </button>
              ))}
            </div>
            <form onSubmit={create} className="mt-4 flex gap-2">
              <input className="field" placeholder="New collection" value={name} onChange={(event) => setName(event.target.value)} />
              <button className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-zeel-primary shadow-neon" aria-label="Create collection">
                <FolderPlus size={18} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
