import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { LogoMark } from "./LogoMark";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: Props) {
  const { login, register } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password123");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === "login") {
      await login(email, password);
    } else {
      await register(username, email, password);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[75] grid place-items-center bg-black/70 p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={submit}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="w-full max-w-[430px] rounded-md border border-white/10 bg-[#14141e]/95 p-5 text-white shadow-neon"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogoMark size="md" />
                <h2 className="text-2xl font-black">ZEEL</h2>
              </div>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close auth">
                <X size={18} />
              </button>
            </div>
            <div className="mb-5 grid grid-cols-2 rounded-full bg-white/10 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={mode === "login" ? "seg-active" : "seg"}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={mode === "register" ? "seg-active" : "seg"}
              >
                Register
              </button>
            </div>
            <div className="grid gap-3">
              {mode === "register" ? (
                <input className="field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              ) : null}
              <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input
                className="field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="mt-2 h-12 rounded-full bg-zeel-primary font-black text-white shadow-neon">
                {mode === "login" ? "Login" : "Create Account"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
