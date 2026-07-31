import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, FileArchive, Gamepad2, Globe2, ImagePlus, Lock, Puzzle, Rocket, Trophy, Upload, X } from "lucide-react";
import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "../../store/authStore";
import { useFeedStore } from "../../store/feedStore";
import { useUploadStore } from "../../store/uploadStore";

type Props = {
  open: boolean;
  onClose: () => void;
  onAuth: () => void;
};

const maxBytes = 50 * 1024 * 1024;
const categories = [
  { label: "Action", icon: Gamepad2 },
  { label: "Arcade", icon: Trophy },
  { label: "Puzzle", icon: Puzzle },
  { label: "Racing", icon: Briefcase },
  { label: "Adventure", icon: Rocket }
];

export function UploadModal({ open, onClose, onAuth }: Props) {
  const user = useAuthStore((state) => state.user);
  const { uploadGame, uploadProgress, isUploading } = useUploadStore();
  const addGame = useFeedStore((state) => state.addGame);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Action");
  const [visibility, setVisibility] = useState("Public");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | undefined>();
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return onAuth();
    if (!file) return reject("Choose a ZIP game archive first.");
    if (file.size > maxBytes) return reject("Maximum game size is 50MB.");
    const game = await uploadGame({ title, description, file, thumbnail });
    addGame(game);
    setTitle("");
    setDescription("");
    setFile(null);
    setThumbnail(undefined);
    onClose();
  };

  const reject = (message = "Only valid ZIP files under 50MB are allowed.") => {
    setError(message);
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  };

  const acceptZip = (candidate?: File) => {
    if (!candidate) return;
    if (!candidate.name.toLowerCase().endsWith(".zip")) return reject("Game upload must be a ZIP archive.");
    if (candidate.size > maxBytes) return reject("Maximum game size is 50MB.");
    setError("");
    setFile(candidate);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-end bg-black/80 p-0 backdrop-blur-md sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={submit}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: shake ? [0, -6, 6, -4, 0] : 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
          className="h-[100dvh] w-full max-w-[600px] overflow-y-auto border border-white/10 bg-[#09090B] px-4 pb-28 pt-[calc(1rem+env(safe-area-inset-top))] text-white shadow-neon sm:h-[92dvh] sm:rounded-md"
          >
            <header className="mb-7 grid grid-cols-[48px_1fr_96px] items-center gap-2">
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close upload">
                <X size={20} />
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-black">Upload Game</h2>
                <p className="mt-1 text-sm text-white/60">Share your game with the world</p>
              </div>
              <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.08] text-sm font-bold">
                <Briefcase size={16} /> Drafts
              </button>
            </header>

            <DropInput
              large
              icon={<Upload size={52} />}
              label={file ? file.name : "Drag and drop your game file"}
              helper="ZIP or HTML5 package, max size 50MB"
              accept=".zip"
              onFile={acceptZip}
            />

            {error ? (
              <div className="mt-4 rounded-md border border-zeel-primary/45 bg-zeel-primary/10 px-4 py-3 text-sm font-bold">
                {error}
              </div>
            ) : null}

            <div className="mt-7 flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <h3 className="text-xl font-black">Game Thumbnail</h3>
                <p className="mt-1 text-white/55">Recommended 16:9</p>
              </div>
              <DropInput
                icon={<ImagePlus size={24} />}
                label={thumbnail ? thumbnail.name : "Add Image"}
                accept="image/png,image/jpeg,image/webp"
                onFile={setThumbnail}
              />
            </div>

            <Field label="Game Title" count={`${title.length}/40`}>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value.slice(0, 40))}
                placeholder="Enter game title"
                required
                minLength={2}
                className="field rounded-full py-4 text-base"
              />
            </Field>

            <Field label="Description" count={`${description.length}/200`}>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value.slice(0, 200))}
                placeholder="Describe your game..."
                maxLength={200}
                rows={4}
                className="field resize-none rounded-md py-4 text-base"
              />
            </Field>

            <section className="mt-7">
              <h3 className="text-xl font-black">Category</h3>
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {categories.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setCategory(label)}
                    className={`grid h-24 min-w-24 place-items-center rounded-md border px-3 ${
                      category === label ? "border-zeel-primary bg-zeel-primary/10 text-white" : "border-white/10 bg-white/[0.06] text-white/75"
                    }`}
                  >
                    <Icon size={30} className={category === label ? "text-zeel-primary" : "text-zeel-cyan"} />
                    <span className="text-sm font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-xl font-black">Visibility</h3>
              <div className="mt-4 grid grid-cols-3 rounded-md border border-white/10 bg-white/[0.05] p-1">
                {[
                  ["Public", <Globe2 size={19} />],
                  ["Unlisted", <Lock size={19} />],
                  ["Private", <Lock size={19} />]
                ].map(([label, icon]) => (
                  <button
                    key={label as string}
                    type="button"
                    onClick={() => setVisibility(label as string)}
                    className={`flex h-16 flex-col items-center justify-center gap-1 rounded-md text-sm font-bold ${
                      visibility === label ? "bg-zeel-primary text-white shadow-neon" : "text-white/65"
                    }`}
                  >
                    {icon as ReactNode}
                    {label as string}
                  </button>
                ))}
              </div>
            </section>

            {isUploading ? (
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-zeel-primary transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            ) : null}

            <button
              disabled={isUploading}
              className="mt-7 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-zeel-primary text-xl font-black text-white shadow-neon transition hover:scale-[1.01] disabled:opacity-60"
            >
              <Upload size={24} /> {isUploading ? "Uploading..." : "Upload Game"}
            </button>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({ label, count, children }: { label: string; count: string; children: ReactNode }) {
  return (
    <label className="mt-6 block">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xl font-black">{label}</span>
        <span className="text-sm font-semibold text-white/45">{count}</span>
      </div>
      {children}
    </label>
  );
}

function DropInput({
  icon,
  label,
  helper,
  accept,
  onFile,
  large = false
}: {
  icon: ReactNode;
  label: string;
  helper?: string;
  accept: string;
  onFile: (file?: File) => void;
  large?: boolean;
}) {
  return (
    <label
      className={
        large
          ? "grid min-h-64 cursor-pointer place-items-center rounded-md border border-dashed border-zeel-primary bg-white/[0.035] p-6 text-center transition hover:bg-zeel-primary/10"
          : "inline-flex h-12 min-w-36 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-white/25 bg-white/[0.06] px-4 text-zeel-primary transition hover:border-zeel-primary"
      }
    >
      <span className={large ? "text-zeel-primary" : "text-zeel-primary"}>{icon}</span>
      <span className={large ? "block" : "min-w-0 truncate text-sm font-bold"}>
        <span className={large ? "block text-xl font-black" : ""}>{label}</span>
        {helper ? <span className="mt-2 block text-base font-semibold text-white/55">{helper}</span> : null}
      </span>
      <input type="file" accept={accept} className="sr-only" onChange={(event) => onFile(event.target.files?.[0])} />
    </label>
  );
}
