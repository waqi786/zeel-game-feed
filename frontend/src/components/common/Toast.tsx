import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Toast() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      window.setTimeout(() => setMessage(""), 3000);
    };
    window.addEventListener("zeel:toast", handler);
    return () => window.removeEventListener("zeel:toast", handler);
  }, []);

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          className="fixed left-1/2 top-5 z-[80] w-[min(92vw,420px)] -translate-x-1/2 rounded-md border border-white/10 bg-black/80 px-4 py-3 text-sm text-white shadow-neon backdrop-blur-xl"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
