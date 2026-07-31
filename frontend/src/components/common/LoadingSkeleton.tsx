import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-zeel-dark">
      <motion.div
        className="h-16 w-16 border border-white/15 bg-white/10 shadow-neon backdrop-blur"
        animate={{ rotateX: 360, rotateY: 360, scale: [1, 1.12, 1] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      />
    </div>
  );
}
