import clsx from "clsx";
import { Play } from "lucide-react";

type Props = {
  title: string;
  genre?: string;
  compact?: boolean;
  className?: string;
};

export function GameThumb({ title, genre = "Arcade", compact = false, className }: Props) {
  const seed = Array.from(title).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const palette = [
    ["#F50575", "#00E5FF", "#09090B"],
    ["#A15CFF", "#F50575", "#0B0712"],
    ["#00E5FF", "#FFB703", "#071018"],
    ["#F50575", "#FFFFFF", "#11070D"]
  ][seed % 4];

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-md border border-white/12 bg-[#09090B]",
        compact ? "aspect-[1.05]" : "aspect-[1.18]",
        className
      )}
      style={{
        boxShadow: `inset 0 0 46px ${palette[0]}22`
      }}
    >
      <div className="absolute inset-0 bg-[#09090B]" />
      <div
        className="absolute inset-x-[9%] bottom-0 top-[14%] opacity-90"
        style={{
          clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)",
          backgroundColor: "rgba(255,255,255,.035)"
        }}
      />
      <div className="absolute inset-x-[13%] bottom-0 top-[20%] flex justify-between">
        {[0, 1, 2].map((line) => (
          <span key={line} className="h-full w-px bg-white/10" />
        ))}
      </div>
      {[0, 1, 2, 3, 4].map((item) => (
        <span
          key={item}
          className="absolute h-2 rounded-full shadow-[0_0_18px_currentColor]"
          style={{
            width: `${28 + ((seed + item) % 3) * 14}%`,
            left: `${12 + ((seed * (item + 3)) % 48)}%`,
            top: `${18 + item * 14}%`,
            color: item % 2 ? palette[1] : palette[0],
            backgroundColor: item % 2 ? palette[1] : palette[0],
            transform: `rotate(${(seed + item * 17) % 12 - 6}deg)`
          }}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <span
          key={`spark-${item}`}
          className="absolute block shadow-[0_0_18px_currentColor]"
          style={{
            width: `${8 + (item % 3) * 4}px`,
            height: `${8 + (item % 3) * 4}px`,
            left: `${8 + ((seed + item * 19) % 84)}%`,
            top: `${8 + ((seed + item * 23) % 72)}%`,
            color: item % 2 ? palette[1] : palette[0],
            backgroundColor: item % 2 ? palette[1] : palette[0],
            clipPath: item % 2 ? "circle(50%)" : "polygon(50% 0, 100% 100%, 0 100%)"
          }}
        />
      ))}
      <div
        className="absolute bottom-[17%] left-1/2 h-10 w-10 -translate-x-1/2 rounded-full shadow-[0_0_28px_currentColor]"
        style={{ color: palette[0], backgroundColor: palette[0] }}
      >
        <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-white/90" />
      </div>
      {!compact ? (
        <div className="absolute inset-x-0 bottom-0 bg-black/55 p-3 backdrop-blur-md">
          <div className="line-clamp-1 text-sm font-black text-white">{title}</div>
          <div className="mt-1 flex items-center gap-1 text-xs font-bold text-white/70">
            <Play size={12} fill="currentColor" /> {genre}
          </div>
        </div>
      ) : null}
    </div>
  );
}
